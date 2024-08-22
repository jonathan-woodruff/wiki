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

import { onPostWiki } from './api/main';

const editor = new EditorJS({
  holder: 'editorjs',
  underline: Underline,
  image: SimpleImage,
  tools: {
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

// Write your code here:
const submitContent = () => {
  alert('clicked submit button')

  editor.save()
  .then((outputData) => {
    console.log('Article data: ', outputData);
    onPostWiki(outputData)
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
}

button.addEventListener('click', submitContent);