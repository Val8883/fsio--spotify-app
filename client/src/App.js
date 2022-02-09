import { useEffect, useState } from "react";
import { accessToken } from "./spotify";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login, Profile } from "./pages";

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(accessToken);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token ? <Profile /> : <Login />} />
        <Route path="/top-artists" />
        <Route path="/top-tracks" />
        <Route path="/playlists" />
        <Route path="/playlists/:id" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
