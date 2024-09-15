/************************************************************
 * Ensure the user is authenticated 
************************************************************/
import { isAuth } from './authenticate';
if (!isAuth) window.location.href = './login.html';

/************************************************************
 * Import Bootstrap CSS and JavaScript
************************************************************/
import './scss/styles.scss'; //css
import * as bootstrap from 'bootstrap'; //js

/************************************************************
 * Configure the navbar
************************************************************/
import { configureNav, logout } from './utils/navbar';
import PeaceChicken from './images/peace_chicken.jpg';
import Logo from './images/logo.png';

const setSources = () => {
  const logoImg = document.getElementById('logo-img');
  const picturePreview = document.getElementById('pic-preview');
  picturePreview.src = PeaceChicken;
  logoImg.src = Logo;
};

const setNav = () => {
  const navCreateLI = document.getElementById('nav-create-li');
  const navCreateA = document.getElementById('nav-create-a');
  const navDropdown = document.getElementById('nav-dropdown');
  const navRegisterButton = document.getElementById('nav-register-button');
  configureNav(isAuth, navRegisterButton, navDropdown, navCreateLI, navCreateA);
};

setSources();
setNav();

/************************************************************
 * Configure buttons
************************************************************/
import UploadIcon from './images/upload.png';
import PlusIcon from './images/plus.png';

const configureButtons = () => {
  const upload = document.getElementById('upload-icon');
  const plus = document.getElementById('plus-icon');
  upload.src = UploadIcon;
  plus.src = PlusIcon;
};

configureButtons();

/************************************************************
 * Load data from backend 
************************************************************/
import { getProfileData, putProfile, postAvatar } from './api/main';
import { sectors, countries } from './constants/profile';
import RemoveIcon from './images/remove.png';

const serviceSection = document.getElementById('service-section');
const serviceErrorMessage = document.getElementById('error-message');
const descriptionInput = document.getElementById('description');
const userName = document.getElementById('name');
const addServiceButton = document.getElementById('add-service');

