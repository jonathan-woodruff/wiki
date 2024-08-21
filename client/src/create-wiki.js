// Import our custom CSS
import './scss/styles.scss';

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap';

const button = document.getElementById('button2');

// Write your code here:
const doButtonStuff = async () => {
  alert('clicked button2')
}

button.addEventListener('click',doButtonStuff);