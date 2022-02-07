require("dotenv").config();
const express = require("express");
const querystring = require("node:querystring");
const randomstring = require("randomstring");
const app = express();
const axios = require("axios");
const { response } = require("express");
const port = 8883;

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;

const stateKey = "spotify_auth_state";

app.get("/login", (req, res) => {
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
});

app.get("/callback", (req, res) => {
  const code = req.query.code || null;

  axios({
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
  })
    .then((response) => {
      if (response.status === 200) {
        const { access_token, token_type, refresh_token } = response.data;
        const queryParams = querystring.stringify({
          access_token,
          refresh_token,
        });
        res.redirect(`http://localhost:3000/?${queryParams}`);
      } else {
        res.redirect(`/?${querystring.stringify({ error: "invalid_token" })}`);
      }
    })
    .catch((err) => res.send(err));
});

app.get("/refresh_token", async (req, res) => {
  const { refresh_token } = req.query;

  axios({
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
  })
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => res.send(err));
});

app.listen(port, () => {
  console.log(`Express app listening port  ${port}`);
});
