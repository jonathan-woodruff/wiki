// Import our custom CSS
import './scss/styles.scss';

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap';

import EditorJS from '@editorjs/editorjs';

import { getWikiContent } from './api/main';

const getData = async () => {
    try {
        const { data } = await getWikiContent();
        const formattedData = {
            time: data.contentTime,
            blocks: data.contentBlocks,
            version: data.contentVersion
        };
        return formattedData;
    } catch(error) {
        console.log(error);
        return {};
    }
};

const editor = new EditorJS({
    holder : 'editorjs',

    readOnly: true,

    data: await getData()
    
  });