import React, { useState, useEffect } from "react";
import {
  getCurrentUserProfile,
  logout,
  getCurrentPlaylist,
  getTopArtists,
} from "../spotify";
import { StyledHeader, StyledLogoutButton } from "../styles";
import { SectionWrapper, ArtistsGrid } from "../components";

function Profile() {
  const [state, setState] = useState({
    profile: null,
    playlists: null,
    artists: null,
  });
  const { profile, playlists, artists } = state;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, playlistsRes, artistsRes] = await Promise.all([
        getCurrentUserProfile(),
        getCurrentPlaylist(),
        getTopArtists(),
      ]);

      setState({
        profile: profileRes.data,
        playlists: playlistsRes.data,
        artists: artistsRes.data,
      });
    } catch (e) {
      console.log(e);
    }
  };

  if (profile) {
    const { display_name, followers, images } = profile;
    return (
      <>
        <StyledHeader type="user">
          <StyledLogoutButton onClick={logout}>Log Out</StyledLogoutButton>
          <div className="header__inner">
            {images.length > 0 && images[0].url && (
              <img className="header__img" src={images[0].url} alt="Avatar" />
            )}
            <div>
              <div className="header__overline">Profile</div>
              <h1 className="header__name">{display_name}</h1>
              <p className="header__meta">
                {playlists && (
                  <span>
                    {playlists.total} Playlist{playlists.total !== 1 ? "s" : ""}
                  </span>
                )}
                <span>
                  {followers.total} Follower
                  {followers.total !== 1 ? "s" : ""}
                </span>
              </p>
            </div>
          </div>
        </StyledHeader>
        {artists && (
          <main>
            <SectionWrapper
              title="Top artists this month"
              seeAllLink="/top-artists"
            >
              <ArtistsGrid artists={artists.items.slice(0, 10)} />
            </SectionWrapper>
          </main>
        )}
      </>
    );
  }
  return <StyledLogoutButton onClick={logout}>Log Out</StyledLogoutButton>;
}

export default Profile;
