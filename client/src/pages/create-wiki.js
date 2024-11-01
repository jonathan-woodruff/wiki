/************************************************************ 
 * Import Bootstrap CSS and JavaScript 
************************************************************/
import '../scss/styles.scss'; //css
import * as bootstrap from 'bootstrap'; //js

import '../css/buttons.css';
import '../css/editor.css';

/************************************************************
 * Configure the editor
************************************************************/
import { ButtonImage } from '../utils/wiki';

import EditorJS from '@editorjs/editorjs';
import Quote from '@editorjs/quote';
import SimpleImage from '@editorjs/simple-image';
import Header from '@editorjs/header';
import Table from '@editorjs/table';
import NestedList from '@editorjs/nested-list';
import Underline from '@editorjs/underline';

const errorRow = document.getElementById('error-row');
const errorMessage = document.getElementById('error-message');
const titleInput = document.getElementById('title');
const editorDiv = document.getElementById('editorjs');

let isTitleError = false;
let isContentError = false;
let everythingIsSaved = true;
let finishedSaving = true;

const hideError = () => {
  errorRow.classList.add('d-none');
  isTitleError = false;
  isContentError = false;
  titleInput.classList.remove('border-danger');
  editorDiv.classList.remove('border-danger');
};

const showError = () => {
  errorRow.classList.remove('d-none');
};

