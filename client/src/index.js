// Import our custom CSS
import './scss/styles.scss';

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap';

import { onLogout } from './api/auth';

import SearchIcon from './images/search_icon.svg';

const logoutButton = document.getElementById('logout');
const form = document.getElementById('form');
const submitButton = document.getElementById('submit');
const searchEngine = document.getElementById('search-engine');
const searchDiv = document.getElementById('search-div');
const searchImg = document.getElementById('search-icon');

searchImg.src = SearchIcon;

const submitSearch = () => {
  const params = new URLSearchParams();
  const searchPattern = searchEngine.value;
  params.append('search', searchPattern);
  const queryString = params.toString();
  const url = `./search-results.html?${queryString}`;
  window.location.href = url;
};

const enterSubmit = (event) => {
  if (event.key === 'Enter') submitSearch();
};

// Write your code here:
const logout = async () => {
  try {
    await onLogout();
    window.location.href = './login.html';
  } catch(error) {
    const errorMessage = error.response.data.error; //error from axios
    console.log(errorMessage);
  };
};

const focusOnInput = () => {
  searchEngine.focus();
};

const showFocus = () => {
  searchDiv.classList.replace('border-1', 'border-2');
};

const showFocusOut = () => {
  searchDiv.classList.replace('border-2', 'border-1');
};

//logoutButton.addEventListener('click', logout);
submitButton.addEventListener('click', submitSearch);
searchDiv.addEventListener('click', focusOnInput);
searchEngine.addEventListener('focus', showFocus);
searchEngine.addEventListener('focusout', showFocusOut);
searchEngine.addEventListener('keypress', enterSubmit);