/************************************************************
 * Import Bootstrap CSS and JavaScript
************************************************************/
import '../scss/styles.scss'; //css
import * as bootstrap from 'bootstrap'; //js

import '../css/buttons.css';

/************************************************************
 * Functions and variables
************************************************************/
import { checkForCookie } from '../api/auth';
import { configureNav, refreshAvatar } from '../utils/navbar';
import Logo from '../images/logo.png';
import UploadIcon from '../images/upload.png';
import PlusIcon from '../images/plus.png';
import { getProfileData, putProfile } from '../api/main';
import { sectors, countries } from '../constants/profile';
import RemoveIcon from '../images/remove.png';
import { setNotLoading, setLoadingButton, setNotLoadingButton } from '../utils/spinner';

const isAuth = localStorage.getItem('isAuth') === 'true' ? true : false;
const navbarHolderSpan = document.getElementById('navbar-avatar-holder');
const serviceSection = document.getElementById('service-section');
const descriptionInput = document.getElementById('description');
const userName = document.getElementById('name');
const addServiceButton = document.getElementById('add-service');
const holderElement = document.getElementById('avatar-holder');

let isNameError = false;
let servicesAreEmpty = false;
let errorService = null;
let services = [];

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

const clearServiceBorder = (service) => {
  service.classList.remove('border');
  service.classList.remove('border-danger');
};

const showNameError = () => {
  userName.classList.add('border-danger');
  errorMessage.innerHTML = 'Please enter your name';
  errorMessage.classList.remove('d-none');
  isNameError = true;
};

const showEmptyServicesError = () => {
  errorMessage.innerHTML = 'Please complete your services';
  errorMessage.classList.remove('d-none');
  servicesAreEmpty = true;
};

const clearErrorMessage = () => {
  errorMessage.classList.add('d-none');
  errorMessage.innerHTML = '';
};

const clearServiceError = (service) => {
  clearServiceBorder(service);
  clearErrorMessage();
  errorService = null;
  if (!services.length) {
    showEmptyServicesError()
  } else if (!userName.value) {
    showNameError();
  }
};

const showServiceError = (service) => {
  service.classList.add('border');
  service.classList.add('border-danger');
  errorMessage.innerHTML = 'Please complete your services';
  errorMessage.classList.remove('d-none');
};

const clearEmptyServicesError = () => {
  if (servicesAreEmpty) {
    clearErrorMessage();
    servicesAreEmpty = false;
    if (errorService) {
      showServiceError(errorService);
    } else if (!userName.value) {
      showNameError();
    }
  }
};

const clearServiceErrorEvent = (event) => {
  const service = event.target.parentNode.parentNode;
  clearServiceError(service);
  clearEmptyServicesError();
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
  countrySelect.removeEventListener('input', clearServiceErrorEvent);
  const sectorSelect = serviceToRemove.children[1].children[1];
  sectorSelect.removeEventListener('input', clearServiceErrorEvent);
  const yearSelect = serviceToRemove.children[2].children[1];
  yearSelect.removeEventListener('input', clearServiceErrorEvent);

  if (serviceToRemove === errorService) clearServiceError(errorService);

  serviceSection.removeChild(serviceToRemove)
};

const addService = (countryValue='Select', sectorValue='Select', yearValue='Select') => {
  const row = addServiceRow();

  const countrySelect = addCountryField(row);
  countrySelect.addEventListener('input', clearServiceErrorEvent);
  loadCountries(countrySelect);
  countrySelect.value = countryValue;

  const sectorSelect = addSectorField(row);
  sectorSelect.addEventListener('input', clearServiceErrorEvent);
  loadSectors(sectorSelect);
  sectorSelect.value = sectorValue;

  const yearSelect = addYearField(row);
  yearSelect.addEventListener('input', clearServiceErrorEvent);
  loadYears(yearSelect);
  yearSelect.value = yearValue;

  const button = addTrashButton(row);
  button.addEventListener('click', removeService);
};

