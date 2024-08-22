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

const getData2 = () => {
    return {
        "time": 1724356313099,
        "blocks": [
            {
                "data": {
                    "text": "kjdofiadj"
                },
                "id": "WNc7",
                "type": "paragraph"
            }
        ],
        "version": "2.30.5"
    }
};

const editor = new EditorJS({
    /**
     * Id of Element that should contain the Editor
     */
    holder : 'editorjs',

    readOnly: true,

    data: await getData()
    
  });