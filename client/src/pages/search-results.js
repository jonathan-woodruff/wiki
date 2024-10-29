/************************************************************ 
 * Import Bootstrap CSS and JavaScript 
************************************************************/
import '../scss/styles.scss'; //css
import * as bootstrap from 'bootstrap'; //js

import '../css/buttons.css';

/************************************************************
 * Configure the navbar
************************************************************/
import { configureNav, refreshAvatar } from '../utils/navbar';
import Logo from '../images/logo.png';

const navRegisterButton = document.getElementById('nav-register-button');

const setSources = () => {
  const logoImg = document.getElementById('logo-img');
  logoImg.src = Logo;
  const navbarHolderSpan = document.getElementById('navbar-avatar-holder');
  refreshAvatar(localStorage.getItem('avatar'), navbarHolderSpan, 'navbar-avatar', '40px');
};

const setNav = () => {
  const isAuth = localStorage.getItem('isAuth') === 'true' ? true : false;
  const navCreateLI = document.getElementById('nav-create-li');
  const navCreateA = document.getElementById('nav-create-a');
  const navDropdown = document.getElementById('nav-dropdown');
  configureNav(isAuth, navRegisterButton, navDropdown, navCreateLI, navCreateA);
};

setSources();
setNav();

/************************************************************
 * Configure other images
************************************************************/
import SearchIcon from '../images/search_icon.svg';

const searchImg = document.getElementById('search-icon');
searchImg.src = SearchIcon;

/************************************************************
 * Load data from backend 
************************************************************/
import { getWikis } from '../api/main';
import { goToWiki } from '../utils/wiki';
import { countries, sectors } from '../constants/profile';
import Fuse from 'fuse.js';
import { showToast } from '../utils/toast';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const searchPattern = urlParams.get('search');
const selectedCountry = urlParams.get('country');
const selectedSector = urlParams.get('sector');
const searchEngine = document.getElementById('search-engine');
const countryInput = document.getElementById('country');
const sectorInput = document.getElementById('sector');
const showMoreDiv = document.getElementById('show-more-div');
const showMoreButton = document.getElementById('show-more-button');
const toastDiv = document.getElementById('toast');
const spinner2Div = document.getElementById('spinner2');

const numCardsToShow = 10;
let numShowMoreClicked = 0;
let wikiResults = [];

const loadWikis = async () => {
  try {
    const wikis = await getWikis(selectedCountry, selectedSector);
    return wikis.data.wikis;
  } catch(error) {
    showToast(
      toastDiv, 
      document.getElementById('toast-title'), 
      document.getElementById('toast-body'), 
      'Something went wrong', 
      'response' in error ? error.response.data.error : 'Check your internet connection.', 
      false
    );
    return [];
  }
};

const allWikis = loadWikis();

const handleMouseover = (event) => {
  const card = event.currentTarget;
  card.classList.add('bg-light');
};

const handleMouseout = (event) => {
  const card = event.currentTarget;
  card.classList.remove('bg-light');
};

const handleClick = (event) => {
  const card = event.currentTarget;
  const wikiID = card.id;
  goToWiki(wikiID);
};

const showPreview = (contentBlocks) => {
  const previewLimit = 80;
  let preview = '';
  let reachedPreviewLimit = false;
  let blockIndex = 0;
  while (!reachedPreviewLimit && blockIndex < contentBlocks.length) {
    let block = contentBlocks[blockIndex];
    if (block.type === 'paragraph' || block.type === 'header' || block.type === 'quote') {
      preview += block.data.text + ' ';
    } else if (block.type === 'list') {
      block.data.items.forEach((item) => {
        preview += item.content + ' ';
      })
    }
    if (preview.length > previewLimit) {
      preview = preview.slice(0, previewLimit);
      reachedPreviewLimit = true;
    }
    blockIndex++;
  }
  preview = preview.trimEnd();
  return preview + '...';
};

