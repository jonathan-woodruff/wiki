// Import our custom CSS
import './scss/styles.scss';

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap';

import Fuse from 'fuse.js';

import { onLogout } from './api/auth';
import { getWikis } from './api/main';

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
		"contentBlocks.data.text"
	]
};

const loadWikis = async () => {
  try {
    const wikis = await getWikis();
    return wikis.data.wikis;
  } catch(error) {
    console.log(error);
  }
};

let wikis = [];
wikis = await loadWikis();

const searchWikis = async (event) => {
  event.preventDefault();
  const searchPattern = document.getElementById('search-engine').value;
  if (wikis.length) {
    const fuse = new Fuse(wikis, fuseOptions);
    console.log(fuse.search(searchPattern));
  } else {
    try {
      const belatedWikis = await loadWikis();
      const fuse = new Fuse(belatedWikis.data.wikis, fuseOptions);
      console.log(fuse.search(searchPattern));
    } catch(error) {
      console.log(error);
    }
  }
};

const button = document.getElementById('logout');
const form = document.getElementById('form');

// Write your code here:
const logout = async () => {
  try {
    localStorage.setItem('isAuth', 'false');
    window.location.href = './login.html';
    await onLogout();
  } catch(error) {
    const errorMessage = error.response.data.error; //error from axios
    console.log(errorMessage);
  };
};

button.addEventListener('click', logout);
form.addEventListener('submit', searchWikis);