import { createPaymentIntent } from '../api/main';
import { STRIPE_KEY, CLIENT_URL } from '../constants/index';
import { loadStripe } from '@stripe/stripe-js';
import BeerCheers from '../images/beer-cheers.png';

/************************************************************ 
 * Import Bootstrap CSS and JavaScript 
************************************************************/
import '../scss/styles.scss'; //css
import * as bootstrap from 'bootstrap'; //js

const stripe = await loadStripe(STRIPE_KEY);

// The items the customer wants to buy
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const amount = Number(urlParams.get('amount'));
const items = [{ id: "beer", amount: amount }];

let elements;

initialize();

document.getElementById('payment-form').addEventListener("submit", handleSubmit);

const showPage = () => {
  const spinnerDiv = document.getElementById('spinner');
  const mainContainer = document.getElementById('main-container');
  const footer = document.getElementById('footer');
  footer.style.display = 'block';
  mainContainer.style.display = 'block';
  spinnerDiv.style.display = 'none';
};

// Fetches a payment intent and captures the client secret
async function initialize() {
  //ensure the amount is valid
  if (!(typeof(amount) === 'number' && amount >= 100 && Number.isInteger(amount))) {
    window.location.href = './buy-me-a-beer.html';
  } else {
    const { data } = await createPaymentIntent(items);
    const clientSecret = data.clientSecret;
    const dpmCheckerLink = data.dpmCheckerLink;

    const appearance = {
      theme: 'stripe',
    };
    elements = stripe.elements({ appearance, clientSecret });

    const paymentElementOptions = {
      layout: "tabs",
    };

    const paymentElement = elements.create("payment", paymentElementOptions);
    paymentElement.mount("#payment-element");

    //assign image source
    document.getElementById('beer-cheers').src = BeerCheers

    //show the total amount the user is paying
    document.getElementById('total').innerHTML += `$${(amount / 100).toFixed(2)}`;

    showPage();
  }
}

const messageContainer = document.querySelector("#payment-message");
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
let isNameError = false;
let isEmailError = false;

async function handleSubmit(e) {
  e.preventDefault();
  clearErrors();

  if (nameInput.value && emailInput.value) {
    setLoading(true);

    const params = new URLSearchParams();
    params.append('name', nameInput.value);
    params.append('email', emailInput.value);
    params.append('amount', amount)
    const returnURL = `${CLIENT_URL}/beer-complete.html?${params.toString()}`;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: returnURL,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      showMessage(error.message);
    } else {
      showMessage("An unexpected error occurred.");
    }

    setLoading(false);
  } else if (!nameInput.value) {
    isNameError = true;
    nameInput.classList.add('border-danger');
    showMessage('Please enter your name');
  } else if (!emailInput.value) {
    isEmailError = true;
    emailInput.classList.add('border-danger');
    showMessage('Please enter an email address');
  }
}

const clearErrors = () => {
  isNameError = false;
  isEmailError = false;
  nameInput.classList.remove('border-danger');
  emailInput.classList.remove('border-danger');
  messageContainer.classList.add('hidden');
  messageContainer.textContent = '';
};

// ------- UI helpers -------

function showMessage(messageText) {
  messageContainer.classList.remove("hidden");
  messageContainer.textContent = messageText;

  setTimeout(function () {
    messageContainer.classList.add("hidden");
    messageContainer.textContent = "";
  }, 4000);
}

// Show a spinner on payment submission
function setLoading(isLoading) {
  if (isLoading) {
    // Disable the button and show a spinner
    document.querySelector("#submit").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("#submit").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
}

/************************************************************
 * All other JavaScript
************************************************************/
const resetErrorStates = () => {
  isNameError = false;
  isEmailError = false;
};

const clearError = (event) => {
  const inputField = event.currentTarget;
  if ((inputField.id === 'name' && isNameError) || (inputField.id === 'email' && isEmailError)) {
    inputField.classList.remove('border-danger');
    resetErrorStates();
  }
};

nameInput.addEventListener('input', clearError);
emailInput.addEventListener('input', clearError);