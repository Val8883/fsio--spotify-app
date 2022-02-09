//map for localstorage keys

import axios from "axios";

const LOCALSTORAGE_KEYS = {
  accessToken: "spotify_access_token",
  refreshToken: "spotify_refresh_token",
  expireTime: "spotify_token_expire_time",
  timestamp: "spotify_token_timestamp",
};

const LOCALSTORAGE_VALUES = {
  accessToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.accessToken),
  refreshToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken),
  expireTime: window.localStorage.getItem(LOCALSTORAGE_KEYS.expireTime),
  timestamp: window.localStorage.getItem(LOCALSTORAGE_KEYS.timestamp),
};

export const logout = () => {
  for (const prop in LOCALSTORAGE_KEYS) {
    window.localStorage.removeItem(LOCALSTORAGE_KEYS[prop]);
  }
  window.location = window.location.origin;
};

const refreshToken = async () => {
  try {
    if (
      !LOCALSTORAGE_VALUES.refreshToken ||
      LOCALSTORAGE_VALUES.refreshToken === "undefined" ||
      (Date.now() - Number(LOCALSTORAGE_VALUES.timestamp)) / 1000 < 1000
    ) {
      console.log("No refresh token available");
      logout();
    }

    const { data } = await axios.get(
      `/refresh_token?refresh_token=${LOCALSTORAGE_VALUES.refreshToken}`
    );
    window.localStorage.setItem(
      LOCALSTORAGE_KEYS.accessToken,
      data.accessToken
    );
    window.localStorage.setItem(LOCALSTORAGE_KEYS.timestamp, Date.now());
    window.location.reload();
  } catch (err) {
    console.log(err);
  }
};

const getAccessToken = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const queryParams = {
    [LOCALSTORAGE_KEYS.accessToken]: urlParams.get("access_token"),
    [LOCALSTORAGE_KEYS.refreshToken]: urlParams.get("refresh_token"),
    [LOCALSTORAGE_KEYS.expireTime]: urlParams.get("expires_in"),
  };

  const hasError = urlParams.get("error");

  const hasTokenExpired = () => {
    const { accessToken, timestamp, expireTime } = LOCALSTORAGE_VALUES;
    if (!accessToken || !timestamp) {
      return false;
    }
    const millisecondsElapsed = Date.now() - timestamp;
    return millisecondsElapsed / 1000 > Number(expireTime);
  };

  //if there's an error or the token in localstorage has expired, refresh the token

  if (
    hasError ||
    hasTokenExpired() ||
    LOCALSTORAGE_VALUES.accessToken === "undefined"
  ) {
    refreshToken();
  }

  //if there is a  valid access token in ls
  if (
    LOCALSTORAGE_VALUES.accessToken &&
    LOCALSTORAGE_VALUES.accessToken !== "undefined"
  ) {
    return LOCALSTORAGE_VALUES.accessToken;
  }

  // if there is a token in the url query params, user is logging  for the first time
  if (queryParams[LOCALSTORAGE_KEYS.accessToken]) {
    //store the query params in localstorage
    for (const property in queryParams) {
      window.localStorage.setItem(property, queryParams[property]);
    }
    //set timestamp
    window.localStorage.setItem(
      LOCALSTORAGE_KEYS.timestamp,
      Date.now().toString()
    );
    return queryParams[LOCALSTORAGE_KEYS.accessToken];
  }
  return null;
};

export const accessToken = getAccessToken();

//axios defaults
axios.defaults.baseURL = "https://api.spotify.com/v1";
axios.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
axios.defaults.headers["Content-Type"] = "application/json";

export const getCurrentUserProfile = () => axios.get("/me");

export const getCurrentPlaylist = (limit = 20) =>
  axios.get(`/me/playlists?limit=${limit}`);

export const getTopArtists = (time_range = "short_term") =>
  axios.get(`/me/top/artists?time_range=${time_range}`);
