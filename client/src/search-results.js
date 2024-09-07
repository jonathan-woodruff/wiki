// Import our custom CSS
import './scss/styles.scss';

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap';

import Fuse from 'fuse.js';

import { getWikis } from './api/main';
import { countries, sectors } from './constants/profile';
import { submitSearch, enterSubmit, focusOnInput, showFocus, showFocusOut, hideError } from './utils/search';
import { goToWiki } from './utils/wiki';

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
  if (wikis.length) {
    wikis.forEach(wiki => {
      const card = document.createElement('div');
      card.id = wiki.item._id; //useful so when the user clicks the card, you can pass the id to the wiki page via urlParams query string
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
      h2.innerHTML = wiki.item.title;
      cardBody.appendChild(h2);

      const p1 = document.createElement('p');
      p1.classList.add('card-text');
      p1.innerHTML = showPreview(wiki.item.contentBlocks); 
      cardBody.appendChild(p1);

      const p2 = document.createElement('p2');
      p2.style.fontSize = '0.9em';
      p2.innerHTML = 'Country: ' + wiki.item.country + '\xa0\xa0\xa0\xa0' + 'Sector: ' + wiki.item.sector;
      cardBody.appendChild(p2);
    })
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
};

const showPreview = (contentBlocks) => {
  const previewLimit = 80;
  let preview = '';
  let reachedPreviewLimit = false;
  let blockIndex = 0;
  while (!reachedPreviewLimit && blockIndex < contentBlocks.length) {
    let block = contentBlocks[blockIndex];
    if (block.type === 'paragraph') {
      preview += block.data.text + ' ';
      if (preview.length > previewLimit) {
        preview = preview.slice(0, previewLimit);
        reachedPreviewLimit = true;
      }
    }
    blockIndex++;
  }
  preview = preview.trimEnd();
  return preview + '...';
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

submitButton.addEventListener('click', submitSearch);
searchDiv.addEventListener('click', focusOnInput);
searchEngine.addEventListener('focus', showFocus);
searchEngine.addEventListener('focusout', showFocusOut);
searchEngine.addEventListener('keypress', enterSubmit);
searchEngine.addEventListener('input', hideError);

searchWikis();
loadCountries();
loadSectors();
populateSearchEngine();
