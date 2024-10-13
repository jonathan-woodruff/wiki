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
const isAuth = localStorage.getItem('isAuth') === 'true' ? true : false;

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
  configureNav(isAuth, navRegisterButton, navDropdown, navCreateLI, navCreateA, navCommunityLI, navCommunityA);
};

setSources();
setNav();

/************************************************************
 * Configure other images
************************************************************/
import EditIcon from './images/edit.png';
import CancelIconGrey from './images/cancel_grey.png';

const editImg = document.getElementById('edit-icon');
const cancelImg = document.getElementById('cancel-img');
editImg.src = EditIcon;
cancelImg.src = CancelIconGrey;

/************************************************************
 * Configure the editor
************************************************************/
import { onViewWiki, onPutWiki } from './api/main';
import EditorJS from '@editorjs/editorjs';
import Quote from '@editorjs/quote';
import SimpleImage from '@editorjs/simple-image';
import Header from '@editorjs/header';
import Table from '@editorjs/table';
import NestedList from '@editorjs/nested-list';
import Underline from '@editorjs/underline';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const wikiID = urlParams.get('wiki');

const getWiki = async () => {
  const { data } = await onViewWiki(wikiID);
  return data.wiki;
};

const wiki = await getWiki();

let editorData = {
  time: wiki.contentTime,
  blocks: wiki.contentBlocks,
  version: wiki.contentVersion
};

