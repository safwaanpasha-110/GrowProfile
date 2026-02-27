# Instagram Platform APIs & Permissions

The Instagram Graph API provides endpoints for accessing and managing professional (Business/Creator) accounts. Key endpoints and permissions include:

- **Comment & Reply Endpoints:**  
  - `GET /{ig-media-id}/comments` – Retrieve comments on a media object (requires `instagram_business_manage_comments`).  
  - `POST /{comment-id}/replies` – Reply to a top-level comment (requires `instagram_business_manage_comments`). Only top-level comments can be replied to.【38†L120-L123】  
- **Messaging Endpoints (Instagram Login):**  
  - `POST /{IG_ACCOUNT_ID}/messages` – Send a message (text, media, etc.) to a user who has messaged your business (requires `instagram_business_manage_messages`)【18†L53-L60】. Note: You can only send a DM after the user has initiated a conversation (consent)【38†L31-L34】.  
  - `GET /{IG_ACCOUNT_ID}/messages` – List conversations or messages (requires `instagram_business_manage_messages`).  
- **User Profile Endpoint:**  
  - `GET /{IGSCOPED_ID}` with `fields=name,username,profile_pic,follower_count,is_user_follow_business,is_business_follow_user` – Get info on an Instagram user who messaged you【38†L168-L173】. The field `is_user_follow_business` indicates if that user follows your Business account【38†L168-L173】, allowing follow-check gating.  
- **OAuth Endpoints:**  
  - `https://www.instagram.com/oauth/authorize` – Start OAuth flow to obtain an authorization code (requires new scopes `instagram_business_basic`, `instagram_business_manage_comments`, `instagram_business_manage_messages`, `instagram_business_content_publish`)【52†L35-L38】.  
  - `https://api.instagram.com/oauth/access_token` – Exchange authorization code for a short-lived token【18†L55-L60】.  
  - `https://graph.instagram.com/access_token` – Exchange short-lived token for a long-lived (60-day) token【18†L55-L60】.  
  - `https://graph.instagram.com/refresh_access_token` – Refresh a long-lived token (extends by 60 more days).  

**Permissions:** All calls require the appropriate permission in the user’s token. For Instagram Login flow, request:  
`instagram_business_basic` (basic profile),  
`instagram_business_manage_comments` (read/reply comments),  
`instagram_business_manage_messages` (read/send DMs),  
and optionally `instagram_business_content_publish` (to post media)【18†L53-L60】. These correspond to the new scope values (old scopes like `business_basic` are deprecated after Jan 2025).  

# Webhooks & Real-time Updates

Use Webhooks for real-time events instead of polling:

- **Subscribe to Webhook Fields:** In your App Dashboard, enable the Webhooks product and subscribe to the **Instagram** fields: `comments` (for new comments) and `messages` (for incoming DMs). After a user logs in, call `POST /{IG_USER_ID}/subscribed_apps?subscribed_fields=comments,messages&access_token={token}`【18†L53-L60】.  
- **Verification & Security:** Implement your webhook endpoint to handle:  
  - **GET Verification Requests:** Meta will send a `hub.challenge` that you must echo back after verifying the `hub.verify_token`.  
  - **POST Event Notifications:** Meta sends JSON updates (e.g. a comment or message event). Verify the `X-Hub-Signature-256` header using your App Secret to ensure authenticity. Respond immediately with HTTP 200.  
- **Data to Store:** From comment webhooks, extract `comment_id` and IG user ID. From message webhooks, extract `sender.id` (Instagram-scoped ID) and message text. Use these to drive your automation logic.

# OAuth Login Flow & Tokens

Implement **Instagram Business Login** (the Instagram OAuth flow):

1. **Login Dialog:** Direct users to Instagram’s OAuth authorize URL with `client_id` (your IG App ID), `redirect_uri`, and `scope=instagram_business_basic,instagram_business_manage_comments,instagram_business_manage_messages,instagram_business_content_publish`【52†L35-L38】. (Set `response_type=code`.)  
2. **Authorization Code:** After the user consents, Instagram redirects back with `?code=AUTH_CODE`.  
3. **Exchange Code for Short Token:** POST to `https://api.instagram.com/oauth/access_token` with your `client_id`, `client_secret`, `redirect_uri`, and the code. You receive a JSON with `access_token` (short-lived, ~1 hour) and `user_id` (the user’s Instagram ID)【18†L53-L60】.  
4. **Exchange for Long Token:** Call `GET https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret={AppSecret}&access_token={short_token}` to get a **long-lived token** (60 days)【18†L53-L60】. Store this securely (e.g. in your database).  
5. **Refresh Token:** Before it expires, refresh the token by `GET https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token={long_token}` every ~60 days.  

