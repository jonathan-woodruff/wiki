// Import our custom CSS
import './scss/styles.scss';

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap';

import Fuse from 'fuse.js';

import { getWikis } from './api/main';
import { countries, sectors } from './constants/profile';
import { submitSearch, enterSubmit, focusOnInput, showFocus, showFocusOut } from './utils/search';

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

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const searchPattern = urlParams.get('search');
const selectedCountry = urlParams.get('country');
const selectedSector = urlParams.get('sector');

const countryInput = document.getElementById('country');
const sectorInput = document.getElementById('sector');
const searchEngine = document.getElementById('search-engine');
const submitButton = document.getElementById('submit');
const searchDiv = document.getElementById('search-div');
const searchImg = document.getElementById('search-icon');
const cardDiv = document.getElementById('card-div');

searchImg.src = SearchIcon;

const loadWikis = async () => {
    try {
      const wikis = await getWikis(selectedCountry, selectedSector);
      return wikis.data.wikis;
    } catch(error) {
      console.log(error);
    }
};
  
const allWikis = loadWikis();

const showCards = (wikis) => {
  console.log(wikis);
  //for each wiki, make a card following the template in the html
};
  
const searchWikis = async () => {
    allWikis
    .then((wikis) => {
      const fuse = new Fuse(wikis, fuseOptions);
      showCards(fuse.search(searchPattern));
    })
    .catch((error) => {
      console.log(error);
    });
};

const loadCountries = () => {
  countries.forEach((country) => {
    let option = document.createElement('option');
    option.value = country;
    option.innerHTML = country;
    if (country === selectedCountry) option.selected = true;
    countryInput.appendChild(option);
  })
};

const loadSectors = () => {
  sectors.forEach((sector) => {
    let option = document.createElement('option');
    option.value = sector;
    option.innerHTML = sector;
    if (sector === selectedSector) option.selected = true;
    sectorInput.appendChild(option);
  });
};

const populateSearchEngine = () => {
  searchEngine.value = searchPattern;
};

submitButton.addEventListener('click', submitSearch);
searchDiv.addEventListener('click', focusOnInput);
searchEngine.addEventListener('focus', showFocus);
searchEngine.addEventListener('focusout', showFocusOut);
searchEngine.addEventListener('keypress', enterSubmit);

searchWikis();
loadCountries();
loadSectors();
populateSearchEngine();
