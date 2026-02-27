# Required API Calls (cURL Examples)

Below is a comprehensive set of cURL commands covering the key flows for SuperProfile. Each example includes the required endpoint, parameters, and a note on scopes/tokens. Replace placeholders (`<...>`) with your app values.

## 1. OAuth Login & Token Exchange

**Scopes:** `instagram_business_basic`, `instagram_business_manage_comments`, `instagram_business_manage_messages`, `instagram_business_content_publish`. These new scopes replace the old `business_...` scopes【52†L35-L38】.

1. **User Authorization (Browser):** Redirect the user to Instagram’s OAuth URL. (Not a cURL request; shown for completeness.)
   ```
   https://www.instagram.com/oauth/authorize
     ?client_id=<INSTAGRAM_APP_ID>
     &redirect_uri=<YOUR_REDIRECT_URI>
     &response_type=code
     &scope=instagram_business_basic,instagram_business_manage_comments,instagram_business_manage_messages,instagram_business_content_publish
   ```
2. **Exchange Code for Short-Lived Token:**  
   ```bash
   curl -X POST https://api.instagram.com/oauth/access_token \
     -F 'client_id=<INSTAGRAM_APP_ID>' \
     -F 'client_secret=<INSTAGRAM_APP_SECRET>' \
     -F 'grant_type=authorization_code' \
     -F 'redirect_uri=<YOUR_REDIRECT_URI>' \
     -F 'code=<AUTHORIZATION_CODE>'
   ```  
   *On success, this returns JSON with `access_token` (short-lived ~1hr) and `user_id` (Instagram-scoped ID). Note the `instagram_business_...` scopes granted.*
3. **Exchange for Long-Lived Token (60 days):**  
   ```bash
   curl -X GET "https://graph.instagram.com/access_token \
     ?grant_type=ig_exchange_token \
     &client_secret=<INSTAGRAM_APP_SECRET> \
     &access_token=<SHORT_LIVED_TOKEN>"
   ```  
   *Returns a long-lived token (expires in ~60 days)【18†L53-L60】. Store this securely.*
4. **Refresh Long-Lived Token (extend another 60 days):**  
   ```bash
   curl -X GET "https://graph.instagram.com/refresh_access_token \
     ?grant_type=ig_refresh_token \
     &access_token=<LONG_LIVED_TOKEN>"
   ```  
   *Use this before token expiry to keep it valid.*

## 2. Webhook Subscription

After login, subscribe the user’s account to webhooks for real-time events:

```bash
curl -X POST "https://graph.instagram.com/{IG_USER_ID}/subscribed_apps \
  ?subscribed_fields=comments,messages \
  &access_token=<LONG_LIVED_TOKEN>"
```
- `{IG_USER_ID}` is the Instagram Professional Account ID (returned via login or user profile calls).
- This tells Meta to send your webhook events for **comments** and **messages** on that account.

## 3. Comment Reply

When your webhook receives a new comment (from `comments` subscription), reply publicly:

```bash
curl -X POST "https://graph.instagram.com/{COMMENT_ID}/replies" \
  -H "Authorization: Bearer <LONG_LIVED_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
        "message": "Thanks for commenting! Please check your DMs 👀"
      }'
```
- `{COMMENT_ID}` is the ID of the comment from the webhook payload.
- This requires `instagram_business_manage_comments`. It posts a public reply.

## 4. Sending a DM

After the user sends you a DM (you cannot DM them first!), send a message via the Messenger API:

```bash
curl -X POST "https://graph.instagram.com/{IG_ACCOUNT_ID}/messages" \
  -H "Authorization: Bearer <LONG_LIVED_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
        "recipient": {"id": "<IGSCOPED_ID>"},
        "message": {"text": "Hi! Please follow @yourAccount and reply DONE to get the link."}
      }'
```
- `{IG_ACCOUNT_ID}` is your business’s IG user ID (from login profile).
- `<IGSCOPED_ID>` is the Instagram-scoped ID of the user (from webhook).  
- This requires `instagram_business_manage_messages`. It sends a text DM.

**Example (with media link):**

```bash
curl -X POST "https://graph.instagram.com/{IG_ACCOUNT_ID}/messages" \
  -H "Authorization: Bearer <LONG_LIVED_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
        "recipient": {"id": "<IGSCOPED_ID>"},
        "message": {
           "attachment": {
             "type": "link",
             "payload": {"url": "https://example.com/your-link"}
           }
        }
      }'
```
*Use this format to send URLs, images, or other attachments. For a simple text link, you can also just send the URL in the `"text"` field.*

## 5. Follow Verification (User Profile)

When the user replies “DONE”, check if they followed your account:

```bash
curl -X GET "https://graph.instagram.com/{IGSCOPED_ID}\
?fields=is_user_follow_business&access_token=<LONG_LIVED_TOKEN>"
```
- This returns JSON with `"is_user_follow_business": true/false`.  
- If `true`, send the link DM as above; if `false`, prompt to follow again.  
- As shown in Meta’s docs, `is_user_follow_business` indicates if the user follows your business【55†L120-L123】.

## 6. Check Token Expiration (Optional)

To monitor token validity (optional endpoint):

```bash
curl -X GET "https://graph.instagram.com/refresh_access_token\
?grant_type=ig_refresh_token&access_token=<LONG_LIVED_TOKEN>"
```
- You can use this to confirm the token is valid or to refresh it before expiry.

## Rate Limit and Token Notes

- **Rate Limiting:** Keep calls per IG account within limits (100 msgs/sec, 750 replies/hour)【32†L761-L764】【32†L782-L783】. Throttle if needed (e.g. pause DM sending when rate-limited).  
- **Token Refresh:** Always use your App Secret only in server-side calls. Do not expose the App Secret or long-lived token client-side. Refresh tokens regularly.

## App Review and Deployment Notes

- Record each flow for App Review: show logging in (OAuth) and granting permissions, a comment triggering the public reply, the user opening DM and your app sending the follow request, and the follow verification with final link DM.  
- Mention that you respect the 24-hour messaging window, only DM’ing after user contact.  
- Ensure your redirect URIs and token exchange calls match exactly what’s in your App Dashboard【18†L55-L60】.  
- In your deployment, store tokens securely and log all webhook events. Use environment variables for secrets.

**Sources:** Official Instagram Platform docs on messaging and user profile【55†L120-L123】, and OAuth flow instructions【18†L53-L60】【52†L35-L38】. These provide the endpoints, scopes, and example payloads used above.