import { google } from "googleapis";
import fs from "fs/promises";
import http from "http";
import path from "path";
import open from "open";
import { log } from "console";



// const TOKEN_PATH = path.join(__dirname, "token.json");
// const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];
const TOKEN_PATH = process.env.TOKEN_PATH;
console.log("rrr", TOKEN_PATH);
/**
 * @returns : OAuth2 client
 * @description : This function is used to create an OAuth2 client.
 * It will create an OAuth2 client and return it.
*/
const createOAuthClient = () =>
    new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      'http://localhost:5000/auth/google/callback'
    );

// Token management functions
/**
 * @param {Object} token
 * @description : This function is used to save the tokens to the disk.
 * It will save the tokens to the disk and return them.
*/
const saveToken = (token) => fs.writeFile(TOKEN_PATH, JSON.stringify(token));

/**
 * @returns : Promise<OAuth2 client>
 * @description : This function is used to load the tokens from the disk.
 * It will read the tokens from the disk and return them.
*/
const loadToken = async () => {
  try {
    const token = await fs.readFile(TOKEN_PATH);
    return JSON.parse(token);
  } catch (err) {
    return null;
  }
};

/**
 * @returns : Promise<OAuth2 client>
 * @description : This function is used to authorize the user with Google.
 * It will create an OAuth2 client and return it.
 * If the user is not authenticated, it will open the browser to the consent URL and wait for the user to authenticate.
 * Once the user has authenticated, it will save the tokens to the disk and return the OAuth2 client.
*/
export const authorize = async (expressApp) => {  // Pass the Express app as an argument

    const SCOPES = [process.env.SCOPES];
    console.log("scopes#", SCOPES);

    const oauth2Client = createOAuthClient();
    const token = await loadToken();
    console.log('[T]', token);
    if (token) {
      // console.log("(token)", token);
      // oauth2Client.setCredentials(token);
      await refreshIfNeeded(oauth2Client, token);
      return oauth2Client;
    }

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
      // prompt: "consent"
    });
    console.log("authurl*", authUrl);
    /**
     * @returns : Promise<OAuth2 client>
     * @description : Waits for user authentication by attaching a temporary route to the existing Express app.
     */
    const waitForAuth = async () => {
        const open = (await import("open")).default;

        return new Promise((resolve) => {
            // 1. Add a temporary route to handle the OAuth callback
            const callbackRoute = "/auth/google/callback"; // Customize this as needed
            expressApp.get(callbackRoute, async (req, res) => {
                const code = req.query.code;

                // 2. Exchange code for tokens
                const { tokens } = await oauth2Client.getToken(code);
                oauth2Client.setCredentials(tokens);

                // 3. Save tokens for future use
                await saveToken(tokens);

                // 4. Respond and resolve the Promise
                res.send("Authentication successful! You can close this window.");
                resolve(oauth2Client);

                // 5. (Optional) Remove the temporary route if needed
                expressApp._router.stack = expressApp._router.stack.filter(
                    (layer) => layer.route?.path !== callbackRoute
                );
            });

            // 6. Open the auth URL in the browser
            open(authUrl);
        });
    };

    return await waitForAuth();
};

/**
 * @returns : Promise<OAuth2 client>
 * @description : This function is used to refresh access token.
 * It will read the token oauth2Client and check for expired token; if so it will refreshe it.
*/
async function refreshIfNeeded(oauth2Client, token) {
  // const token = oauth2Client.credentials;
  console.log("[cred]", token);
  
  if (!token.expiry_date || token.expiry_date <= Date.now()) {
    // Use the stored refresh_token
    const  credentials  = await oauth2Client.refreshToken(
      token.refresh_token
    );
    let newToken = { ...credentials.tokens, refresh_token: token.refresh_token}
    console.log("[credentials]", newToken);
    
    oauth2Client.setCredentials(credentials);
    await saveToken(newToken);
  }
  return oauth2Client;
}

