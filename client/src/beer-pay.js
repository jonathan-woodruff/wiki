import { createPaymentIntent } from './api/main';
import { STRIPE_KEY } from './constants/index';
import { loadStripe } from '@stripe/stripe-js';
import BeerCheers from './images/beer-cheers.png';

/************************************************************ 
 * Import Bootstrap CSS and JavaScript 
************************************************************/
import './scss/styles.scss'; //css
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

// Fetches a payment intent and captures the client secret
async function initialize() {
  //ensure the amount is valid
  if (!(typeof(amount) === 'number' && amount >= 100 && Number.isInteger(amount))) window.location.href = './buy-me-a-beer.html';

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
}

async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);

  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      // Make sure to change this to your payment completion page
      return_url: "http://localhost:8080/beer-complete.html",
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
}

// ------- UI helpers -------

function showMessage(messageText) {
  const messageContainer = document.querySelector("#payment-message");

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
 * Show the page to the user
************************************************************/
const showPage = () => {
  const spinnerDiv = document.getElementById('spinner');
  const mainContainer = document.getElementById('main-container');
  mainContainer.style.display = 'block';
  spinnerDiv.style.display = 'none';
};

showPage();