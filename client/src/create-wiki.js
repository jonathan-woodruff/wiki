import { isAuth } from './authenticate';

if (!isAuth) window.location.href = './login.html';

// Import our custom CSS
import './scss/styles.scss';

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap';

import EditorJS from '@editorjs/editorjs';

import { onPostWiki, getCreateWikiData } from './api/main';

import Quote from '@editorjs/quote';
import SimpleImage from '@editorjs/simple-image';
import Header from '@editorjs/header';
import Table from '@editorjs/table';
import NestedList from '@editorjs/nested-list';
import Underline from '@editorjs/underline';

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

const submitContent = () => {
  alert('clicked submit button')

  editor.save()
  .then((outputData) => {
    console.log('Article data: ', outputData);
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
loadData();
