# API Endpoints & Permissions

To implement a compliant “comment→DM (link) with follow-gate” workflow, you’ll primarily use the **Instagram Graph API** (via either Instagram Login or Facebook Login for Business). Key endpoints include:

- **Comments & Replies (IG Graph):** Use `GET /{ig-media-id}/comments` to fetch comments (or rely on Webhooks). To reply to a comment, use `POST /{ig-comment-id}/replies` with your reply text.  
- **Messaging (IG Graph / Messenger Platform):** Use `POST /{IG_ACCOUNT_ID}/messages` to send DMs (text, images, templates, etc.) to a user. You cannot initiate a DM unless the user has first messaged your account. (Official docs warn: *“If an Instagram user comments on a post or comment but has not sent a message to your app user…your app will receive an error: User consent is required.”*【38†L31-L34】.)  
- **User Profile (IG Graph):** After a user sends a message, call `GET /{IGSID}?fields=is_user_follow_business` to check if that Instagram user follows your business account【38†L168-L173】. The field `is_user_follow_business` is `true` only if the user follows your IG account【38†L168-L173】.  

**Required permissions:** For Instagram Login, request `instagram_basic`, `instagram_manage_comments`, and `instagram_manage_messages` (and optionally `instagram_content_publish` if posting content). For Facebook Login (IG via a Page), you’ll need `pages_show_list`, `pages_manage_metadata`, `pages_read_engagement`, plus `instagram_basic`, `instagram_manage_comments`, and `instagram_manage_messages`【18†L53-L60】【38†L72-L75】. All these permissions require Advanced Access (app review and business verification) if your app serves accounts beyond your own.

# Webhook Flow & Verification

**1. Set up Webhook endpoints:** In your app dashboard, enable Webhooks for Instagram. Subscribe to at least the `comments` field (for comment triggers) and the `messages` field (for incoming DMs) on the IG object【38†L79-L82】. Provide a HTTPS endpoint that can handle two request types:

- **Verification request (GET):** Meta sends a challenge (`hub.mode=subscribe`, `hub.challenge`, `hub.verify_token`). Your server must verify the `verify_token` matches your config and return the `hub.challenge` value.
- **Event notifications (POST):** When a user comments, IG sends a JSON payload to your endpoint. Your server must validate the `X-Hub-Signature-256` header (HMAC SHA256 with your App Secret) to ensure authenticity. See Meta’s docs for signature verification. Respond with HTTP 200 quickly to acknowledge.

**2. Process comment events:** Your server receives payloads like:
```json
{
  "object": "instagram",
  "entry": [{
    "changes": [{
      "field": "comments",
      "value": {
        "comment_id": "<COMMENT_ID>",
        "media_id": "<MEDIA_ID>",
        "text": "info",
        "from": { "id": "<IG_SCOPED_USER_ID>" }
      }
    }]
  }]
}
```
Parse each comment. If the text matches the trigger (e.g. “info”), proceed. (You’ll likely allow keywords or exact match.)

**3. Reply publicly to the comment:** Use `POST /{comment_id}/replies` with a message like “🔗 Check your DM!” (This public reply serves both compliance and UX—letting the user know something is happening privately.) This counts against comment rate limits but is safe and expected behavior.

# Messaging Flow & Rate Limits

Once you’ve prompted “Check your DM”, the user should ideally take an action to allow messaging. **Note:** You *cannot* send a DM unless the user has **either** messaged your account first or clicked an approved “icebreaker” link/button. If the user never initiates a conversation, your DM attempt will be rejected【38†L31-L35】. In practice, many workflows rely on the comment reply itself to encourage the user to send a quick DM (e.g. typing “Hi” to you) or click an “dm me” link. For compliance, be prepared to handle the case where sending the DM fails (log it and skip).

Assuming the user consents (i.e. you have their IG-scoped ID and can DM them):

1. **Initial DM (Send Link Prompt):**  
   – Call `POST /{IG_ACCOUNT_ID}/messages` with `recipient: {id: <IGSCOPED_ID>}` and a message template. First, **do not send the final link**. Instead send an engaging message asking them to follow the account. For example:  
   > “Hey 👋 Thanks for your interest! To grab the link, please follow us on Instagram and then reply ‘Done’.”  
   This uses plain text or a quick-reply button. This DM informs them of the follow requirement.

2. **Check Follow Status:** When the user replies (e.g. with “Done”), catch that via a messaging webhook. Now use `GET /{IGSCOPED_ID}?fields=is_user_follow_business&access_token=...`. The response includes `is_user_follow_business` (true/false)【38†L168-L173】.  
   - If `true`, send the link: `POST /{IG_ACCOUNT_ID}/messages` with the actual link or URL as text or in a button message.  
   - If `false`, politely message again: “It looks like you haven’t followed yet. Please follow [@YourAccount] and reply ‘Done’ when you have.” (You may repeat this a couple of times, but be careful not to spam.)

3. **Handle Follow Delay or No Action:** If the user still doesn’t follow within a reasonable time (days), you might stop retries. All DMs are subject to the 24-hour messaging window (24h from their last message)【38†L31-L35】; after that, you cannot send promotional replies unless using a “Human Agent” tag (with limited approved use).