const addServiceRow = () => {
  const row = document.createElement('div');
  row.classList.add('row');
  row.classList.add('mx-auto');
  row.classList.add('bg-light');
  row.classList.add('mb-2');
  row.classList.add('p-3');
  serviceSection.appendChild(row);
  return row;
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

const clearServiceError = (event) => {
  const service = event.target.parentNode.parentNode;
  service.classList.remove('border');
  service.classList.remove('border-danger');
  serviceErrorMessage.classList.add('d-none');
  serviceErrorMessage.innerHTML = '';
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

const addTrashButton = (rowElement) => {
  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('col');
  buttonDiv.classList.add('col-3');
  buttonDiv.classList.add('col-sm-1');
  buttonDiv.classList.add('mx-auto');
  buttonDiv.classList.add('d-flex');
  buttonDiv.classList.add('align-items-center');
  rowElement.appendChild(buttonDiv);
  const button = document.createElement('button');
  button.classList.add('btn');
  button.classList.add('btn-danger');
  buttonDiv.appendChild(button);
  const trashImg = document.createElement('img');
  trashImg.src = RemoveIcon;
  trashImg.alt = 'Delete service';
  trashImg.style.width = '20px';
  trashImg.style.height = '20px';
  button.appendChild(trashImg);
  return button;
};

const removeService = (event) => {
  event.preventDefault();
  const button = event.currentTarget;
  button.removeEventListener('click', removeService);
  const serviceToRemove = button.parentNode.parentNode;
  const countrySelect = serviceToRemove.children[0].children[1];
  countrySelect.removeEventListener('input', clearServiceError);
  const sectorSelect = serviceToRemove.children[1].children[1];
  sectorSelect.removeEventListener('input', clearServiceError);
  const yearSelect = serviceToRemove.children[2].children[1];
  yearSelect.removeEventListener('input', clearServiceError);

  serviceSection.removeChild(serviceToRemove)
};

const addService = (countryValue='Select', sectorValue='Select', yearValue='Select') => {
  const row = addServiceRow();

  const countrySelect = addCountryField(row);
  countrySelect.addEventListener('input', clearServiceError);
  loadCountries(countrySelect);
  countrySelect.value = countryValue;

  const sectorSelect = addSectorField(row);
  sectorSelect.addEventListener('input', clearServiceError);
  loadSectors(sectorSelect);
  sectorSelect.value = sectorValue;

  const yearSelect = addYearField(row);
  yearSelect.addEventListener('input', clearServiceError);
  loadYears(yearSelect);
  yearSelect.value = yearValue;

  const button = addTrashButton(row);
  button.addEventListener('click', removeService);
};

const onAddService = (event) => {
  event.preventDefault();
  addService();
};

const loadPhoto = (photo) => {
  //picturePreview.src = photo;
  console.log(photo);
};

addServiceButton.addEventListener('click', onAddService);

const loadServices = (storedServices) => {
  if (!storedServices.length) {
    addServiceButton.click();
  } else {
    storedServices.forEach(service => {
      addService(service.country, service.sector, service.year);
    })
  };
};

const loadDescription = (description) => descriptionInput.innerHTML || '';

const loadName = (nameOfUser) => userName.value = nameOfUser || '';

const loadFields = async () => {
  try {
    const { data } = await getProfileData();
    loadName(data.name);
    loadPhoto(data.photo);
    loadServices(data.services);
    loadDescription(data.description);
  } catch(error) {
    const errorMessage = error.response.data.errors[0].msg; //error from axios
    console.log(errorMessage);
  }
};

loadFields();

/************************************************************
 * Show the page to the user
************************************************************/
import { setNotLoading, setLoading } from './utils/spinner';

const spinnerDiv = document.getElementById('spinner');
const mainContainer = document.getElementById('main-container');
const navbar = document.getElementById('navbar');
setNotLoading(spinnerDiv, mainContainer, navbar);

/************************************************************
 * All other JavaScript
************************************************************/
const pictureInput = document.getElementById('profile-picture');
const saveButton = document.getElementById('save');
const logoutLink = document.getElementById('logout-link');

const showPreview = () => {
  // Get the selected file
  const file = pictureInput.files[0];

  // Create a FileReader object
  const reader = new FileReader();

  // Set up the reader's onload event handler
  reader.onload = (event) => {
    // Get the image data URL
    const photoURL = event.target.result;

    // Display the uploaded image
    picturePreview.src = photoURL;
  };

  // Read the selected file as Data URL
  reader.readAsDataURL(file);
};

/*
const getNumServices = (nodesList) => {
  let count = 0;
  nodesList.forEach(node => {
    if (node.nodeType === 1) count++; //only count children that are elements, not things like comments or new line characters
  });
  return count;
};
*/

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

/* Reusable function for saving files to the backend
const putPhoto = (event) => {
  const url = new URL(form.action);
  const formData = new FormData(form);

  const fetchOptions = {
    method: form.method,
    body: formData
  };

  fetch(url, fetchOptions);

  event.preventDefault();
};
*/

const saveProfile = async (event) => {
  event.preventDefault();
  const [services, errorService] = processServicesForBackend();
  if (errorService) {
    errorService.classList.add('border');
    errorService.classList.add('border-danger');
    serviceErrorMessage.innerHTML = 'Please complete your services';
    serviceErrorMessage.classList.remove('d-none');
  } else {
    setLoading(spinnerDiv, mainContainer, navbar);
    const dataToSave = {
      name: userName.value,
      file: pictureInput.files[0],
      services: services,
      description: descriptionInput.value
    };
    try {
      await putProfile(dataToSave);
      const formData = new FormData();
      formData.append('avatar', pictureInput.files[0], 'avatar')
      await postAvatar(formData);
      const toast = new bootstrap.Toast(document.getElementById('toast'));
      toast.show();
    } catch(error) {
      const errorMessage = error.response.data.errors[0].msg; //error from axios
      console.log(errorMessage);
    }
    setNotLoading(spinnerDiv, mainContainer, navbar);
  }
};

pictureInput.addEventListener('input', showPreview);
saveButton.addEventListener('click', saveProfile);
logoutLink.addEventListener('click', logout);