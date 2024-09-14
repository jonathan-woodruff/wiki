import { isAuth } from './authenticate';

if (!isAuth) window.location.href = './login.html';

//Import Bootstrap CSS
import './scss/styles.scss';
//Import Bootstrap JS
import * as bootstrap from 'bootstrap';

//Display the html
import { setNotLoading, setLoading } from './utils/spinner';
const spinnerDiv = document.getElementById('spinner');
const mainContainer = document.getElementById('main-container');
const navbar = document.getElementById('navbar');
setNotLoading(spinnerDiv, mainContainer, navbar);

import EditorJS from '@editorjs/editorjs';

import { onPostWiki, getCreateWikiData } from './api/main';
import { configureNav, logout } from './utils/navbar';

import Quote from '@editorjs/quote';
import SimpleImage from '@editorjs/simple-image';
import Header from '@editorjs/header';
import Table from '@editorjs/table';
import NestedList from '@editorjs/nested-list';
import Underline from '@editorjs/underline';

import PeaceChicken from './images/peace_chicken.jpg';
import Logo from './images/logo.png';

const countryInput = document.getElementById('country');
const sectorInput = document.getElementById('sector');
const titleInput = document.getElementById('title');

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
})

const button = document.getElementById('submit');
const logoImg = document.getElementById('logo-img');
const picturePreview = document.getElementById('pic-preview');
const navCreateLI = document.getElementById('nav-create-li');
const navCreateA = document.getElementById('nav-create-a');
const navDropdown = document.getElementById('nav-dropdown');
const navRegisterButton = document.getElementById('nav-register-button');
const logoutLink = document.getElementById('logout-link');

logoImg.src = Logo;
picturePreview.src = PeaceChicken;

const submitContent = () => {
  setLoading(spinnerDiv, mainContainer, navbar);
  editor.save()
  .then((outputData) => {
    const postData = {
      country: countryInput.value,
      sector: sectorInput.value,
      title: titleInput.value,
      article: outputData
    };
    onPostWiki(postData)
    .then((response) => {
      console.log(response);
    })
    .catch((error => {
      console.log('Submit failed: ', error)
    }))
  })
  .catch((error) => {
    console.log('Saving failed: ', error);
  });
  setNotLoading(spinnerDiv, mainContainer, navbar);
};

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
    const errorMessage = error.response.data.errors[0].msg; //error from axios
    console.log(errorMessage);
  }
};

button.addEventListener('click', submitContent);
logoutLink.addEventListener('click', logout);

configureNav(isAuth, navRegisterButton, navDropdown, navCreateLI, navCreateA);
loadData();