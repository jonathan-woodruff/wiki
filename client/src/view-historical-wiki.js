//Import Bootstrap CSS
import './scss/styles.scss';
//Import Bootstrap JS
import * as bootstrap from 'bootstrap';

//Display the html
import { setNotLoading } from './utils/spinner';
const spinnerDiv = document.getElementById('spinner');
const mainContainer = document.getElementById('main-container');
const navbar = document.getElementById('navbar');
setNotLoading(spinnerDiv, mainContainer, navbar);

import EditorJS from '@editorjs/editorjs';

import Quote from '@editorjs/quote';
import SimpleImage from '@editorjs/simple-image';
import Header from '@editorjs/header';
import Table from '@editorjs/table';
import NestedList from '@editorjs/nested-list';
import Underline from '@editorjs/underline';

import { onViewHistoricalWiki } from './api/main';
import { goToWiki } from './utils/wiki';
import { isAuth } from './authenticate';
import { configureNav, logout } from './utils/navbar';

import PeaceChicken from './images/peace_chicken.jpg';
import Logo from './images/logo.png';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const wikiHistoryID = urlParams.get('edition');
const editionHeader = urlParams.get('editionHeader');

const logoImg = document.getElementById('logo-img');
const picturePreview = document.getElementById('pic-preview');
const navCreateLI = document.getElementById('nav-create-li');
const navCreateA = document.getElementById('nav-create-a');
const navDropdown = document.getElementById('nav-dropdown');
const navRegisterButton = document.getElementById('nav-register-button');
const logoutLink = document.getElementById('logout-link');

logoImg.src = Logo;
picturePreview.src = PeaceChicken;

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

const h1 = document.getElementById('h1');
const viewCurrentButton = document.getElementById('current');
const countryAndSector = document.getElementById('country-sector');
const authorLink = document.getElementById('author-link');
const descriptionSpan = document.getElementById('change-description');

const loadHeader = () => {
    //h1
    h1.innerHTML = data.title + ' (' + editionHeader + ')';
    //country and sector
    countryAndSector.innerHTML = 'Country: ' + data.country + '\xa0\xa0\xa0' + 'Sector: ' + data.sector;
    //link to author profile
    const params = new URLSearchParams();
    params.append('user', data.userID);
    const queryString = params.toString();
    authorLink.href = `./view-profile.html?${queryString}`;
    authorLink.innerHTML += data.authorName;
    //change description
    descriptionSpan.innerHTML = data.changeDescription;
};

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

viewCurrentButton.addEventListener('click', goCurrent);
logoutLink.addEventListener('click', logout);
navRegisterButton.addEventListener('click', goLogin);

configureNav(isAuth, navRegisterButton, navDropdown, navCreateLI, navCreateA);
loadHeader();