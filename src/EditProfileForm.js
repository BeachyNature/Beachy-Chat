// EditProfileForm.js
import React, { useState } from 'react';
import axios from 'axios';

const EditProfileForm = ({ user, setIsEditing, onProfileUpdate }) => {
  const [newProfilePicture, setNewProfilePicture] = useState(null);

  const handleProfilePictureChange = (e) => {
    setNewProfilePicture(e.target.files[0]);
  };

  const handleSaveChanges = async () => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', newProfilePicture);

      const response = await axios.post('http://localhost:3001/upload-profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
     
      // Assuming the response contains the updated profile picture URL
      const updatedProfilePictureUrl = response.data.profilePictureUrl;

      // Update the user's profile picture URL
      user.profilePicture = updatedProfilePictureUrl;

      // Update the user's profile in the parent component
      onProfileUpdate(updatedProfilePictureUrl);
      setIsEditing(false);
      
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      <label>
        Profile Picture:
        <input type="file" accept="image/*" onChange={handleProfilePictureChange} />
      </label>
      <br />
      <button onClick={handleSaveChanges}>Save Changes</button>
      <button onClick={() => setIsEditing(false)}>Cancel</button>
    </div>
  );
};

export default EditProfileForm;
