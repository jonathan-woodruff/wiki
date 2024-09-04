import { isAuth } from './authenticate';

// Import our custom CSS
import './scss/styles.scss';

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap';

import EditorJS from '@editorjs/editorjs';

import { onViewWiki, onPutWiki } from './api/main';
import EditIcon from './images/edit.png';
import CancelIconWhite from './images/cancel_white.png';
import CancelIconGrey from './images/cancel_grey.png';

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
const missingErrorRow = document.getElementById('missing-error-row');
const charactersRemaining = document.getElementById('characters-remaining');

editImg.src = EditIcon;
cancelImg.src = CancelIconGrey;

const maxLengthStr = changeDescription.getAttribute('maxlength');
charactersRemaining.innerHTML = maxLengthStr;
const maxDescriptionLength = parseInt(maxLengthStr);

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

const showAuthError = () => {
  const errorElement = document.getElementById('auth-error');
  errorElement.classList.remove('d-none');
};

const goEditMode = () => {
  if (!isAuth) {
    showAuthError();
  } else {
    editor.readOnly.toggle();
    editRow.classList.add('d-none');
    descriptionRow.classList.remove('d-none');
    cancelPublish.classList.remove('d-none');
  }
};

const refresh = () => {
  window.location.reload();
};

const publishEdits = async () => {
  editor.save()
  .then((outputData) => {
    const putData = {
      wikiId: wikiID,
      changeDescription: changeDescription.value,
      article: outputData
    };
    onPutWiki(putData)
    .then((response) => {
      refresh();
    })
    .catch((error => {
      alert('Submit failed: ', error)
    }))
  })
  .catch((error) => {
    alert('Saving failed: ', error);
  });
};

const hideError = () => {
  missingErrorRow.classList.add('d-none');
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
    missingErrorRow.classList.remove('d-none');
    changeDescription.classList.add('border');
    changeDescription.classList.add('border-danger');
  } else {
    publishModal.show();
  }
};

editButton.addEventListener('click', goEditMode);
confirmCancelButton.addEventListener('click', refresh);
cancelButton.addEventListener('mouseover', useWhiteIcon);
cancelButton.addEventListener('mouseout', useGreyIcon);
publishButton.addEventListener('click', checkDescription);
confirmPublishButton.addEventListener('click', publishEdits);
changeDescription.addEventListener('input', handleDescriptionInput);