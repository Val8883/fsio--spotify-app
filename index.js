import express from "express";
import { refreshToken, callback, login } from "./controllers.js";

const app = express();
const port = 8883;

app.get("/login", login);
app.get("/callback", callback);
app.get("/refresh_token", refreshToken);

app.listen(port, () => {
  console.log(`Express app listening port  ${port}`);
});
