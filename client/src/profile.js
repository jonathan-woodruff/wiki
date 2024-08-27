// Import our custom CSS
import './scss/styles.scss';

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap';

import UploadIcon from './images/upload.png';
import PeaceChicken from './images/peace_chicken.jpg';

const pictureInput = document.getElementById('profile-picture');
const picturePreview = document.getElementById('pic-preview');
const uploadIcon = document.getElementById('upload-icon');
const yearSelect = document.getElementById('year');

picturePreview.src = PeaceChicken;
uploadIcon.src = UploadIcon;

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

const loadYears = () => {
  let year = new Date().getFullYear();
  while (year >= 1961) {
    let nextOption = document.createElement('option');
    nextOption.value = year;
    nextOption.innerHTML = year;
    yearSelect.appendChild(nextOption);
    year--;
  };
};

pictureInput.addEventListener('input', showPreview);
loadYears();