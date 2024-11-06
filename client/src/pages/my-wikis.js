/************************************************************ 
 * Import Bootstrap CSS and JavaScript 
************************************************************/
import '../scss/styles.scss'; //css
import * as bootstrap from 'bootstrap'; //js

import '../css/buttons.css';

/************************************************************
 * Ensure the user is authenticated
************************************************************/
import { checkForCookie } from '../api/auth';
import { getMyStuff } from '../api/main';
import { setNotLoading } from '../utils/spinner';
import { showPreview } from '../utils/wiki';
import Logo from '../images/logo.png';
import { configureNav, refreshAvatar } from '../utils/navbar';
import { showToast } from '../utils/toast';
import { toTitleCase } from '../utils/index';

const isAuth = localStorage.getItem('isAuth') === 'true' ? true : false;
const navRegisterButton = document.getElementById('nav-register-button');
const toastDiv = document.getElementById('toast');
const cardDiv = document.getElementById('card-div');
const showMoreDiv = document.getElementById('show-more-div');
const draftRadio = document.getElementById('draft-radio');
const publishedRadio = document.getElementById('published-radio');
const editedRadio = document.getElementById('edited-radio');

const numCardsToShow = 10;
let numShowMoreClicked = 0;

let drafts = [];
let published = [];
let edited = [];
let activeList = drafts;

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
  let relPath = './wiki.html';
  if (activeList === drafts) relPath = './create-wiki.html';
  const params = new URLSearchParams();
  params.append('wiki', wikiID);
  const queryString = params.toString();
  const url = `${relPath}?${queryString}`;
  window.location.href = url;
};

const showWikis = (wikiList) => {
  if (wikiList.length) {
    const baseSlice = numShowMoreClicked * numCardsToShow;
    const endSlice = numCardsToShow;
    const wikisToShow = wikiList.slice(baseSlice, baseSlice + endSlice);
    wikisToShow.forEach(wiki => {
      const card = document.createElement('div');
      card.id = wiki._id; //useful so when the user clicks the card, you can pass the id as a url param
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
      h2.innerHTML = toTitleCase(wiki.title) || 'Untitled';
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
    if (wikiList.length > baseSlice + endSlice) {
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
    if (activeList === drafts) {
      p2.innerHTML = 'You don\'t have any drafts. Try creating a wiki.';
    } else if (activeList === published) {
      p2.innerHTML = 'You haven\'t published any wikis.'
    } else if (activeList === edited) {
      p2.innerHTML = 'You haven\'t edited any wikis.'
    }
    cardDiv.appendChild(p2);
  }
};

if (!isAuth) {
  window.location.href = './login.html';
} else { //double check there's a cookie
    try {
      await checkForCookie();
      //configure navbar
      setSources();
      setNav();
      //load the data
      try {
        const { data } = await getMyStuff();
        drafts = data.drafts;
        published = data.published;
        edited = data.edits;
        draftRadio.checked = true;
        activeList = drafts;
        showWikis(activeList);
        //show page to the user
        setNotLoading(
            document.getElementById('spinner'), 
            document.getElementById('main-container'), 
            document.getElementById('navbar'), 
            document.getElementById('footer')
        );
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
    } catch(error) {
      localStorage.setItem('isAuth', 'false');
      window.location.reload();
    }
}

/************************************************************
 * All other JavaScript
************************************************************/
import { onLogout } from '../api/auth';

const logoutLink = document.getElementById('logout-link');
const beerButton = document.getElementById('beer');
const showMoreButton = document.getElementById('show-more-button');

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
  showWikis(activeList);
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

const handleRadioInput = (event) => {
  //remove cardDiv children
  while (cardDiv.firstChild) {
    cardDiv.removeChild(cardDiv.firstChild);
  };
  //hide the show more button, and reset its number of clicks to zero
  showMoreDiv.style.display = 'none';
  numShowMoreClicked = 0;
  //show the wiki cards
  const radioID = event.currentTarget.id;
  if (radioID === 'draft-radio') {
    activeList = drafts;
  } else if (radioID === 'published-radio') {
    activeList = published;
  } else if (radioID === 'edited-radio') {
    activeList = edited;
  }
  showWikis(activeList);
};

const hideToast = () => toastDiv.style.display = 'none';

logoutLink.addEventListener('click', handleLogout);
navRegisterButton.addEventListener('click', goLogin);
showMoreButton.addEventListener('click', showMoreCards);
beerButton.addEventListener('click', () => window.location.href = './buy-me-a-beer.html');
draftRadio.addEventListener('input', handleRadioInput);
publishedRadio.addEventListener('input', handleRadioInput);
editedRadio.addEventListener('input', handleRadioInput);
toastDiv.addEventListener('hidden.bs.toast', hideToast); //fires when toast finishes hiding