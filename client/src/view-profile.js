// Import our custom CSS
import './scss/styles.scss';

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap';

import { onViewProfile } from './api/main';

const descriptionParagraph = document.getElementById('description');
const h1 = document.getElementById('h1');
const servicesUL = document.getElementById('services');

const showHeader = (name) => h1.innerHTML = name;

const showPhoto = (photo) => {

};

const showDescription = (description) => descriptionParagraph.innerHTML = description;

const showServices = (services) => {
    services.forEach(service => {
        let listItem = document.createElement('li');
        listItem.classList.add('list-group-item');
        listItem.innerHTML = service.country + ' | ' + service.sector + ' (' + service.year + ')';
        servicesUL.appendChild(listItem);
    });
};

const getData = async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const userID = urlParams.get('user');
    try {
        const { data } = await onViewProfile(userID);
        showHeader(data.name);
        showPhoto(data.photo);
        showDescription(data.description);
        showServices(data.services);
    } catch(error) {
        const errorMessage = error.response.data.errors[0].msg; //error from axios
        console.log(errorMessage);
    }
};

getData();