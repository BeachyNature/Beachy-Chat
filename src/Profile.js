// Profile.js
import React, { useState, useEffect } from 'react';
import EditProfileForm from './EditProfileForm';

const Profile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    if (user && user.profileImage) {
      const uint8Array = new Uint8Array(user.profileImage.data);
      const blob = new Blob([uint8Array], { type: 'image/jpeg' });
      const imageUrl = URL.createObjectURL(blob);
      setImageSrc(imageUrl);
    }
  }, [user]);

  return (
    <div>
      <h1>Profile Page</h1>
      {user ? (
        <div>
          <p>Welcome, {user.username}!</p>
          <p>Email: {user.email}</p>

          {/* Display user's profile picture or default image */}
          {imageSrc ? (
            <img
              src={imageSrc}
              alt="Profile"
              style={{ maxWidth: '200px' }}
            />
          ) : (
            <p>No profile image available</p>
          )}

          {isEditing ? (
            <EditProfileForm
              user={user}
              setIsEditing={setIsEditing}
              onProfileUpdate={() => {}}
            />
          ) : (
            <div>
              <button onClick={() => setIsEditing(true)}>Edit Profile</button>
            </div>
          )}
        </div>
      ) : (
        <p>TESTING</p>
      )}
    </div>
  );
};

export default Profile;
