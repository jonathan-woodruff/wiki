import { isAuth } from './authenticate';

// Import our custom CSS
import './scss/styles.scss';

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap';

import EditorJS from '@editorjs/editorjs';

import { onViewWiki } from './api/main';
import EditIcon from './images/edit.png';
import CancelIcon from './images/remove.png';

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
const publishRow = document.getElementById('publish-row');
const editButton = document.getElementById('edit-button');
const cancelImg = document.getElementById('cancel-img');

editImg.src = EditIcon;
cancelImg.src = CancelIcon;

let isEditing = false;

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
  readOnly: !isEditing,
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
    isEditing = true;
    editRow.classList.add('d-none');
    publishRow.classList.remove('d-none');
  }
};

editButton.addEventListener('click', goEditMode);