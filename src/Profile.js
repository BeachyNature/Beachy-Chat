// Profile.js
import React, { useState, useEffect } from 'react';
import EditProfileForm from './EditProfileForm';

const Profile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    // Set the profile image from the user prop when it changes
    if (user && user.profileImage) {
      setProfileImage(URL.createObjectURL(new Blob([user.profileImage])));
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
          {profileImage ? (
            <img
              src={profileImage}
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
              onProfileUpdate={(newProfilePicture) => setProfileImage(newProfilePicture)}
            />
          ) : (
            <div>
              <button onClick={() => setIsEditing(true)}>Edit Profile</button>
            </div>
          )}
        </div>
      ) : (
        <p>Loading user information...</p>
      )}
    </div>
  );
};

export default Profile;
