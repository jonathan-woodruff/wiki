import { isAuth } from './authenticate';

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

import { onViewWiki, onPutWiki } from './api/main';
import { arraysAreEqual } from './utils/index';

import EditIcon from './images/edit.png';
import CancelIconWhite from './images/cancel_white.png';
import CancelIconGrey from './images/cancel_grey.png';
import PeaceChicken from './images/peace_chicken.jpg';
import Logo from './images/logo.png';

import Quote from '@editorjs/quote';
import SimpleImage from '@editorjs/simple-image';
import Header from '@editorjs/header';
import Table from '@editorjs/table';
import NestedList from '@editorjs/nested-list';
import Underline from '@editorjs/underline';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const wikiID = urlParams.get('wiki');

const title = document.getElementById('title');
const countryAndSector = document.getElementById('country-sector');
const editImg = document.getElementById('edit-icon');
const editRow = document.getElementById('edit-row');
const cancelPublish = document.getElementById('cancel-publish');
const editButton = document.getElementById('edit-button');
const cancelImg = document.getElementById('cancel-img');
const cancelButton = document.getElementById('cancel');
const confirmCancelButton = document.getElementById('confirm-cancel');
const publishButton = document.getElementById('publish');
const confirmPublishButton = document.getElementById('confirm-publish');
const descriptionRow = document.getElementById('description-row');
const changeDescription = document.getElementById('change-description');
const errorRow = document.getElementById('error-row');
const errorParagraph = document.getElementById('error-paragraph');
const charactersRemaining = document.getElementById('characters-remaining');
const historyButton = document.getElementById('history');
const xButton = document.getElementById('x-button');
const closeButton = document.getElementById('close-button');
const editorDiv = document.getElementById('editorjs');
const logoImg = document.getElementById('logo-img');
const picturePreview = document.getElementById('pic-preview');

editImg.src = EditIcon;
cancelImg.src = CancelIconGrey;
logoImg.src = Logo;
picturePreview.src = PeaceChicken;

const maxLengthStr = changeDescription.getAttribute('maxlength');
charactersRemaining.innerHTML = maxLengthStr;
const maxDescriptionLength = parseInt(maxLengthStr);

const cancelModal = new bootstrap.Modal(document.getElementById('cancel-modal'));
const publishModal = new bootstrap.Modal(document.getElementById('publish-modal'));

const getWiki = async () => {
  const { data } = await onViewWiki(wikiID);
  return data.wiki;
};

const displayWiki = (wiki) => {
  title.innerHTML = wiki.title;
  countryAndSector.innerHTML = 'Country: ' + wiki.country + '\xa0\xa0\xa0' + 'Sector: ' + wiki.sector;
};

const wiki = await getWiki();
displayWiki(wiki);

const editor = new EditorJS({
  holder: 'editorjs',
  readOnly: true,
  data: {
    time: wiki.contentTime,
    blocks: wiki.contentBlocks,
    version: wiki.contentVersion
  },
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

const goEditMode = () => {
  editor.readOnly.toggle();
  editRow.classList.add('d-none');
  descriptionRow.classList.remove('d-none');
  cancelPublish.classList.remove('d-none');
};

const refresh = () => {
  window.location.reload();
};

const showLoadingButton = () => {
  xButton.setAttribute('disabled', true);
  closeButton.setAttribute('disabled', true);
  confirmPublishButton.setAttribute('disabled', true);
  const spinnerSpan = document.createElement('span');
  spinnerSpan.classList.add('spinner-border');
  spinnerSpan.classList.add('spinner-border-sm');
  spinnerSpan.classList.add('me-1');
  spinnerSpan.role = 'status';
  spinnerSpan.ariaHidden = 'true';
  confirmPublishButton.innerHTML = '';
  confirmPublishButton.appendChild(spinnerSpan);
  confirmPublishButton.innerHTML += 'Publishing...';
};

const dontShowLoadingButton = () => {
  xButton.disabled = false;
  closeButton.disabled = false;
  confirmPublishButton.disabled = false;
  confirmPublishButton.innerHTML = 'Publish';
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
  editor.save()
  .then((outputData) => {
    const putData = {
      wikiId: wikiID,
      changeDescription: changeDescription.value,
      article: outputData
    };
    console.log(outputData.blocks);
    console.log(wiki.contentBlocks);
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

const checkDescription = () => {
  if (!changeDescription.value) {
    errorParagraph.innerHTML = 'Please describe the changes you made';
    errorRow.classList.remove('d-none');
    changeDescription.classList.add('border');
    changeDescription.classList.add('border-danger');
  } else {
    publishModal.show();
  }
};

const handleHistoryClick = () => {
  const queryString = urlParams.toString();
  const url = `./history.html?${queryString}`;
  window.location.href = url;
};

const checkAuth = () => {
  if (isAuth) editButton.disabled = false;
};

const openCancelModal = () => {
  const cancelModalDiv = document.getElementById('cancel-modal');
  cancelModalDiv.style.display = 'block';
  cancelModal.show();
};

editButton.addEventListener('click', goEditMode);
confirmCancelButton.addEventListener('click', refresh);
cancelButton.addEventListener('mouseover', useWhiteIcon);
cancelButton.addEventListener('mouseout', useGreyIcon);
cancelButton.addEventListener('click', openCancelModal);
publishButton.addEventListener('click', checkDescription);
confirmPublishButton.addEventListener('click', publishEdits);
changeDescription.addEventListener('input', handleDescriptionInput);
historyButton.addEventListener('click', handleHistoryClick);

checkAuth();