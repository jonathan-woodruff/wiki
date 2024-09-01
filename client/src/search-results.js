// Import our custom CSS
import './scss/styles.scss';

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap';

import Fuse from 'fuse.js';

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
    "title",
    "country",
    "sector",
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
  
const allWikis = loadWikis();
  
const searchWikis = async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const searchPattern = urlParams.get('search');
    allWikis
    .then((wikis) => {
      const fuse = new Fuse(wikis, fuseOptions);
      console.log(fuse.search(searchPattern));
    })
    .catch((error) => {
      console.log(error);
    });
};

await searchWikis();