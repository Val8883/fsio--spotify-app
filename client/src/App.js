import { useEffect, useState } from "react";
import { accessToken } from "./spotify";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(accessToken);
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        {!token ? (
          <a className="App-link" href="http://localhost:8883/login">
            Login in Spotify
          </a>
        ) : (
          <h1>Logged In!</h1>
        )}
      </header>
    </div>
  );
}

export default App;
