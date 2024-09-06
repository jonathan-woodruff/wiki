// Import our custom CSS
import './scss/styles.scss';

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap';

import { onViewHistory } from './api/main';
import { convertTimestamp } from './utils/time';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const wikiID = urlParams.get('wiki');

const title = document.getElementById('title');
const countryAndSector = document.getElementById('country-sector');
const cardDiv = document.getElementById('card-div');

const displayWikiHeader = (wiki) => {
    title.innerHTML = wiki.title;
    countryAndSector.innerHTML = 'Country: ' + wiki.country + '\xa0\xa0\xa0' + 'Sector: ' + wiki.sector;
};

const showCards = (wikiHistory) => {
    let editionNum = wikiHistory.length;
    wikiHistory.forEach(edition => {
        const card = document.createElement('div');
        card.id = edition._id;
        card.role = 'button';
        card.classList.add('card');
        card.classList.add('mb-3');
        card.classList.add('shadow-sm');
        card.addEventListener('mouseover', handleMouseover);
        card.addEventListener('mouseout', handleMouseout);
        card.addEventListener('click', handleClick);
        cardDiv.appendChild(card);

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        card.appendChild(cardBody);

        const h2 = document.createElement('h2');
        h2.classList.add('card-title');
        h2.classList.add('h4');
        h2.innerHTML = 'Edition ' + editionNum;
        cardBody.appendChild(h2);

        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.innerHTML = edition.changeDescription;
        cardBody.appendChild(cardText);

        const dateAndAuthor = document.createElement('p');
        dateAndAuthor.style.fontSize = '0.9em';
        dateAndAuthor.innerHTML = 'Edited ' + convertTimestamp(edition.contentTime) + ' by ';
        cardBody.appendChild(dateAndAuthor);

        const authorLink = document.createElement('a');
        const params = new URLSearchParams();
        const userID = edition.authorUserId;
        params.append('user', userID);
        const queryString = params.toString();
        authorLink.href = `./view-profile.html?${queryString}`;
        authorLink.alt = 'Link to user profile';
        authorLink.innerHTML = edition.user[0].name;
        dateAndAuthor.appendChild(authorLink);

        editionNum--;
    });
};

const handleMouseover = (event) => {
    const card = event.currentTarget;
    card.classList.add('bg-light');
  };
  
  const handleMouseout = (event) => {
    const card = event.currentTarget;
    card.classList.remove('bg-light');
  };
  
  const handleClick = (event) => {
    const card = event.currentTarget;
    const wikiHistoryID = card.id;
    const params = new URLSearchParams();
    params.append('edition', wikiHistoryID);
    params.append('editionHeader', event.currentTarget.children[0].children[0].innerHTML);
    const queryString = params.toString();
    const url = `./view-historical-wiki.html?${queryString}`;
    window.location.href = url;
  };

const loadPage = async () => {
    try {
        const { data } = await onViewHistory(wikiID);
        displayWikiHeader(data.wiki);
        showCards(data.wikiHistory);
    } catch(error) {
        const errorMessage = error.response.data.error; //error from axios
        console.log(errorMessage);
    }
};

loadPage();