/************************************************************ 
 * Import Bootstrap CSS and JavaScript 
************************************************************/
import './scss/styles.scss'; //css
import * as bootstrap from 'bootstrap'; //js

/************************************************************
 * Configure the navbar
************************************************************/
import { configureNav, logout } from './utils/navbar';
import Logo from './images/logo.png';
import { refreshAvatar } from './utils/navbar';

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
  const navRegisterButton = document.getElementById('nav-register-button');
  configureNav(isAuth, navRegisterButton, navDropdown, navCreateLI, navCreateA, navCommunityLI, navCommunityA);
};

setSources();
setNav();

/************************************************************
 * Show the page to the user
************************************************************/
import { setNotLoading } from './utils/spinner';

const showPage = () => {
    const spinnerDiv = document.getElementById('spinner');
    const mainContainer = document.getElementById('main-container');
    const navbar = document.getElementById('navbar');
    setNotLoading(spinnerDiv, mainContainer, navbar);
};

showPage();

/************************************************************
 * All other JavaScript
************************************************************/
import Beer from './images/beer.png';

const logoutLink = document.getElementById('logout-link');
const customButton = document.getElementById('button-custom');
const button5 = document.getElementById('button-5');
const button10 = document.getElementById('button-10');
const customDiv = document.getElementById('custom-div');
const beerImagesDiv = document.getElementById('beer-images');
const beerImage1 = document.getElementById('beer-image1');
const beerImage2 = document.getElementById('beer-image2');
const beerImage3 = document.getElementById('beer-image3');
const beerCheers = document.getElementById('beer-cheers');

beerImage1.src = Beer;
beerImage2.src = Beer;
beerImage3.src = Beer;

const clearButtons = () => {
    customButton.classList.replace('btn-outline-success', 'btn-outline-primary');
    button5.classList.replace('btn-outline-success', 'btn-outline-primary');
    button10.classList.replace('btn-outline-success', 'btn-outline-primary');
};

const handleButtonClick = (event) => {
    clearButtons();

    const clickedButton = event.currentTarget;
    clickedButton.classList.replace('btn-outline-primary', 'btn-outline-success')

    customDiv.style.display = clickedButton.id === 'button-custom' ? '' : 'none';

    if (clickedButton.id === 'button-5') {
        beerImage1.classList.remove('d-none');
        beerImage2.classList.add('d-none');
        beerImage3.classList.add('d-none');
        beerCheers.innerHTML = 'Cheers!'
    } else if (clickedButton.id === 'button-10') {
        beerImage1.classList.remove('d-none');
        beerImage2.classList.remove('d-none');
        beerImage3.classList.add('d-none');
        beerCheers.innerHTML = 'Cheers! Cheers!'
    } else { //custom button clicked
        beerImage1.classList.remove('d-none');
        beerImage2.classList.remove('d-none');
        beerImage3.classList.remove('d-none');    
        beerCheers.innerHTML = 'Cheeeeeeeeers!'
    }
    beerImagesDiv.style.display = '';
};

logoutLink.addEventListener('click', logout);
customButton.addEventListener('click', handleButtonClick);
button5.addEventListener('click', handleButtonClick);
button10.addEventListener('click', handleButtonClick);