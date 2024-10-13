/************************************************************ 
 * Import Bootstrap CSS and JavaScript 
************************************************************/
import './scss/styles.scss'; //css
import * as bootstrap from 'bootstrap'; //js

/************************************************************
 * Configure the navbar
************************************************************/
import { configureNav, logout } from './utils/navbar';
import Logo from './images/logo.png';
import { refreshAvatar } from './utils/navbar';

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
    const navCommunityLI = document.getElementById('nav-community-li');
    const navCommunityA = document.getElementById('nav-community-a');
    const navDropdown = document.getElementById('nav-dropdown');
    configureNav(isAuth, navRegisterButton, navDropdown, navCreateLI, navCreateA, navCommunityLI, navCommunityA);
};
  
setSources();
setNav();

/************************************************************
 * Load data from backend 
************************************************************/
import { onViewHistoricalWiki } from './api/main';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const wikiHistoryID = urlParams.get('edition');
const editionHeader = urlParams.get('editionHeader');

const getData = async () => {
    try {
        const { data } = await onViewHistoricalWiki(wikiHistoryID);
        return data;
    } catch(error) {
        const errorMessage = error.response.data.errors[0].msg; //error from axios
        console.log(errorMessage);
        return {};
    }
};

const data = await getData();

const loadHeader = () => {
    //h1
    const h1 = document.getElementById('h1');
    h1.innerHTML = data.title + ' (' + editionHeader + ')';
    //country and sector
    const countryAndSector = document.getElementById('country-sector');
    countryAndSector.innerHTML = 'Country: ' + data.country + '\xa0\xa0\xa0' + 'Sector: ' + data.sector;
    //link to author profile
    const holderElement = document.getElementById('avatar-holder');
    const params = new URLSearchParams();
    params.append('user', data.userID);
    const authorLink = document.getElementById('author-link');
    authorLink.href = `./view-profile.html?${params.toString()}`;
    refreshAvatar(data.photo, holderElement, 'avatar', '40px');
    authorLink.innerHTML += data.authorName;
    //change description
    const descriptionSpan = document.getElementById('change-description');
    descriptionSpan.innerHTML = data.changeDescription;
};

loadHeader();

/************************************************************
 * Configure the editor
************************************************************/
import EditorJS from '@editorjs/editorjs';
import Quote from '@editorjs/quote';
import SimpleImage from '@editorjs/simple-image';
import Header from '@editorjs/header';
import Table from '@editorjs/table';
import NestedList from '@editorjs/nested-list';
import Underline from '@editorjs/underline';

const editor = new EditorJS({
    holder: 'editorjs',
    readOnly: true,
    data: {
        time: data.contentTime,
        blocks: data.contentBlocks,
        version: data.contentVersion
    },
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
 * Show the page to the user
************************************************************/
import { setNotLoading } from './utils/spinner';

const showPage = () => {
    const spinnerDiv = document.getElementById('spinner');
    const mainContainer = document.getElementById('main-container');
    const navbar = document.getElementById('navbar');
    setNotLoading(spinnerDiv, mainContainer, navbar);
};

showPage();

/************************************************************
 * All other JavaScript
************************************************************/
import { goToWiki } from './utils/wiki';

const logoutLink = document.getElementById('logout-link');
const viewCurrentButton = document.getElementById('current');

const goCurrent = () => {
    const wikiID = data.wikiID;
    goToWiki(wikiID);
};

const goLogin = () => {
    const params = new URLSearchParams();
    params.append('prev', 'view-historical-wiki');
    params.append('edition', wikiHistoryID);
    params.append('editionHeader', editionHeader);
    const url = `./login.html?${params.toString()}`;
    window.location.href = url;
};

const handleLogout = async () => {
    try {
        await logout();
        window.location.reload();
    } catch(error) {
        console.log(error);
    }
  };

viewCurrentButton.addEventListener('click', goCurrent);
logoutLink.addEventListener('click', handleLogout);
navRegisterButton.addEventListener('click', goLogin);
//window.addEventListener("pageshow", handlePageshow)