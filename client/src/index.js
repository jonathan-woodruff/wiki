// Import our custom CSS
import './scss/styles.scss';

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap';

import Fuse from 'fuse.js';

import { onLogout } from './api/auth';
import { getWikis } from './api/main';

import SearchIcon from './images/search_icon.svg';

const fuseOptions = {
	// isCaseSensitive: false,
	// includeScore: false,
	// shouldSort: true,
	// includeMatches: false,
	// findAllMatches: false,
	// minMatchCharLength: 1,
	// location: 0,
	// threshold: 0.6,
	// distance: 100,
	// useExtendedSearch: false,
	// ignoreLocation: false,
	// ignoreFieldNorm: false,
	// fieldNormWeight: 1,
	keys: [
    "title",
    "country",
    "sector",
		"contentBlocks.data.text"
	]
};

const logoutButton = document.getElementById('logout');
const form = document.getElementById('form');
const submitButton = document.getElementById('submit');
const searchEngine = document.getElementById('search-engine');
const searchDiv = document.getElementById('search-div');
const searchImg = document.getElementById('search-icon');

searchImg.src = SearchIcon;

const loadWikis = async () => {
  try {
    const wikis = await getWikis();
    return wikis.data.wikis;
  } catch(error) {
    console.log(error);
  }
};

const allWikis = loadWikis();

const searchWikis = async (event) => {
  event.preventDefault();
  const searchPattern = document.getElementById('search-engine').value;
  allWikis
  .then((wikis) => {
    console.log(wikis);
    const fuse = new Fuse(wikis, fuseOptions);
    console.log(fuse.search(searchPattern));
  })
  .catch((error) => {
    console.log(error);
  });
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
form.addEventListener('submit', searchWikis);
submitButton.addEventListener('click', searchWikis);
searchDiv.addEventListener('click', focusOnInput);
searchEngine.addEventListener('focus', showFocus);
searchEngine.addEventListener('focusout', showFocusOut);