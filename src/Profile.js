// Profile.js
import React, { useState } from 'react';
import EditProfileForm from './EditProfileForm';

const Profile = ({ user, onEditClick }) => {
  const [isEditing, setIsEditing] = useState(false);

  const defaultProfilePicture = '/default.jpg'; // Update with your default image path

  return (
    <div>
      <h1>Profile Page</h1>
      {user ? (
        <div>
          <p>Welcome, {user.username}!</p>
          <p>Email: {user.email}</p>
          {/* Display user's profile picture or default image */}
          <img src={user.profilePicture || defaultProfilePicture} alt="Profile" style={{ maxWidth: '200px' }} />
          {isEditing ? (
            <EditProfileForm user={user} setIsEditing={setIsEditing} onProfileUpdate={(newProfilePicture) => user.profilePicture = newProfilePicture} />
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