const editor = new EditorJS({
  holder: 'editorjs',
  readOnly: true,
  data: editorData,
  onChange: (api, event) => {
    hideNoEditsError();
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
 * Configure the edit button
************************************************************/
const editButton = document.getElementById('edit-button');

const configureEditButton = () => {
  if (isAuth) {
    editButton.disabled = false;
    const editButtonWrapper = document.getElementById('edit-button-wrapper');
    editButtonWrapper.title = '';
  }
};

configureEditButton();

/************************************************************
 * Show page data
************************************************************/
const displayWiki = (wiki) => {
  const title = document.getElementById('title');
  title.innerHTML = wiki.title;
  const countryAndSector = document.getElementById('country-sector');
  countryAndSector.innerHTML = 'Country: ' + wiki.country + '\xa0\xa0\xa0' + 'Sector: ' + wiki.sector;
};

displayWiki(wiki);

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
import { arraysAreEqual } from './utils/index';
import { setLoadingButton, setNotLoadingButton } from './utils/spinner';
import CancelIconWhite from './images/cancel_white.png';
import { checkForCookie } from './api/auth';

const cancelButton = document.getElementById('cancel');
const confirmCancelButton = document.getElementById('confirm-cancel');
const publishButton = document.getElementById('publish');
const confirmPublishButton = document.getElementById('confirm-publish');
const changeDescription = document.getElementById('change-description');
const errorRow = document.getElementById('error-row');
const errorParagraph = document.getElementById('error-paragraph');
const charactersRemaining = document.getElementById('characters-remaining');
const historyButton = document.getElementById('history');
const xButton = document.getElementById('x-button');
const closeButton = document.getElementById('close-button');
const editorDiv = document.getElementById('editorjs');
const logoutLink = document.getElementById('logout-link');
const publishModal = new bootstrap.Modal(document.getElementById('publish-modal'));

const maxLengthStr = changeDescription.getAttribute('maxlength');
charactersRemaining.innerHTML = maxLengthStr;
const maxDescriptionLength = parseInt(maxLengthStr);

const goEditMode = async () => {
  try {
    await checkForCookie();
    editor.readOnly.toggle();
    const editRow = document.getElementById('edit-row');
    editRow.classList.add('d-none');
    const descriptionRow = document.getElementById('description-row');
    descriptionRow.classList.remove('d-none');
    const cancelPublish = document.getElementById('cancel-publish');
    cancelPublish.classList.remove('d-none');
  } catch(error) {
    if (error.response.status === 401) {
      localStorage.setItem('isAuth', 'false');
      window.location.reload();
    }
  }
};

const refresh = () => {
  window.location.reload();
};

const showLoadingButton = () => {
  xButton.classList.add('disabled');
  closeButton.classList.add('disabled');
  setLoadingButton(confirmPublishButton, 'Publishing...');
};

const dontShowLoadingButton = () => {
  xButton.classList.remove('disabled');
  closeButton.classList.remove('disabled');
  setNotLoadingButton(confirmPublishButton, 'Publish');
};

const showNoEditsError = () => {
  errorParagraph.innerHTML = 'You did not make any edits. Please make edits before publishing.';
  errorRow.classList.remove('d-none');
  editorDiv.classList.add('border');
  editorDiv.classList.add('border-danger');
};

const hideNoEditsError = () => {
  errorRow.classList.add('d-none');
  editorDiv.classList.remove('border');
  editorDiv.classList.remove('border-danger');
};

const publishEdits = async () => {
  showLoadingButton();
  const putData = {
    wikiId: wikiID,
    changeDescription: changeDescription.value,
    article: editorData
  };
  try {
    await onPutWiki(putData);
    refresh();
  } catch(error) {
    if (error.response.status === 401) {
      localStorage.setItem('isAuth', false);
      window.location.reload();
    };
    publishModal.hide();
    dontShowLoadingButton();
  }
  /*
  onPutWiki(putData)
      .then((response) => {
        refresh();
      })
      .catch((error) => {
        publishModal.hide();
        dontShowLoadingButton();
        alert('Submit failed: ', error)
      })
  
  editor.save()
  .then((outputData) => {
    const putData = {
      wikiId: wikiID,
      changeDescription: changeDescription.value,
      article: outputData
    };
    const wikiChanged = !arraysAreEqual(outputData.blocks, wiki.contentBlocks); //true if the current edits on the front end are different from the current version of the wiki stored in the backend
    if (wikiChanged) {
      onPutWiki(putData)
      .then((response) => {
        refresh();
      })
      .catch((error) => {
        publishModal.hide();
        dontShowLoadingButton();
        alert('Submit failed: ', error)
      })
    } else { //no edits were made to the wiki, so there is nothing to save
      publishModal.hide();
      dontShowLoadingButton();
      showNoEditsError();
    }
  })
  .catch((error) => {
    publishModal.hide();
    dontShowLoadingButton();
    alert('Saving failed: ', error);
  });
  */
};

const hideError = () => {
  errorRow.classList.add('d-none');
  changeDescription.classList.remove('border');
  changeDescription.classList.remove('border-danger');
};

const showCharactersRemaining = () => {
  const numCharacters = changeDescription.value.length;
  const remaining = maxDescriptionLength - numCharacters;
  charactersRemaining.innerHTML = remaining.toString();
};

const useWhiteIcon = () => {
  cancelImg.src = CancelIconWhite;
};

const useGreyIcon = () => {
  cancelImg.src = CancelIconGrey;
};

const handleDescriptionInput = () => {
  hideError();
  showCharactersRemaining();
};

const checkPublish = () => {
  if (!changeDescription.value) {
    errorParagraph.innerHTML = 'Please describe the changes you made';
    errorRow.classList.remove('d-none');
    changeDescription.classList.add('border');
    changeDescription.classList.add('border-danger');
  } else {
    showLoadingButton();
    editor.save()
    .then((outputData) => {
      const wikiChanged = !arraysAreEqual(outputData.blocks, wiki.contentBlocks); //true if the current edits on the front end are different from the current version of the wiki stored in the backend
      if (wikiChanged) {
        editorData = outputData;
        const publishModalDiv = document.getElementById('publish-modal');
        publishModalDiv.style.display = 'block';
        publishModal.show();
        dontShowLoadingButton();
      } else { //no edits were made to the wiki, so there is nothing to save
        publishModal.hide();
        dontShowLoadingButton();
        showNoEditsError();
      }
    })
    .catch((error) => {
      publishModal.hide();
      dontShowLoadingButton();
      alert('Saving failed: ', error);
    });
  }
};

const handleHistoryClick = () => {
  const url = `./history.html?${urlParams.toString()}`;
  window.location.href = url;
};

const checkCancel = () => {
  const cancelModalDiv = document.getElementById('cancel-modal');
  cancelModalDiv.style.display = 'block';
  const cancelModal = new bootstrap.Modal(document.getElementById('cancel-modal'));
  cancelModal.show();
};

const goLogin = () => {
  const params = new URLSearchParams();
  params.append('prev', 'wiki');
  params.append('wiki', wikiID);
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

editButton.addEventListener('click', goEditMode);
confirmCancelButton.addEventListener('click', refresh);
cancelButton.addEventListener('mouseover', useWhiteIcon);
cancelButton.addEventListener('mouseout', useGreyIcon);
cancelButton.addEventListener('click', checkCancel);
publishButton.addEventListener('click', checkPublish);
confirmPublishButton.addEventListener('click', publishEdits);
changeDescription.addEventListener('input', handleDescriptionInput);
historyButton.addEventListener('click', handleHistoryClick);
logoutLink.addEventListener('click', handleLogout);
navRegisterButton.addEventListener('click', goLogin);
