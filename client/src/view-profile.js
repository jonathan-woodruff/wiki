//Import Bootstrap CSS
import './scss/styles.scss';
//Import Bootstrap JS
import * as bootstrap from 'bootstrap';

//Display the html
import { setNotLoading } from './utils/spinner';
const spinnerDiv = document.getElementById('spinner');
const mainContainer = document.getElementById('main-container');
const navbar = document.getElementById('navbar');
setNotLoading(spinnerDiv, mainContainer, navbar);

import { onViewProfile } from './api/main';
import PeaceChicken from './images/peace_chicken.jpg';
import Logo from './images/logo.png';

const descriptionParagraph = document.getElementById('description');
const h1 = document.getElementById('h1');
const servicesUL = document.getElementById('services');
const wikisCreatedLI = document.getElementById('wikis-created');
const wikiEditsLI = document.getElementById('wiki-edits');
const serviceSection = document.getElementById('service-section');
const descriptionSection = document.getElementById('description-section');
const logoImg = document.getElementById('logo-img');
const picturePreview = document.getElementById('pic-preview');

logoImg.src = Logo;
picturePreview.src = PeaceChicken;

const showHeader = (name) => h1.innerHTML = name;

const showPhoto = (photo) => {

};

const showDescription = (description) => {
    if (description) {
        descriptionParagraph.innerHTML = description;
    } else {
        descriptionSection.classList.add('d-none');
    }
};

const showServices = (services) => {
    if (services.length) {
        services.forEach(service => {
            let listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            listItem.innerHTML = service.country + ' | ' + service.sector + ' (' + service.year + ')';
            servicesUL.appendChild(listItem);
        });
    } else {
        serviceSection.classList.add('d-none');
    }
};

const showActivity = (numWikisCreated, numWikiEdits) => {
    wikisCreatedLI.innerHTML = '# wikis created: ' + numWikisCreated;
    wikiEditsLI.innerHTML = '# wiki edits: ' + numWikiEdits; 
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
        showActivity(data.wikisCreated, data.wikiEdits);
    } catch(error) {
        const errorMessage = error.response.data.errors[0].msg; //error from axios
        console.log(errorMessage);
    }
};

getData();