/************************************************************ 
 * Import Bootstrap CSS and JavaScript 
************************************************************/
import './scss/styles.scss'; //css
import * as bootstrap from 'bootstrap'; //js

import './css/buttons.css';

/************************************************************
 * Configure the navbar
************************************************************/
import { configureNav, logout } from './utils/navbar';
import Logo from './images/logo.png';
import { refreshAvatar } from './utils/navbar';

const navRegisterButton = document.getElementById('nav-register-button');

const setSources = () => {
  const logoImg = document.getElementById('logo-img');
  logoImg.src = Logo;
  const navbarHolderSpan = document.getElementById('navbar-avatar-holder');
  refreshAvatar(localStorage.getItem('avatar'), navbarHolderSpan, 'navbar-avatar', '40px');
};

const setNav = () => {
  const isAuth = localStorage.getItem('isAuth') === 'true' ? true : false;
  const navCreateLI = document.getElementById('nav-create-li');
  const navCreateA = document.getElementById('nav-create-a');
  const navCommunityLI = document.getElementById('nav-community-li');
  const navCommunityA = document.getElementById('nav-community-a');
  const navDropdown = document.getElementById('nav-dropdown');
  configureNav(isAuth, navRegisterButton, navDropdown, navCreateLI, navCreateA, navCommunityLI, navCommunityA);
};

setSources();
setNav();

/************************************************************
 * Configure images
************************************************************/
import BeerAvatar from './images/beer_avatar.png';
import Beer from './images/beer.png';
const beerAvatar = document.getElementById('beer-avatar');
const beerImage1 = document.getElementById('beer-image1');
const beerImage2 = document.getElementById('beer-image2');
const beerImage3 = document.getElementById('beer-image3');

beerAvatar.src = BeerAvatar
beerImage1.src = Beer;
beerImage2.src = Beer;
beerImage3.src = Beer;

/************************************************************
 * Show the page to the user
************************************************************/
import { setNotLoading } from './utils/spinner';

const showPage = () => {
    const spinnerDiv = document.getElementById('spinner');
    const mainContainer = document.getElementById('main-container');
    const navbar = document.getElementById('navbar');
    const footer = document.getElementById('footer');
    setNotLoading(spinnerDiv, mainContainer, navbar, footer);
};

showPage();

/************************************************************
 * All other JavaScript
************************************************************/

const logoutLink = document.getElementById('logout-link');
const customButton = document.getElementById('button-custom');
const button5 = document.getElementById('button-5');
const button10 = document.getElementById('button-10');
const continueDiv = document.getElementById('continue-div');
const continueButton = document.getElementById('continue');
const customAmountInput = document.getElementById('custom-amount');
const errorRow = document.getElementById('error-row');
const beerButton = document.getElementById('beer');

let selectedButton;

const hideCustomInputError = () => {
    errorRow.classList.add('d-none');
};

const showCustomInputError = () => {
    errorRow.classList.remove('d-none');
};

const disableContinueButton = () => {
    continueDiv.setAttribute('title', 'Choose an amount');
    continueButton.classList.add('disabled');
    continueButton.setAttribute('tabindex', '-1');
    continueButton.setAttribute('aria-disabled', 'true');
};

const enableContinueButton = () => {
    continueDiv.setAttribute('title', '');
    continueButton.classList.remove('disabled');
    continueButton.setAttribute('tabindex', '1');
    continueButton.setAttribute('aria-disabled', 'false');
};

const clearButtons = () => {
    customButton.classList.replace('btn-outline-success', 'btn-outline-primary');
    button5.classList.replace('btn-outline-success', 'btn-outline-primary');
    button10.classList.replace('btn-outline-success', 'btn-outline-primary');
};

const handleButtonClick = (event) => {
    const beerCheers = document.getElementById('beer-cheers');
    const beerImagesDiv = document.getElementById('beer-images');
    const customDiv = document.getElementById('custom-div');

    //make all the buttons have a blue outline
    clearButtons();

    //make the selected button have a green outline
    const clickedButton = event.currentTarget;
    clickedButton.classList.replace('btn-outline-primary', 'btn-outline-success')

    //Show or hide the custom amount input field
    customDiv.style.display = clickedButton.id === 'button-custom' ? '' : 'none';

    if (clickedButton.id === 'button-5') {
        //show/hide beer images and cheers text
        beerImage1.classList.remove('d-none');
        beerImage2.classList.add('d-none');
        beerImage3.classList.add('d-none');
        beerCheers.innerHTML = 'Cheers!'
        //set button as selected
        selectedButton = 'button5';

        hideCustomInputError();
        enableContinueButton();
    } else if (clickedButton.id === 'button-10') {
        //show/hide beer images and cheers text
        beerImage1.classList.remove('d-none');
        beerImage2.classList.remove('d-none');
        beerImage3.classList.add('d-none');
        beerCheers.innerHTML = 'Cheers! Cheers!'
        //set button as selected
        selectedButton = 'button10';

        hideCustomInputError();
        enableContinueButton();
    } else { //custom button clicked
        //show/hide beer images and cheers text
        beerImage1.classList.remove('d-none');
        beerImage2.classList.remove('d-none');
        beerImage3.classList.remove('d-none');    
        beerCheers.innerHTML = 'Cheeeeeeeeers!'
        //set button as selected
        selectedButton = 'custom';
        //disable continueButton if input field is empty
        if (customAmountInput.value === '') disableContinueButton();
    }
    beerImagesDiv.style.display = '';
};

const handleInput = () => {
    hideCustomInputError();
    if (customAmountInput.value === '') {
        disableContinueButton();
    } else if (continueButton.classList.contains('disabled')) { //if continueButton is disabled...
        enableContinueButton();
    }
};

const getSelectedAmount = () => {
    if (selectedButton === 'button5') return '500';
    if (selectedButton === 'button10') return '1000';
    if (selectedButton === 'custom') {
        const inputAmount = customAmountInput.value;
        if (inputAmount >= 1) return Math.floor(inputAmount * 100).toString();
        disableContinueButton();
        showCustomInputError();
    }
};

const handleContinue = () => {
    const amount = getSelectedAmount();
    if (amount) {
        const params = new URLSearchParams();
        params.append('amount', amount);
        const url = `./beer-pay.html?${params.toString()}`;
        window.location.href = url;
    }
};

const handleLogout = async () => {
    try {
        await logout();
        window.location.reload();
    } catch(error) {
        console.log(error);
    }
};

const goLogin = () => {
    const params = new URLSearchParams();
    params.append('prev', 'buy-me-a-beer');
    const url = `./login.html?${params.toString()}`;
    window.location.href = url;
};

logoutLink.addEventListener('click', handleLogout);
customButton.addEventListener('click', handleButtonClick);
button5.addEventListener('click', handleButtonClick);
button10.addEventListener('click', handleButtonClick);
customAmountInput.addEventListener('input', handleInput);
continueButton.addEventListener('click', handleContinue);
beerButton.addEventListener('click', () => window.location.href = './buy-me-a-beer.html');
navRegisterButton.addEventListener('click', goLogin);