# Instagram Login Integration & Fetching Posts

To start, we’ll use **Instagram OAuth (Business Login)** and the Instagram Graph API. The main steps are: set up OAuth, obtain an access token, then call the “user media” endpoint to retrieve posts.

## 1. OAuth Login (Instagram Business Login)

Follow these steps in your app (frontend & backend):

1. **Add Instagram Login Product:** In Meta App Dashboard, add “Instagram API (Login with Instagram)” to your app and enter your redirect URI under *OAuth Settings*.  
2. **Login Button / URL:** Send the user to Instagram’s authorization URL with your **Instagram App ID** and requested scopes:
   ```
   https://www.instagram.com/oauth/authorize
     ?client_id=<INSTAGRAM_APP_ID>
     &redirect_uri=<YOUR_REDIRECT_URI>
     &response_type=code
     &scope=instagram_business_basic,instagram_business_manage_comments,instagram_business_manage_messages,instagram_business_content_publish
   ```
   These scopes let you read the user’s media and profile【52†L35-L38】.  
3. **User Grants Permission:** Instagram will show a login/consent screen. On success, Instagram redirects to your redirect URI with `?code=AUTH_CODE`.  

4. **Exchange Code for Token (Backend):** On your server, immediately exchange the code for a short-lived token:
   ```bash
   curl -X POST https://api.instagram.com/oauth/access_token \
     -F 'client_id=<INSTAGRAM_APP_ID>' \
     -F 'client_secret=<INSTAGRAM_APP_SECRET>' \
     -F 'grant_type=authorization_code' \
     -F 'redirect_uri=<YOUR_REDIRECT_URI>' \
     -F 'code=<AUTH_CODE>'
   ```
   This returns JSON containing `access_token` (valid ~1 hour) and `user_id` (Instagram user ID).  
5. **Exchange for Long-Lived Token:** Use the short-lived token to get a long-lived 60-day token:
   ```bash
   curl -X GET "https://graph.instagram.com/access_token\
?grant_type=ig_exchange_token&client_secret=<INSTAGRAM_APP_SECRET>\
&access_token=<SHORT_LIVED_TOKEN>"
   ```
   Store the returned long-lived token securely (server-side). Refresh it every 60 days with the `/refresh_access_token` endpoint.  

*(Note: Use only the new `instagram_business_...` scopes; old ones are deprecated【52†L35-L38】.)*

## 2. Fetching an Account’s Posts

With a valid token, call the Instagram Graph API to get posts. Instagram accounts are accessed via their **user ID** (obtained during login) or via your Facebook Page.

- **Get Instagram Account ID (if using Facebook Login):** If your app used Facebook Login and the user’s Instagram is linked to a Page, first get the IG ID:
  ```bash
  curl -X GET "https://graph.facebook.com/v15.0/<PAGE_ID>\
?fields=instagram_business_account&access_token=<PAGE_ACCESS_TOKEN>"
  ```
  The response contains the `instagram_business_account.id`. Use this IG ID in the next calls.  
- **Get Media List:** Call the `/media` edge to retrieve posts. For example:
  ```bash
  curl -X GET "https://graph.instagram.com/<IG_USER_ID>/media\
?fields=id,caption,media_type,media_url,permalink,timestamp\
&access_token=<LONG_LIVED_TOKEN>"
  ```
  This returns a JSON list of media objects, each with `id,caption,media_type,media_url,permalink,timestamp`. The `fields` parameter lets you select exactly which details to fetch, similar to other Graph API calls【55†L120-L123】.  
- **Get Individual Media Details (if needed):** To fetch more details or different fields for a specific post:
  ```bash
  curl -X GET "https://graph.instagram.com/<MEDIA_ID>?fields=id,caption,media_type,media_url,permalink,timestamp&access_token=<LONG_LIVED_TOKEN>"
  ```
  Replace `<MEDIA_ID>` with the ID from the list. You can also add fields like `children` (for carousel) or `thumbnail_url` (for videos) as needed.

## 3. Example cURL Requests

Here are cURL examples summarizing the above (replace placeholders):

- **Exchange code for token:**
  ```bash
  curl -X POST https://api.instagram.com/oauth/access_token \
    -F 'client_id=1234567890' \
    -F 'client_secret=abcdef123456' \
    -F 'grant_type=authorization_code' \
    -F 'redirect_uri=https://yourapp.com/auth/ig/callback' \
    -F 'code=AQBt..."
  ```

- **Fetch media list:**
  ```bash
  curl -X GET "https://graph.instagram.com/17841400000000000/media\
?fields=id,caption,media_type,media_url,permalink,timestamp&access_token=EAAB..."
  ```

*(In practice, you might use a Graph API SDK or your server’s HTTP client instead of raw cURL.)*

## 4. Integration Checklist

- **Frontend:** Add an “Log in with Instagram” button that opens the OAuth URL. Handle redirect callback to capture the code and send it to your backend.  
- **Backend:**  
  - Implement the code exchange and token storage. Ensure secure storage of access tokens.  
  - Implement token refresh logic for long-lived tokens.  
  - Use the Graph API calls above to fetch `/media` after login. Handle pagination if the user has many posts (the `/media` endpoint returns a cursor for paging).  
  - Parse and return the media data (IDs, captions, URLs) to display in your app’s UI.  

- **Permissions:** Ensure your Meta App has been granted the permissions (instagram_business_basic, etc.) by the user during login. In development, add your tester IG account to the app so it can authorize.  

- **Testing:** Use the Graph API Explorer or tools like Postman to test calls. Verify that `/media` returns expected data.  

With this flow, you’ll have Instagram login integrated and can retrieve and display the user’s posts. Next steps (webhooks, auto-replies) build on this foundation.  

**Sources:** Official Instagram Graph API docs on user profiles and media fetching【55†L120-L123】, and OAuth flow descriptions【52†L35-L38】 provide the endpoint formats and parameter usage shown above.