**Rate Limits:** The Instagram Messaging API has strict rate limits. Per IG Business account:  
- **Messages:** 100 calls/sec for text/link messages (2/sec for audio/video)【32†L761-L764】.  
- **Comment Replies (private replies):** 750 calls/hour for replies to comments on posts/reels【32†L782-L783】.  
These are per Instagram Business account (rolled up by app+account). Design your queue so you don’t exceed these. For example, if many comments arrive, process them in batch or with a delay. Always catch HTTP 4xx/5xx errors for rate limits or consent errors and retry/delay as needed.

# Token Management & API Setup

- **Authentication Flow:** Use **Facebook Login for Business** or **Instagram Login** to get an access token that can manage the IG Business account.  
  - Instagram Login yields an Instagram User access token (graph.instagram.com). Facebook Login yields a Facebook User token (graph.facebook.com) plus Page tokens. (Either can call the IG Graph endpoints; with Facebook Login you use `graph.facebook.com/{page-id}/...` for IG edges.)  
- **Long-lived Tokens:** Exchange the short-lived OAuth token for a 60-day long-lived token. Store it securely. Regularly refresh before expiry (you can exchange a valid long-lived token for a new long-lived one).  
- **Webhook Subscription:** After deploying your endpoint, call `POST /{IG_USER_ID}/subscribed_apps?subscribed_fields=comments,messages&access_token=...` to activate webhooks【18†L53-L60】. (If using Facebook Login, subscribe on the Page ID).  
- **Permissions & App Review:** You will need Advanced Access for all relevant permissions since your app will serve others. Specifically, you’ll request and justify: `instagram_manage_comments`, `instagram_manage_messages`, `instagram_basic` (or their “instagram_business_…” equivalents)【18†L53-L60】. Plan to demonstrate exactly how the user triggers each action (e.g. “User comments triggers a reply”, “User DM triggers follow-check reply”, etc.). You must also complete Business Verification.  
- **Errors & Edge Cases:**  
  - If the comment reply or DM send fails (check API error codes), log details. For example, error code 10 or 190 indicates token issues, 613 indicates rate limiting.  
  - If sending a DM to a user with no prior message, catch that error (user consent error【38†L31-L35】) and skip further messages for that user.  
  - If the user does not respond after your DM prompt (“please follow”), eventually give up after a few tries.  
  - Watch for webhook signature or webhook downtime issues by implementing retries and dead-letter logging.

# Implementation Checklist

1. **Meta App Setup:** Create a Meta Developer app. Add **Instagram Graph API** and (if using Facebook login) **Facebook Login** products. Configure OAuth (redirect URIs, valid OAuth redirect). For IG Login, add “Instagram Login” flow. For FB Login, enable “Facebook Login for Business” and attach necessary IG and Page products.  

2. **Permissions & Review:**  
   - In App Dashboard > App Review, request `instagram_manage_comments`, `instagram_manage_messages`, `instagram_basic` (and possibly `pages_show_list`, etc. for FB login). For each, prepare screencast/demo: show user logging in, granting access, a test comment triggering a reply and DM, and user following check flow.  
   - Complete Business Verification (submit business documents).

3. **Webhook Server:**  
   - Deploy an HTTPS server with a verified SSL cert.  
   - Implement the verification endpoint (respond to Meta’s GET with the challenge token) and verify token check.  
   - Implement POST handling: validate `X-Hub-Signature-256`. Parse JSON; ensure you handle both “comments” and “messages” events.  
   - Test webhooks using the “Send Test” function in the Dashboard. Use the sample payloads Meta provides.

4. **Database:** Store: app credentials, user long-lived tokens, IG Account IDs, user-defined keywords/actions, pending follow-check states, etc.  

5. **Flow Logic:**  
   - On comment event: extract `comment_id`, `media_id`, comment text, commenter IG ID. Check keyword. Reply to comment with fixed text (e.g. “✅ Check your DM!”) via `POST /{comment_id}/replies`.  
   - Wait for reply success, then queue a DM (or if immediate DM, ensure user consent). If sending DM immediately, wrap in try/catch for consent errors.  
   - DM sequence: Use structured message or templates (as allowed) to ask for follow and receive a reply.  
   - On message event: parse user message. If expecting “Done” (or any keyword), call GET profile with `fields=is_user_follow_business`.  
   - Depending on follow status: send link or ask again. If sending link, include any tracking parameters.  

6. **Token Refresh:** Before any token expires (60 days), refresh it. You can do this programmatically by calling the OAuth endpoint with the current long-lived token. Automate checks (e.g. every 30 days refresh). 

7. **Testing:**  
   - Use a test IG Business account (added as test user). Test comment triggers, reply posting, DM flow, follow-check logic.  
   - Test rate limits by simulating many comments in short time. Ensure retries back off.  
   - Test edge cases: user does not follow, user does not respond, token expiration.

8. **Compliance & Policies:**  
   - Ensure each DM is clearly connected to a user action (the comment). Include opt-outs if needed (“Reply STOP to unsubscribe”).  
   - Include automated chat disclosures if laws require (e.g. initial message “This is an automated chat” if targeting certain regions).  
   - Do not send messages outside the 24h window without using a valid human_agent tag and justification.  

By following this plan – using webhooks to detect comments, replying publicly and then privately messaging the user, and verifying follow status via the User Profile API – you can implement the “SuperProfile” comment-to-DM sequence. This approach uses only official Instagram Graph API endpoints and respects Meta’s policies.  

**Sources:** Instagram Platform documentation (Webhooks, Comment/Reply, Messaging API)【38†L31-L34】【38†L168-L173】; Instagram rate limits【32†L761-L764】【32†L782-L783】.