**New Scopes Reminder:** As of late 2024, use the `instagram_business_...` scope names. The old `business_...` scopes are deprecated【52†L35-L38】.

# Rate Limits & Messaging Windows

Be aware of limits and rules:

- **Rate Limits (per IG Account):**  
  - **Messages:** ~100 calls/second for text/links/stickers, 10 calls/sec for audio/video【32†L761-L764】.  
  - **Replies to Comments:** 750 calls/hour for private replies (DMs to comments on posts/reels)【32†L782-L783】.  
  - (Comments and media calls count against the 4800×impressions formula as usual.)  

- **24-Hour Window:** You can only send freeform DM replies within 24 hours of the user’s last message. After 24h, you cannot send a standard message unless it’s using a supported tag.  
- **Human Agent Tag:** The `HUMAN_AGENT` message tag allows responding **outside** the 24h window *up to 7 days* after the user’s last message【52†L35-L38】. For example, you can mark a response as a “Human Agent” message to legally send a message 2 or 3 days after user contact. (Use this only in valid scenarios like delays or weekend closures.) This requires the `instagram_business_manage_messages` permission and App Review approval for the human-agent tag.  
- **Inbox Behavior:** Note that replies via the API will always deliver to the user’s “General” inbox (and mark conversation read only after sending a reply). New user conversations start in “Primary” or “Requests” as per IG rules.

# Implementation Checklist & App Review Strategy

1. **Meta Developer Setup:** Create a Meta App, add “Instagram API with Instagram Login” product. Enter your OAuth Redirect URI in the dashboard under *Instagram > API Setup*【52†L35-L38】.  
2. **Permissions & Review:** In App Review, request `instagram_business_basic`, `instagram_business_manage_comments`, `instagram_business_manage_messages`, etc. For each, demonstrate the login flow and UI showing how users grant them. Emphasize how your app provides value (e.g. instant replies, lead capture) and obeys policies. Also prepare for `HUMAN_AGENT` tag review if you plan to use it.  
3. **Business Verification:** Submit your business documents. Advanced Access is required since this is a public SaaS.  
4. **Webhook Implementation:** Deploy an HTTPS endpoint. Handle the GET challenge (echo `hub.challenge`) and validate POSTs (check `X-Hub-Signature-256`). Log incoming webhooks for debugging. Subscribe to `comments,messages` via `/me/subscribed_apps` after a user logs in.  
5. **Token Handling:** After OAuth, store the user’s IG user ID, Page ID (if Facebook Login), and long-lived token. Implement automatic token refresh (call `/refresh_access_token` before expiration).  
6. **Backend Logic:** On a comment webhook, verify keyword match, then `POST /{comment_id}/replies` with a public reply (e.g. “Check your DMs” plus instruction). Queue the DM response logic but wait for user’s DM. On a message webhook, check if it’s the user’s first message (consent). If so, immediately send the follow-request DM. When user replies “DONE”, check `is_user_follow_business` via GET {IGSCOPED_ID}?fields=is_user_follow_business【38†L168-L173】. If true, send the link; if false, prompt again. Use Redis or DB to track state per conversation.  
7. **Testing:** Add a test Instagram Business account. Test comment→reply, DM initiation, follow-check flow thoroughly. Test rate-limit handling by simulating bursts.  
8. **Error Handling:** Handle common errors (expired token = refresh/re-login, API rate-limit errors = backoff, consent-required errors on DMs = stop). Log all API errors for diagnosis.  
9. **Compliance:** In DMs, disclose bot identity if needed (“Hi, I’m an automated assistant…”) per local laws. Provide an opt-out keyword if possible. Only send the link once follow is confirmed. Don’t send unsolicited DMs.  
10. **App Review Prep:** Record a screencast of the full flow (login -> comment -> reply -> DM -> follow -> link). Show all permission dialogs and how the user initiates contact. Prepare a written explanation of use-case and compliance with policies.

**Sources:** Official Instagram Platform docs (overview, login flow, user profile API)【38†L168-L173】【52†L35-L38】, and rate-limit references【32†L761-L764】【32†L782-L783】. These ensure you use the correct endpoints, scopes, and abide by Instagram’s messaging rules.