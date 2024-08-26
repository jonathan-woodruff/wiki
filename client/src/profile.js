// Import our custom CSS
import './scss/styles.scss';

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap';

import Alligator from './alligator.png';

const pictureInput = document.getElementById('profile-picture');
const picturePreview = document.getElementById('pic-preview');

picturePreview.src = Alligator;

const showPreview = () => {
  // Get the selected file
  const file = pictureInput.files[0];

  // Create a FileReader object
  const reader = new FileReader();

  // Set up the reader's onload event handler
  reader.onload = (event) => {
    // Get the image data URL
    const imageDataUrl = event.target.result;

    // Display the uploaded image
    picturePreview.src = imageDataUrl;
  };

  // Read the selected file as Data URL
  reader.readAsDataURL(file);
};

pictureInput.addEventListener('input', showPreview);