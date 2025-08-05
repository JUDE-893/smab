import { google } from "googleapis";
import fs from "fs/promises";
import http from "http";
import path from "path";
import open from "open";



// const TOKEN_PATH = path.join(__dirname, "token.json");
// const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];
const SCOPES = [process.env.SCOPES];
const TOKEN_PATH = process.env.TOKEN_PATH;
const POLL_INTERVAL = process.env.POLL_INTERVAL || 10000;

/**
 * @returns : OAuth2 client
 * @description : This function is used to create an OAuth2 client.
 * It will create an OAuth2 client and return it.
*/
const createOAuthClient = () =>
    new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      "http://localhost:3000/oauth2callback"
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
export const authorize = async () => {
    const oauth2Client = createOAuthClient();
    const token = await loadToken();
  
    if (token) {
      oauth2Client.setCredentials(token);
      return oauth2Client;
    }
  
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
    });
  
    /**
     * @returns : Promise<OAuth2 client>
     * @description : This function is used to wait for the user to authenticate with Google.
     * It will open the browser to the consent URL and wait for the user to authenticate.
     * Once the user has authenticated, it will save the tokens to the disk and return the OAuth2 client.
    */
    const waitForAuth = async () => {
        // 1. Dynamically load the 'open' helper so we can launch the browser
        const open = (await import("open")).default;
      
        // 2. Spin up a local HTTP server listening on port 3000
        const server = http.createServer(async (req, res) => {
          // 3. Only react to the OAuth2 callback path
          if (req.url.startsWith("/oauth2callback")) {
            // 4. Parse out the '?code=...' from the incoming URL
            const code = new URL(req.url, "http://localhost:3000")
              .searchParams.get("code");
      
            // 5. Exchange code for tokens with Google
            const { tokens } = await oauth2Client.getToken(code);
            oauth2Client.setCredentials(tokens);
      
            // 6. Persist tokens to disk for future runs
            await saveToken(tokens);
      
            // 7. Let the user know they can close the browser tab
            res.end("Authentication successful! You can close this window.");
      
            // 8. Shut down the temporary server
            server.close();
          }
        });
      
        // 9. Start listening, then open the consent URL in the default browser
        await new Promise((resolve) => server.listen(3000, resolve));
        await open(authUrl);
      };      
  
    await waitForAuth();
    return oauth2Client;
  };