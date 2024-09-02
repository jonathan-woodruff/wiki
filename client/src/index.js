// Import our custom CSS
import './scss/styles.scss';

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap';

import { onLogout } from './api/auth';
import { countries, sectors } from './constants/profile';
import { submitSearch, enterSubmit, focusOnInput, showFocus, showFocusOut, hideError } from './utils/search';

import SearchIcon from './images/search_icon.svg';

const logoutButton = document.getElementById('logout');
const submitButton = document.getElementById('submit');
const searchEngine = document.getElementById('search-engine');
const searchDiv = document.getElementById('search-div');
const searchImg = document.getElementById('search-icon');
const countryInput = document.getElementById('country');
const sectorInput = document.getElementById('sector');

searchImg.src = SearchIcon;

const loadCountries = () => {
  countries.forEach((country) => {
    let option = document.createElement('option');
    option.value = country;
    option.innerHTML = country;
    countryInput.appendChild(option);
  })
};

const loadSectors = () => {
  sectors.forEach((sector) => {
    let option = document.createElement('option');
    option.value = sector;
    option.innerHTML = sector;
    sectorInput.appendChild(option);
  });
};

const logout = async () => {
  try {
    await onLogout();
    window.location.href = './login.html';
  } catch(error) {
    const errorMessage = error.response.data.error; //error from axios
    console.log(errorMessage);
  };
};

//logoutButton.addEventListener('click', logout);
submitButton.addEventListener('click', submitSearch);
searchDiv.addEventListener('click', focusOnInput);
searchEngine.addEventListener('focus', showFocus);
searchEngine.addEventListener('focusout', showFocusOut);
searchEngine.addEventListener('keypress', enterSubmit);
searchEngine.addEventListener('input', hideError);

loadCountries();
loadSectors();