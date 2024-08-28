// Import our custom CSS
import './scss/styles.scss';

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap';

import UploadIcon from './images/upload.png';
import PlusIcon from './images/plus.png';
import RemoveIcon from './images/remove.png';
import PeaceChicken from './images/peace_chicken.jpg';
import { sectors, countries } from './constants/profile';

const pictureInput = document.getElementById('profile-picture');
const picturePreview = document.getElementById('pic-preview');
const uploadIcon = document.getElementById('upload-icon');
const plusIcon = document.getElementById('plus-icon');
const removeIcon = document.getElementById('remove-icon');
const addServiceButton = document.getElementById('add-service');
const removeServiceButton = document.getElementById('remove-service');
const serviceSection = document.getElementById('service-section');

picturePreview.src = PeaceChicken;
uploadIcon.src = UploadIcon;
plusIcon.src = PlusIcon;
removeIcon.src = RemoveIcon;

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

const addCountryField = (rowElement) => {
  const countryDiv = document.createElement('div');
  countryDiv.classList.add('col');
  countryDiv.classList.add('col-12');
  countryDiv.classList.add('col-sm-4');
  countryDiv.classList.add('mx-auto');
  rowElement.appendChild(countryDiv);
  const countryLabel = document.createElement('label');
  countryLabel.for = 'country';
  countryLabel.innerHTML = 'Country';
  countryDiv.appendChild(countryLabel);
  const countrySelect = document.createElement('select');
  countrySelect.classList.add('form-select');
  countrySelect.classList.add('mb-3');
  countrySelect.id = 'country';
  countrySelect.ariaLabel = 'Country where you served';
  countryDiv.appendChild(countrySelect);
  return countrySelect;
};

const loadCountries = (countrySelectElement) => {
  let option = document.createElement('option');
  option.selected = true;
  option.innerHTML = 'Select';
  countrySelectElement.appendChild(option);
  countries.forEach((country) => {
    option = document.createElement('option');
    option.value = country;
    option.innerHTML = country;
    countrySelectElement.appendChild(option);
  })
};

const addSectorField = (rowElement) => {
  const sectorDiv = document.createElement('div');
  sectorDiv.classList.add('col');
  sectorDiv.classList.add('col-12');
  sectorDiv.classList.add('col-sm-4');
  sectorDiv.classList.add('mx-auto');
  rowElement.appendChild(sectorDiv);
  const sectorLabel = document.createElement('label');
  sectorLabel.for = 'sector';
  sectorLabel.innerHTML = 'Sector';
  sectorDiv.appendChild(sectorLabel);
  const sectorSelect = document.createElement('select');
  sectorSelect.classList.add('form-select');
  sectorSelect.classList.add('mb-3');
  sectorSelect.id = 'sector';
  sectorSelect.ariaLabel = 'Sector you served';
  sectorDiv.appendChild(sectorSelect);
  return sectorSelect;
};

const loadSectors = (sectorSelectElement) => {
  let option = document.createElement('option');
  option.selected = true;
  option.innerHTML = 'Select';
  sectorSelectElement.appendChild(option);
  sectors.forEach((sector) => {
    option = document.createElement('option');
    option.value = sector;
    option.innerHTML = sector;
    sectorSelectElement.appendChild(option);
  });
};

const addYearField = (rowElement) => {
  const yearDiv = document.createElement('div');
  yearDiv.classList.add('col');
  yearDiv.classList.add('col-12');
  yearDiv.classList.add('col-sm-4');
  yearDiv.classList.add('mx-auto');
  rowElement.appendChild(yearDiv);
  const yearLabel = document.createElement('label');
  yearLabel.for = 'year';
  yearLabel.innerHTML = 'Year training started';
  yearDiv.appendChild(yearLabel);
  const yearSelect = document.createElement('select');
  yearSelect.classList.add('form-select');
  yearSelect.classList.add('mb-3');
  yearSelect.id = 'year';
  yearSelect.ariaLabel = 'Year you landed in-country';
  yearDiv.appendChild(yearSelect);
  return yearSelect;
};

const loadYears = (yearSelectElement) => {
  let option = document.createElement('option');
  option.selected = true;
  option.innerHTML = 'Select';
  yearSelectElement.appendChild(option);
  let year = new Date().getFullYear(); //current year
  while (year >= 1961) {
    option = document.createElement('option');
    option.value = year;
    option.innerHTML = year;
    yearSelectElement.appendChild(option);
    year--;
  };
};

const addService = (event) => {
  event.preventDefault();
  const row = document.createElement('div');
  row.classList.add('row');
  row.classList.add('mx-auto');
  row.classList.add('bg-light');
  row.classList.add('mb-2');
  row.classList.add('p-2');
  serviceSection.appendChild(row);

  const countrySelect = addCountryField(row);
  loadCountries(countrySelect);

  const sectorSelect = addSectorField(row);
  loadSectors(sectorSelect);

  const yearSelect = addYearField(row);
  loadYears(yearSelect);
};

const getNumServices = (nodesList) => {
  let count = 0;
  nodesList.forEach(node => {
    if (node.nodeType === 1) count++; //only count children that are elements, not things like comments or new line characters
  });
  return count;
};

const removeService = (event) => {
  event.preventDefault();
  const numServices = getNumServices(serviceSection.childNodes);
  if (numServices >= 2) {
    const lastChild = serviceSection.lastChild;
    serviceSection.removeChild(lastChild);
  }
};

pictureInput.addEventListener('input', showPreview);
addServiceButton.addEventListener('click', addService);
removeServiceButton.addEventListener('click', removeService);
addServiceButton.click();