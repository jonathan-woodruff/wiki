// Import our custom CSS
import './scss/styles.scss';

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap';

import EditorJS from '@editorjs/editorjs';

import Quote from '@editorjs/quote';
import SimpleImage from '@editorjs/simple-image';
import Header from '@editorjs/header';
import Table from '@editorjs/table';
import NestedList from '@editorjs/nested-list';
import Underline from '@editorjs/underline';

import { onViewHistoricalWiki } from './api/main';
import { goToWiki } from './utils/wiki';

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

const loadHeader = () => {
    h1.innerHTML = data.title + ' (' + editionHeader + ')';
    countryAndSector.innerHTML = 'Country: ' + data.country + '\xa0\xa0\xa0' + 'Sector: ' + data.sector;
};

const goCurrent = () => {
    const params = new URLSearchParams();
    const wikiID = data.wikiID;
    goToWiki(wikiID);
};

viewCurrentButton.addEventListener('click', goCurrent);

loadHeader();