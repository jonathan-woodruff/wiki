//import './authenticate'; //this line ensures the user is logged in

// Import our custom CSS
import './scss/styles.scss';

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap';

import { getProfileData, putProfile } from './api/main';

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
const descriptionInput = document.getElementById('description');
const saveButton = document.getElementById('save');
const serviceErrorMessage = document.getElementById('error-message');

let photoURL;

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
    photoURL = event.target.result;

    // Display the uploaded image
    picturePreview.src = photoURL;
  };

  // Read the selected file as Data URL
  reader.readAsDataURL(file);
};

const addCountryField = (rowElement) => {
  const countryDiv = document.createElement('div');
  countryDiv.classList.add('col');
  countryDiv.classList.add('col-12');
  countryDiv.classList.add('col-sm-3');
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
  yearLabel.innerHTML = 'Training start year';
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

const addServiceRow = () => {
  const row = document.createElement('div');
  row.classList.add('row');
  row.classList.add('mx-auto');
  row.classList.add('bg-light');
  row.classList.add('mb-2');
  row.classList.add('p-2');
  serviceSection.appendChild(row);
  return row;
};

const clearServiceError = (service) => {
  service.classList.remove('border');
  service.classList.remove('border-danger');
  serviceErrorMessage.classList.add('d-none');
  serviceErrorMessage.innerHTML = '';
};

const addService = (countryValue='Select', sectorValue='Select', yearValue='Select') => {
  const row = addServiceRow();

  const countrySelect = addCountryField(row);
  countrySelect.addEventListener('input', () => clearServiceError(countrySelect.parentNode.parentNode));
  loadCountries(countrySelect);
  countrySelect.value = countryValue;

  const sectorSelect = addSectorField(row);
  sectorSelect.addEventListener('input', () => clearServiceError(sectorSelect.parentNode.parentNode));
  loadSectors(sectorSelect);
  sectorSelect.value = sectorValue;

  const yearSelect = addYearField(row);
  yearSelect.addEventListener('input', () => clearServiceError(yearSelect.parentNode.parentNode));
  loadYears(yearSelect);
  yearSelect.value = yearValue;
};

const onAddService = (event) => {
  event.preventDefault();
  addService();
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

const loadPhoto = (photo) => {
  picturePreview.src = photo;
};

const loadServices = (storedServices) => {
  if (!storedServices.length) {
    addServiceButton.click();
  } else {
    storedServices.forEach(service => {
      addService(service.country, service.sector, service.year);
    })
  };
};

const loadDescription = (description) => {
  descriptionInput.innerHTML = description;
};

const loadFields = async () => {
  try {
    const { data } = await getProfileData();
    loadPhoto(data.photo);
    loadServices(data.services);
    loadDescription(data.description);
  } catch(error) {
    const errorMessage = error.response.data.errors[0].msg; //error from axios
    console.log(errorMessage);
  }
};

const processServicesForBackend = () => {
  const services = [];
  let errorService = null;
  let index = 0;
  serviceSection.childNodes.forEach(service => {
    if (service.nodeType === 1) { //the node is a real html element (which is a service)
      const countryValue = service.children[0].children[1].value;
      const sectorValue = service.children[1].children[1].value;
      const yearValue = service.children[2].children[1].value;
      const isAllSelect = (countryValue === 'Select' && sectorValue === 'Select' && yearValue === 'Select');
      if (!isAllSelect) {
        const isAnySelect = (countryValue === 'Select' || sectorValue === 'Select' || yearValue === 'Select');
        if (!isAnySelect) {
          services.push({});
          services[index]['country'] = countryValue;
          services[index]['sector'] = sectorValue;
          services[index]['year'] = yearValue;
          index++;
        } else {
          errorService = service;
        }
      }
    }
  })
  return [services, errorService];
};

const saveProfile = async (event) => {
  event.preventDefault();
  const [services, errorService] = processServicesForBackend();
  if (errorService) {
    errorService.classList.add('border');
    errorService.classList.add('border-danger');
    serviceErrorMessage.innerHTML = 'Please complete your services';
    serviceErrorMessage.classList.remove('d-none');
  } else {
    const dataToSave = {
      photo: photoURL,
      services: services,
      description: descriptionInput.value
    };
    try {
      await putProfile(dataToSave);
      console.log('booyah');
    } catch(error) {
      const errorMessage = error.response.data.errors[0].msg; //error from axios
      console.log(errorMessage);
    }
  }
};

pictureInput.addEventListener('input', showPreview);
addServiceButton.addEventListener('click', onAddService);
removeServiceButton.addEventListener('click', removeService);
saveButton.addEventListener('click', saveProfile);
loadFields();