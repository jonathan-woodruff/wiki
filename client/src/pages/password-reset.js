/************************************************************
 * Ensure the user is not authenticated 
************************************************************/
const isAuth = localStorage.getItem('isAuth') === 'true' ? true : false;
if (isAuth) window.location.href = './change-password.html';

/************************************************************ 
 * Import Bootstrap CSS and JavaScript 
************************************************************/
import '../scss/styles.scss'; //css
import * as bootstrap from 'bootstrap'; //js

/************************************************************
 * Ensure the query params are valid. If so, show the page
************************************************************/
import { checkResetURL, resetPassword } from '../api/auth';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const ident = urlParams.get('ident');
const today = urlParams.get('today');
const hash = urlParams.get('data');

const showPage = async () => {
  try {
    await checkResetURL(ident, today, hash);
    const spinnerDiv = document.getElementById('spinner');
    const mainContainer = document.getElementById('main-container');
    const footer = document.getElementById('footer');
    spinnerDiv.style.display = 'none';
    mainContainer.style.display = '';
    footer.style.display = '';
  } catch(error) {
    if ('response' in error && error.response.data.error === 'Link is outdated') {
      const params = new URLSearchParams();
      params.append('password-reset-fail', 'true');
      const queryString = params.toString();
      const url = `./password-reset-start.html?${queryString}`;
      window.location.href = url;
    } else {
      window.location.href = './fail.html';
    }
  }
};

showPage();

/************************************************************
 * All other JavaScript
************************************************************/
import { setLoadingButton, setNotLoadingButton } from '../utils/spinner';

const form = document.getElementById('form');
const newPasswordInput1 = document.getElementById('new-password-1');
const newPasswordInput2 = document.getElementById('new-password-2');
const errorElement = document.getElementById('error-message');

let isNewPasswordError1 = false;
let isNewPasswordError2 = false;

const goLoginWithSuccess = () => {
  const params = new URLSearchParams();
  params.append('password-success', 'true');
  const queryString = params.toString();
  const url = `./login.html?${queryString}`;
  window.location.href = url;
};

const changePassword = async (event) => {
  event.preventDefault();
  clearError();
  if (!newPasswordInput1.value) {
    isNewPasswordError1 = true;
    newPasswordInput1.classList.add('border-danger');
    errorElement.innerHTML = 'Please enter your new password';
    errorElement.classList.remove('d-none');
  } else if (!newPasswordInput2.value) {
    isNewPasswordError2 = true;
    newPasswordInput2.classList.add('border-danger');
    errorElement.innerHTML = 'Please enter your new password again';
    errorElement.classList.remove('d-none');
  } else if (newPasswordInput1.value !== newPasswordInput2.value) {
    isNewPasswordError2 = true;
    newPasswordInput2.classList.add('border-danger');
    errorElement.innerHTML = 'The new password fields must be matching';
    errorElement.classList.remove('d-none');
  } else {
    const submitButton = document.getElementById('submit');
    setLoadingButton(submitButton, 'Submitting...');
    try {
        const payload = {
            ident: ident,
            password: newPasswordInput1.value
        };
        await resetPassword(payload);
        goLoginWithSuccess();
    } catch(error) {
        const errorMessage = 'response' in error ? error.response.data.error : 'Error: Could not reset your password.';
        errorElement.innerHTML = errorMessage;
        errorElement.classList.remove('d-none')
        if (errorMessage === 'Password must be between 6 and 15 characters') {
            isNewPasswordError1 = true;
            newPasswordInput1.classList.add('border-danger');
        }
        setNotLoadingButton(submitButton, 'Reset Password');
    }
  }
};

const clearErrorMessage = () => {
  errorElement.classList.add('d-none');
  errorElement.innerHTML = '';
};

const resetErrorStates = () => {
  isNewPasswordError1 = false;
  isNewPasswordError2 = false;
};

const clearError = () => {
  newPasswordInput1.classList.remove('border-danger');
  newPasswordInput2.classList.remove('border-danger');
  clearErrorMessage();
  resetErrorStates();
};

const handlePasswordInput1 = (event) => {
  const p2Div = document.getElementById('p2-div');
  p2Div.classList.remove('d-none');
  clearError(event);
};

form.addEventListener('submit', changePassword);
newPasswordInput1.addEventListener('input', handlePasswordInput1);
newPasswordInput2.addEventListener('input', clearError);