const showCards = (wikis) => {
  const cardDiv = document.getElementById('card-div');
  if (wikis.length) {
    const baseSlice = numShowMoreClicked * numCardsToShow;
    const endSlice = numCardsToShow;
    const wikisToShow = wikis.slice(baseSlice, baseSlice + endSlice);
    wikisToShow.forEach(wiki => {
      const card = document.createElement('div');
      card.id = wiki._id; //useful so when the user clicks the card, you can pass the id to the wiki page via urlParams query string
      card.role = 'button';
      card.classList.add('card');
      card.classList.add('mb-3');
      card.classList.add('shadow-sm');
      card.addEventListener('mouseover', handleMouseover);
      card.addEventListener('mouseout', handleMouseout);
      card.addEventListener('click', handleClick);
      cardDiv.appendChild(card);

      const cardBody = document.createElement('div');
      cardBody.classList.add('card-body');
      card.appendChild(cardBody);

      const h2 = document.createElement('h2');
      h2.classList.add('card-title');
      h2.classList.add('h4');
      h2.innerHTML = wiki.title;
      cardBody.appendChild(h2);

      const p1 = document.createElement('p');
      p1.classList.add('card-text');
      p1.innerHTML = showPreview(wiki.contentBlocks); 
      cardBody.appendChild(p1);

      const p2 = document.createElement('p2');
      p2.style.fontSize = '0.9em';
      p2.innerHTML = 'Country: ' + wiki.country + '\xa0\xa0\xa0\xa0' + 'Sector: ' + wiki.sector;
      cardBody.appendChild(p2);
    });
    if (wikis.length > baseSlice + endSlice) {
      showMoreDiv.style.display = 'block';
    } else {
      showMoreDiv.style.display = 'none';
    };
  } else { //no wikis found based on the search
    const p1 = document.createElement('p');
    p1.classList.add('fs-6');
    p1.classList.add('text-center');
    p1.classList.add('mt-2');
    p1.innerHTML = '-----------';
    cardDiv.appendChild(p1);
    const p2 = document.createElement('p');
    p2.classList.add('fs-6');
    p2.classList.add('text-center');
    p2.innerHTML = 'No wikis found. Try a different search.';
    cardDiv.appendChild(p2);
  }
  spinner2Div.style.display = 'none';
};

const formatFuseList = (wikis) => {
  const formattedList = [];
  wikis.forEach(wiki => {
    formattedList.push(wiki.item);
  });
  return formattedList;
};

const searchWikis = (searchPattern) => {
  allWikis
  .then((wikis) => {
    if (searchPattern) {
      const fuseOptions = {
        // isCaseSensitive: false,
        // includeScore: false,
        // shouldSort: true,
        // includeMatches: false,
        findAllMatches: true,
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
      const fuse = new Fuse(wikis, fuseOptions);
      const matchingWikis = fuse.search(searchPattern);
      wikiResults = formatFuseList(matchingWikis);
      showCards(wikiResults);
    } else {
      wikiResults = wikis; //useful when you show more cards
      showCards(wikiResults);
    }
  })
  .catch((error) => {
    showToast(
      toastDiv, 
      document.getElementById('toast-title'), 
      document.getElementById('toast-body'), 
      'Something went wrong', 
      'Could not load wikis.', 
      false
    );
  })
};

const populateSearchEngine = () => {
  searchEngine.value = searchPattern;
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

populateSearchEngine();
loadCountries();
loadSectors();
searchWikis(searchPattern);

/************************************************************
 * Show the page to the user
************************************************************/
import { setNotLoading } from '../utils/spinner';

const focusOnEngine = () => {
  searchEngine.focus();
};

const showPage = () => {
  const spinnerDiv = document.getElementById('spinner');
  const mainContainer = document.getElementById('main-container');
  const navbar = document.getElementById('navbar');
  const footer = document.getElementById('footer');
  setNotLoading(spinnerDiv, mainContainer, navbar, footer);
};

showPage();
focusOnEngine();
spinner2Div.style.display = 'block'; //show spinner2

/************************************************************
 * All other JavaScript
************************************************************/
import { submitSearch } from '../utils/search';
import { onLogout } from '../api/auth';

const submitButton = document.getElementById('submit');
const searchDiv = document.getElementById('search-div');
const logoutLink = document.getElementById('logout-link');
const beerButton = document.getElementById('beer');

const goLogin = () => {
  const params = new URLSearchParams();
  params.append('prev', 'search-results');
  params.append('search', searchPattern);
  params.append('country', selectedCountry);
  params.append('sector', selectedSector);
  const url = `./login.html?${params.toString()}`;
  window.location.href = url;
};

const showMoreCards = () => {
  numShowMoreClicked++;
  showCards(wikiResults);
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

const handleSubmit = () => {
  submitSearch(searchEngine.value, countryInput.value, sectorInput.value);
};

const enterSubmit = (event) => {
  if (event.key === 'Enter') handleSubmit();
};

const showFocus = () => {
  searchDiv.classList.replace('border-1', 'border-2');
};

const showFocusOut = () => {
  searchDiv.classList.replace('border-2', 'border-1');
};

const hideToast = () => toastDiv.style.display = 'none';

submitButton.addEventListener('click', handleSubmit);
searchDiv.addEventListener('click', focusOnEngine);
searchEngine.addEventListener('focus', showFocus);
searchEngine.addEventListener('focusout', showFocusOut);
searchEngine.addEventListener('keypress', enterSubmit);
logoutLink.addEventListener('click', handleLogout);
navRegisterButton.addEventListener('click', goLogin);
showMoreButton.addEventListener('click', showMoreCards);
beerButton.addEventListener('click', () => window.location.href = './buy-me-a-beer.html');
toastDiv.addEventListener('hidden.bs.toast', hideToast); //fires when toast finishes hiding