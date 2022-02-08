import React, { useState, useEffect } from "react";
import { getCurrentUserProfile, logout } from "../spotify";

function Profile() {
  const [profile, setProfile] = useState(null);
  useEffect(() => {
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

  if (profile) {
    const { display_name, followers, images } = profile;
    return (
      <div>
        <button onClick={logout}>Log out</button>
        <h1>{display_name}</h1>
        {<p>{followers?.total} Followers</p>}
        {images.length > 0 && images[0].url && (
          <img src={images[0].url} alt="Avatar" />
        )}
      </div>
    );
  }
  return <h1>hello </h1>;
}

export default Profile;
