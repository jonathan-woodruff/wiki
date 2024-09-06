// Import our custom CSS
import './scss/styles.scss';

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap';

import { getProfileData } from './api/main';

const getData = async () => {
    try {
        const { data } = await getProfileData();
    } catch(error) {
        const errorMessage = error.response.data.errors[0].msg; //error from axios
        console.log(errorMessage);
    }
};

getData();