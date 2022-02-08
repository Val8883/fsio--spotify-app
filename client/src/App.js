import { useEffect, useState } from "react";
import { accessToken, logout, getCurrentUserProfile } from "./spotify";
import "./App.css";

function App() {
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setToken(accessToken);
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const { data } = await getCurrentUserProfile();
      setProfile(data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {!token ? (
          <a className="App-link" href="http://localhost:8883/login">
            Login in Spotify
          </a>
        ) : (
          <div>
            <h1>Logged In!</h1>
            <button onClick={logout}>Logout</button>
            {profile && (
              <>
                <h3>{profile.display_name}</h3>
                <h3>{profile.email}</h3>
              </>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
