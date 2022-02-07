import axios from "axios";
import querystring from "node:querystring";
import "dotenv/config";
import randomstring from "randomstring";

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;
const stateKey = "spotify_auth_state";

export const refreshToken = async (req, res) => {
  const { refresh_token } = req.query;

  try {
    const response = await axios({
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      data: querystring.stringify({
        grant_type: "refresh_token",
        refresh_token,
      }),
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${new Buffer.from(
          `${CLIENT_ID}:${CLIENT_SECRET}`
        ).toString("base64")}`,
      },
    });

    res.send(response.data);
  } catch (err) {
    res.send(err);
  }
};

export const callback = async (req, res) => {
  const code = req.query.code || null;

  try {
    const response = await axios({
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      data: querystring.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
      }),
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${new Buffer.from(
          `${CLIENT_ID}:${CLIENT_SECRET}`
        ).toString("base64")}`,
      },
    });

    if (response.status === 200) {
      const { access_token, refresh_token } = response.data;

      const queryParams = querystring.stringify({
        access_token,
        refresh_token,
      });

      res.redirect(`http://localhost:3000/?${queryParams}`);
    } else {
      res.redirect(`/?${querystring.stringify({ error: "invalid_token" })}`);
    }
  } catch (err) {
    res.send(err);
  }
};

export const login = (req, res) => {
  const state = randomstring.generate(16);
  res.cookie(stateKey, state);
  const scope = "user-read-private user-read-email";

  const queryParams = querystring.stringify({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    state,
    scope,
  });

  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
};
