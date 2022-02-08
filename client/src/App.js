import { useEffect, useState } from "react";
import { accessToken, logout, getCurrentUserProfile } from "./spotify";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import styled from "styled-components/macro";
import { GlobalStyle } from "./style";
import { Login } from "./pages";

console.log(GlobalStyle);

const StyledLoginBtn = styled.a`
  background-color: palegreen;
  color: white;
  padding: 10px 20px;
  margin: 20px auto;
  border-radius: 30px;
  display: inline-block;
`;

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
    <BrowserRouter>
      {!token && <Login />}
      <Routes>
        <Route path="/" element={<h1>Hello</h1>} />
        <Route path="/top-artists" />
        <Route path="/top-tracks" />
        <Route path="/playlists" />
        <Route path="/playlists/:id" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
