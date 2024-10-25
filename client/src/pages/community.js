/************************************************************ 
 * Import Bootstrap CSS and JavaScript 
************************************************************/
import '../scss/styles.scss'; //css
import * as bootstrap from 'bootstrap'; //js

import '../css/buttons.css';

/************************************************************
 * Ensure the user is authenticated
************************************************************/
import { checkForCookie } from '../api/auth';
import { setNotLoading, setLoadingButton, setNotLoadingButton } from '../utils/spinner';
import Logo from '../images/logo.png';
import { configureNav, refreshAvatar } from '../utils/navbar';

const isAuth = localStorage.getItem('isAuth') === 'true' ? true : false;

const setSources = () => {
  const logoImg = document.getElementById('logo-img');
  const navbarHolderSpan = document.getElementById('navbar-avatar-holder');
  logoImg.src = Logo;
  refreshAvatar(localStorage.getItem('avatar'), navbarHolderSpan, 'navbar-avatar', '40px');
};

const setNav = () => {
  const navCreateLI = document.getElementById('nav-create-li');
  const navCreateA = document.getElementById('nav-create-a');
  const navCommunityLI = document.getElementById('nav-community-li');
  const navCommunityA = document.getElementById('nav-community-a');
  const navDropdown = document.getElementById('nav-dropdown');
  const navRegisterButton = document.getElementById('nav-register-button');
  configureNav(isAuth, navRegisterButton, navDropdown, navCreateLI, navCreateA, navCommunityLI, navCommunityA);
};

if (!isAuth) {
  window.location.href = './login.html';
} else { //double check there's a cookie
    try {
      await checkForCookie();
      //configure navbar
      setSources();
      setNav();
      //show page to the user
      setNotLoading(
        document.getElementById('spinner'), 
        document.getElementById('main-container'), 
        document.getElementById('navbar'), 
        document.getElementById('footer')
      );
    } catch(error) {
      localStorage.setItem('isAuth', 'false');
      window.location.reload();
    }
}

/************************************************************
 * All other JavaScript
************************************************************/
import { onLogout } from '../api/auth';
import { postCommunity } from '../api/main';
import { showToast } from '../utils/toast';

const submitButton = document.getElementById('submit');
const reasonInput = document.getElementById('reason');
const amountInput = document.getElementById('amount');
const errorDiv = document.getElementById('error-div');
const errorMessage = document.getElementById('error-message');
const logoutLink = document.getElementById('logout-link');
const toastDiv = document.getElementById('toast');
const beerButton = document.getElementById('beer');

let isReasonError = false;
let isAmountError = false;

const handleSubmit = async (event) => {
    event.preventDefault();
    clearAllErrors();
    const otherInput = document.getElementById('other');
    const payload = {
        reason: reasonInput.value,
        amount: amountInput.value,
        other: otherInput.value
    };
    if (!payload.reason) {
      isReasonError = true;
      errorMessage.innerHTML = 'Please describe why you are interested in joining';
      errorDiv.classList.remove('d-none');
      reasonInput.classList.add('border');
      reasonInput.classList.add('border-danger');
    } else if (!payload.amount) {
      isAmountError = true;
      errorMessage.innerHTML = 'Please specify an amount';
      errorDiv.classList.remove('d-none');
      amountInput.classList.add('border');
      amountInput.classList.add('border-danger');
    } else {
      setLoadingButton(submitButton, 'Submitting...');
      try {
        await postCommunity(payload);
        reasonInput.value = null;
        amountInput.value = null;
        otherInput.value = null;
        showToast(
          toastDiv, 
          document.getElementById('toast-title'), 
          document.getElementById('toast-body'), 
          'Success!', 
          'Your responses were saved.',
          true
        );
      } catch(error) {
        showToast(
          toastDiv, 
          document.getElementById('toast-title'), 
          document.getElementById('toast-body'), 
          'Something went wrong', 
          'response' in error ? error.response.data.error : 'Check your internet connection.', 
          false
        );
      }
      setNotLoadingButton(submitButton, 'Submit');
    }
};

const hideToast = () => {
  toastDiv.style.display = 'none';
};

const clearErrorMessage = () => {
  errorDiv.classList.add('d-none');
  errorMessage.innerHTML = '';
};

const resetErrorStates = () => {
  isReasonError = false;
  isAmountError = false;
};

const clearAllErrors = () => {
  reasonInput.classList.remove('border-danger');
  amountInput.classList.remove('border-danger');
  clearErrorMessage();
  resetErrorStates();
};

const clearError = (event) => {
  const inputField = event.currentTarget;
  if ((inputField.id === 'reason' && isReasonError) || (inputField.id === 'amount' && isAmountError)) {
    inputField.classList.remove('border-danger');
    clearErrorMessage();
    resetErrorStates();
  }
};

const handleLogout = async () => {
  try {
    await onLogout();
    localStorage.setItem('isAuth', 'false');
    window.location.reload();
  } catch(error) {
    showToast(
      toastDiv, 
      document.getElementById('toast-title'), 
      document.getElementById('toast-body'), 
      'Something went wrong', 
      'response' in error ? error.response.data.error : 'Check your internet connection.', 
      false
    );
  }
};

submitButton.addEventListener('click', handleSubmit);
reasonInput.addEventListener('input', clearError);
amountInput.addEventListener('input', clearError);
logoutLink.addEventListener('click', handleLogout);
toastDiv.addEventListener('hidden.bs.toast', hideToast); //fires when toast finishes hiding
beerButton.addEventListener('click', () => window.location.href = './buy-me-a-beer.html');