const editor = new EditorJS({
  holder: 'editorjs',
  placeholder: 'Starting writing...',
  onChange: (api, event) => {
    if (isContentError) hideError();
    everythingIsSaved = false;
    autoSave();
  },
  tools: {
    underline: Underline,
    image: ButtonImage,
    image2: SimpleImage,
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
 * Ensure the user is authenticated 
************************************************************/
import { checkForCookie } from '../api/auth';
import { onPostDraft, saveDraft, getCreateWikiData } from '../api/main';
import Logo from '../images/logo.png';
import Info from '../images/info.png';
import { configureNav, refreshAvatar } from '../utils/navbar';
import { showToast } from '../utils/toast';
import { setNotLoading, setLoadingButton, setNotLoadingButton } from '../utils/spinner';

const countryInput = document.getElementById('country');
const sectorInput = document.getElementById('sector');
const toastDiv = document.getElementById('toast');

const isAuth = localStorage.getItem('isAuth') === 'true' ? true : false;

const urlParams = new URLSearchParams(window.location.search);
const wikiID = urlParams.get('wiki');

const setSources = () => {
  const logoImg = document.getElementById('logo-img');
  const countryInfo = document.getElementById('country-info');
  const sectorInfo = document.getElementById('sector-info');
  logoImg.src = Logo;
  countryInfo.src = Info;
  sectorInfo.src = Info;
  const navbarHolderSpan = document.getElementById('navbar-avatar-holder');
  refreshAvatar(localStorage.getItem('avatar'), navbarHolderSpan, 'navbar-avatar', '40px');
};

const setNav = () => {
  const navCreateLI = document.getElementById('nav-create-li');
  const navCreateA = document.getElementById('nav-create-a');
  const navDropdown = document.getElementById('nav-dropdown');
  const navRegisterButton = document.getElementById('nav-register-button');
  configureNav(isAuth, navRegisterButton, navDropdown, navCreateLI, navCreateA);
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

const handleGetWikiError = (error) => {
  const errorResponse = 'response' in error ? error.response.data.error : '';
    if (errorResponse === 'Wiki is published') {
      const params = new URLSearchParams();
      params.append('wiki', wikiID);
      const url = `./wiki.html?${params.toString()}`;
      window.location.href = url;
    } else if (errorResponse === 'User is not the author') {
      window.location.href = './index.html';
    } else {
      showToast(
        toastDiv, 
        document.getElementById('toast-title'), 
        document.getElementById('toast-body'), 
        'Something went wrong', 
        errorResponse || 'Check your internet connection.', 
        false
      );
    }
};

if (!isAuth) {
  window.location.href = './login.html';
} else { //double check there's a cookie
    try {
      await checkForCookie();
      if (wikiID) { //user is editing an existing draft
        //configure navbar
        setSources();
        setNav();
        try {
          //load the data
          const { data } = await getCreateWikiData(wikiID);
          loadCountries(data.countryOptions);
          loadSectors(data.sectorOptions);
          countryInput.value = data.country;
          sectorInput.value = data.sector;
          titleInput.value = data.title;
          editor.render({
            time: data.contentTime,
            blocks: data.contentBlocks,
            version: data.contentVersion
          });
          //show page to the user
          setNotLoading(
            document.getElementById('spinner'), 
            document.getElementById('main-container'), 
            document.getElementById('navbar'), 
            document.getElementById('footer')
          );
        } catch(error) {
          handleGetWikiError(error);
        }
      } else { //User is creating a new draft
        try {
          //create draft in database
          const editorData = await editor.save();
          const payload = { article: editorData };
          const draftResponse = await onPostDraft(payload);
          //reload page with the wikiID in the params
          const params = new URLSearchParams();
          params.append('wiki', draftResponse.data.wikiID);
          const url = `./create-wiki.html?${params.toString()}`;
          window.location.href = url;
        } catch(error) {
          window.location.href = './fail.html';
        }
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
import { goToWiki } from '../utils/wiki';

const button = document.getElementById('submit');
const logoutLink = document.getElementById('logout-link');
const beerButton = document.getElementById('beer');

const submitContent = async (event) => {
  event.preventDefault();
  hideError();
  if (titleInput.value) {
    try {
      setLoadingButton(button, 'Publishing...');
      const outputData = await editor.save();
      if (outputData.blocks.length) {
        try {
          const payload = {
            wikiID: wikiID,
            isPublished: true,
            country: countryInput.value,
            sector: sectorInput.value,
            title: titleInput.value,
            article: outputData
          };
          await saveDraft(payload);
          goToWiki(wikiID);
        } catch(error) {
          showToast(
            toastDiv, 
            document.getElementById('toast-title'), 
            document.getElementById('toast-body'), 
            'Something went wrong', 
            'response' in error ? error.response.data.error : 'Check your internet connection.', 
            false
          );
          setNotLoadingButton(button, 'Publish');
        }
      } else {
        errorMessage.innerHTML = 'Please enter wiki content';
        isContentError = true;
        editorDiv.classList.add('border-danger');
        showError();
        setNotLoadingButton(button, 'Publish');
      }
    } catch(error) {
      showToast(
        toastDiv, 
        document.getElementById('toast-title'), 
        document.getElementById('toast-body'), 
        'Something went wrong', 
        'Editor error: Could not save changes.', 
        false
      );
      setNotLoadingButton(button, 'Publish');
    }
  } else {
    errorMessage.innerHTML = 'Please enter a title';
    isTitleError = true;
    titleInput.classList.add('border-danger');
    showError();
  }
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

const showSavedStatus = (statusStr) => {
  const savedStatusSpan = document.getElementById('saved-status');
  const savedStatusDiv = document.getElementById('saved-status-div');
  if (statusStr === 'saved') {
    savedStatusSpan.innerHTML = 'Draft Saved!';
    savedStatusDiv.classList.replace('bg-danger', 'bg-light');
    savedStatusSpan.classList.replace('text-white', 'text-dark');
  } else if (statusStr === 'not saved') {
    savedStatusSpan.innerHTML = '...saving';
    savedStatusDiv.classList.replace('bg-danger', 'bg-light');
    savedStatusSpan.classList.replace('text-white', 'text-dark');
  } else if (statusStr === 'error') {
    savedStatusSpan.innerHTML = 'Error saving. Draft not up to date. Check your internet connection.';
    savedStatusDiv.classList.replace('bg-light', 'bg-danger');
    savedStatusSpan.classList.replace('text-dark', 'text-white');
  }
};

const autoSave = async () => {
  if (!everythingIsSaved && finishedSaving) {
    showSavedStatus('not saved');
    everythingIsSaved = true;
    finishedSaving = false;
    try {
      const editorData = await editor.save();
      //const editorData = await editorInstance.save();
      const payload = {
        wikiID: wikiID,
        isPublished: false,
        country: countryInput.value,
        sector: sectorInput.value,
        title: titleInput.value,
        article: editorData
      };
      await saveDraft(payload);
      finishedSaving = true;
      if (everythingIsSaved) showSavedStatus('saved');
      autoSave();
    } catch(error) {
      finishedSaving = true;
      showSavedStatus('error');
    }
  }
};

const handleTitleInput = () => {
  if (isTitleError) hideError();
  everythingIsSaved = false;
  autoSave();
};

const handleCountryInput = () => {
  everythingIsSaved = false;
  autoSave();
};

const handleSectorInput = () => {
  everythingIsSaved = false;
  autoSave();
};

const hideToast = () => toastDiv.style.display = 'none';

button.addEventListener('click', submitContent);
logoutLink.addEventListener('click', handleLogout);
beerButton.addEventListener('click', () => window.location.href = './buy-me-a-beer.html');
toastDiv.addEventListener('hidden.bs.toast', hideToast); //fires when toast finishes hiding
titleInput.addEventListener('input', handleTitleInput);
countryInput.addEventListener('input', handleCountryInput);
sectorInput.addEventListener('input', handleSectorInput);