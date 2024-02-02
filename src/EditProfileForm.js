import React, { useState } from 'react';
import axios from 'axios';

function EditProfileForm() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Inside your EditProfileForm.js component
  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('profileImage', image);
      // formData.append('userId', user._id); // Assuming user._id is the user's ID

      await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };


  const handleLoadImage = async () => {
    try {
      const response = await axios.get('http://localhost:5000/loadImage', {
        responseType: 'arraybuffer',
      });

      const blob = new Blob([response.data], { type: 'image/jpeg' });
      const imageUrl = URL.createObjectURL(blob);
      setImageUrl(imageUrl);
    } catch (error) {
      console.error('Error loading image:', error);
    }
  };

  return (
    <div>
      <h1>Image Uploader</h1>
      <div>
        <label>Name:</label>
        {/* Input for name (you can uncomment and add state if needed) */}
        {/* <input type="text" value={name} onChange={(e) => setName(e.target.value)} /> */}
      </div>
      <div>
        <label>Profile Image:</label>
        <input type="file" onChange={handleImageChange} />
      </div>
      <button onClick={handleUpload}>Upload</button>
      <button onClick={handleLoadImage}>Load Image</button>
      {/* Display loaded image if available */}
      {imageUrl && (
        <div>
          <h2>Loaded Image:</h2>
          <img src={imageUrl} alt="Profile" />
        </div>
      )}
    </div>
  );
}

export default EditProfileForm;
