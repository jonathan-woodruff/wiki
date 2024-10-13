/************************************************************
 * Ensure the user is authenticated 
************************************************************/
const isAuth = localStorage.getItem('isAuth') === 'true' ? true : false;
if (!isAuth) window.location.href = './login.html';

/************************************************************ 
 * Import Bootstrap CSS and JavaScript 
************************************************************/
import './scss/styles.scss'; //css
import * as bootstrap from 'bootstrap'; //js

/************************************************************
 * Configure the navbar 
************************************************************/
import Logo from './images/logo.png';
import { configureNav, logout } from './utils/navbar';
import { refreshAvatar } from './utils/navbar';

const setSources = () => {
  const logoImg = document.getElementById('logo-img');
  logoImg.src = Logo;
  const navbarHolderSpan = document.getElementById('navbar-avatar-holder');
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

setSources();
setNav();

/************************************************************
 * Configure the editor
************************************************************/
import EditorJS from '@editorjs/editorjs';
import Quote from '@editorjs/quote';
import ImageTool from '@editorjs/image';
import SimpleImage from '@editorjs/simple-image';
import Header from '@editorjs/header';
import Table from '@editorjs/table';
import NestedList from '@editorjs/nested-list';
import Underline from '@editorjs/underline';
const editor = new EditorJS({
  holder: 'editorjs',
  tools: {
    underline: Underline,
    image: SimpleImage,
    list: {
      class: NestedList,
      inlineToolbar: true,
      config: {
        defaultStyle: 'ordered'
      },
    },
    header: {
      class: Header,
      shortcut: 'CMD+SHIFT+H',
      config: {
        defaultLevel: 2,
        levels: [2, 3, 4]
      }
    },
    quote: {
      class: Quote,
      inlineToolbar: true,
      shortcut: 'CMD+SHIFT+O',
      config: {
        quotePlaceholder: 'Enter a quote',
        captionPlaceholder: 'Quote\'s author',
      },
    },
    table: {
      class: Table,
      inlineToolbar: true,
      config: {
        rows: 2,
        cols: 3,
      },
    },
  }
});

/************************************************************
 * Load data from backend
************************************************************/
import { onPostWiki, getCreateWikiData } from './api/main';

const countryInput = document.getElementById('country');
const sectorInput = document.getElementById('sector');

const loadCountries = (countries) => {
  countries.forEach(country => {
    const option = document.createElement('option');
    option.value = country;
    option.innerHTML = country;
    countryInput.appendChild(option);
  });
};

const loadSectors = (sectors) => {
  sectors.forEach(sector => {
    const option = document.createElement('option');
    option.value = sector;
    option.innerHTML = sector;
    sectorInput.appendChild(option);
  });
};

const loadData = async () => {
  try {
    const { data } = await getCreateWikiData();
    loadCountries(data.countries);
    loadSectors(data.sectors);
  } catch(error) {
    if (error.response.status === 401) {
      localStorage.setItem('isAuth', false);
      window.location.reload();
    }
  }
};

loadData();

/************************************************************
 * Show the page to the user
************************************************************/
import { setNotLoading } from './utils/spinner';

const spinnerDiv = document.getElementById('spinner');
const mainContainer = document.getElementById('main-container');
const navbar = document.getElementById('navbar');
setNotLoading(spinnerDiv, mainContainer, navbar);

/************************************************************
 * All other JavaScript
************************************************************/
import { setLoadingButton, setNotLoadingButton } from './utils/spinner';
import { checkForCookie } from './api/auth';

const button = document.getElementById('submit');
const logoutLink = document.getElementById('logout-link');

const submitContent = (event) => {
  event.preventDefault();
  setLoadingButton(button, 'Creating...');
  editor.save()
  .then((outputData) => {
    const titleInput = document.getElementById('title');
    const postData = {
      country: countryInput.value,
      sector: sectorInput.value,
      title: titleInput.value,
      article: outputData
    };
    onPostWiki(postData)
    .then((response) => {
      console.log(response);
      const wikiID = response.data.wikiID;
      const params = new URLSearchParams();
      params.append('wiki', wikiID);
      const url = `./wiki.html?${params.toString()}`;
      window.location.href = url;
    })
    .catch((error => {
      console.log('Submit failed: ', error)
      if (error.response.status === 401) {
        localStorage.setItem('isAuth', false);
        window.location.reload();
      }
      setNotLoadingButton(button, 'Create');
    }))
  })
  .catch((error) => {
    console.log('Saving failed: ', error);
    setNotLoadingButton(button, 'Create');
  });
};

const handlePageshow = async () => {
  try {
    await checkForCookie();
  } catch(error) {
    if (error.response.status === 401) {
      localStorage.setItem('isAuth', 'false');
      window.location.href = './login.html';
    }
  }
};

const handleLogout = async () => {
  try {
      await logout();
      window.location.reload();
  } catch(error) {
      console.log(error);
  }
};

button.addEventListener('click', submitContent);
logoutLink.addEventListener('click', handleLogout);
window.addEventListener('pageshow', handlePageshow);