const onAddService = (event) => {
  event.preventDefault();
  clearEmptyServicesError();
  addService();
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

const loadDescription = (description) => descriptionInput.innerHTML = description || '';

const loadName = (nameOfUser) => {
  userName.value = nameOfUser || '';
};

const setSources = () => {
  const logoImg = document.getElementById('logo-img');
  logoImg.src = Logo;
  refreshAvatar(localStorage.getItem('avatar'), navbarHolderSpan, 'navbar-avatar', '40px');
};

const setNav = () => {
  const navCreateLI = document.getElementById('nav-create-li');
  const navCreateA = document.getElementById('nav-create-a');
  const navCommunityLI = document.getElementById('nav-community-li');
  const navCommunityA = document.getElementById('nav-community-a');
  const navDropdown = document.getElementById('nav-dropdown');
  const navRegisterButton = document.getElementById('nav-register-button');
  configureNav(isAuth, navRegisterButton, navDropdown, navCreateLI, navCreateA, navCommunityLI, navCommunityA);
};

const configureButtons = () => {
  const upload = document.getElementById('upload-icon');
  const plus = document.getElementById('plus-icon');
  upload.src = UploadIcon;
  plus.src = PlusIcon;
};

/************************************************************
 * Ensure the user is authenticated and load/show data
************************************************************/
if (!isAuth) {
  window.location.href = './login.html';
} else { //double check there's a cookie
    try {
      await checkForCookie();
      //configure navbar
      setSources();
      setNav();
      //configure buttons
      configureButtons();
      //load page data and show to the user
      try {
        const { data } = await getProfileData();
        loadName(data.name);
        refreshAvatar(data.photo, holderElement, 'avatar', '200px');
        loadServices(data.services);
        loadDescription(data.description);
    
        //show the page to the user
        setNotLoading(
          document.getElementById('spinner'), 
          document.getElementById('main-container'), 
          document.getElementById('navbar'), 
          document.getElementById('footer')
        );
      } catch(error) {
        setNotLoading(
          document.getElementById('spinner'), 
          document.getElementById('main-container'), 
          document.getElementById('navbar'), 
          document.getElementById('footer')
        );
        showToast(
          toastDiv, 
          document.getElementById('toast-title'), 
          document.getElementById('toast-body'), 
          'Something went wrong', 
          'response' in error ? error.response.data.error : 'Check your internet connection.', 
          false
        );
      }
    } catch(error) {
      localStorage.setItem('isAuth', 'false');
      window.location.reload();
    }
}

/************************************************************
 * All other JavaScript
************************************************************/
import { onLogout } from '../api/auth';
import { showToast } from '../utils/toast';

const pictureInput = document.getElementById('profile-picture');
const saveButton = document.getElementById('save');
const logoutLink = document.getElementById('logout-link');
const toastDiv = document.getElementById('toast');
const avatarErrorMessage = document.getElementById('avatar-error');
const errorMessage = document.getElementById('error-message');
const beerButton = document.getElementById('beer');

const urlParams = new URLSearchParams(window.location.search);
const isJustRegistered = urlParams.get('registration-success') === 'true' ? true : false;

let isAvatarError = false;
let isAvatarUpdated = false;

const hideAvatarError = () => {
  avatarErrorMessage.classList.add('d-none');
};

const showAvatarError = () => {
  avatarErrorMessage.classList.remove('d-none');
};

const handlePictureInput = () => {
  // Get the selected file
  const file = pictureInput.files[0];
  if (file) {
    if (file.size < 2000000) {
      isAvatarUpdated = true;
      hideAvatarError();
      showPreview(file);
      isAvatarError = false;
    } else {
      isAvatarError = true;
      showAvatarError();
    }
  }
};

const showPreview = (file) => {
  // Create a FileReader object
  const reader = new FileReader();

  // Set up the reader's onload event handler
  reader.onload = (event) => {
    // Display the uploaded image
    refreshAvatar(event.target.result, holderElement, 'avatar', '200px');
  };

  // Read the selected file as Data URL
  reader.readAsDataURL(file);
};

const processServicesForBackend = () => {
  services = [];
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

const clearNameError = () => {
  if (isNameError) {
    userName.classList.remove('border-danger');
    clearErrorMessage();
    isNameError = false;
    if (!services.length) {
      showEmptyServicesError();
    } else if (errorService) {
      showServiceError(errorService);
    }
  }
};

const clearAllErrors = () => {
  clearNameError();
  clearEmptyServicesError();
  if (errorService) {
    clearServiceBorder(errorService);
    errorService = null;
  }
};

const saveProfile = async (event) => {
  event.preventDefault();
  clearAllErrors();
  [services, errorService] = processServicesForBackend();
  if (errorService) {
    showServiceError(errorService);
  } else if (!services.length) {
    showEmptyServicesError();
  } else if (!userName.value) {
    showNameError();
  } else if (!isAvatarError) {
    setLoadingButton(saveButton, 'Saving...');
    const dataToSave = {
      name: userName.value,
      avatarURL: isAvatarUpdated ? holderElement.children[0].src : 'not changed',
      services: services,
      description: descriptionInput.value
    };
    try {
      await putProfile(dataToSave);
      if (isJustRegistered) {
        if (isAvatarUpdated) localStorage.setItem('avatar', holderElement.children[0].src || '');
        const params = new URLSearchParams();
        params.append('edit-profile-success', 'true');
        const url = `./index.html?${params.toString()}`;
        window.location.href = url;
      } else {
        if (isAvatarUpdated) {
          localStorage.setItem('avatar', holderElement.children[0].src || '');
          refreshAvatar(localStorage.getItem('avatar'), navbarHolderSpan, 'navbar-avatar', '40px');
        }
        showToast(
          toastDiv, 
          document.getElementById('toast-title'), 
          document.getElementById('toast-body'), 
          'Success!', 
          'Your profile has been saved.',
          true
        );
      }
    } catch(error) {
      if ('response' in error && error.response.status === 401) {
        localStorage.setItem('isAuth', 'false');
        window.location.reload();
      } else {
        showToast(
          toastDiv, 
          document.getElementById('toast-title'), 
          document.getElementById('toast-body'), 
          'Something went wrong', 
          'response' in error ? error.response.data.error : 'Check your internet connection.', 
          false
        );
      }
    }
    setNotLoadingButton(saveButton, 'Save Profile');
  }
};

const hideToast = () => {
  toastDiv.style.display = 'none';
};

const handleLogout = async () => {
  try {
    await onLogout();
    localStorage.setItem('isAuth', 'false');
    window.location.reload();
  } catch(error) {
    showToast(
      toastDiv, 
      document.getElementById('toast-title'), 
      document.getElementById('toast-body'), 
      'Something went wrong', 
      'response' in error ? error.response.data.error : 'Check your internet connection.', 
      false
    );
  }
};

pictureInput.addEventListener('input', handlePictureInput);
saveButton.addEventListener('click', saveProfile);
logoutLink.addEventListener('click', handleLogout);
toastDiv.addEventListener('hidden.bs.toast', hideToast); //fires when toast finishes hiding
userName.addEventListener('input', clearNameError);
beerButton.addEventListener('click', () => window.location.href = './buy-me-a-beer.html');