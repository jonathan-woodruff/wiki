// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

import { onAddDummy } from '../api/auth';

const button = document.getElementById('button');

// Write your code here:
const doButtonStuff = async () => {
  try {
    alert('hi');
    await onAddDummy();
  } catch(error) {
    const errorMessage = error.response.data.error; //error from axios
    console.log(errorMessage);
  };
}

button.addEventListener('click',doButtonStuff);