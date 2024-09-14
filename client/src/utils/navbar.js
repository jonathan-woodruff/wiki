import { onLogout } from '../api/auth';

export const configureNav = (isAuth, registerButton, dropdown, createWikiLI, createWikiAnchor) => {
    if (isAuth) {
        registerButton.classList.add('d-none');
        dropdown.classList.remove('d-none');
        createWikiLI.setAttribute('title', '');
        createWikiAnchor.classList.remove('disabled');
        createWikiAnchor.setAttribute('tabindex', '1');
        createWikiAnchor.setAttribute('aria-disabled', 'false');
    } else {
        registerButton.classList.remove('d-none');
        dropdown.classList.add('d-none');
        createWikiLI.setAttribute('title', 'Log in to create a wiki');
        createWikiAnchor.classList.add('disabled');
        createWikiAnchor.setAttribute('tabindex', '-1');
        createWikiAnchor.setAttribute('aria-disabled', 'true');
    }
};

//helper function for goPlaces
const getURL = (params, prevPageName) => {
  params.delete('prev', prevPageName);
  return `./${prevPageName}.html?${params.toString()}`;
};

export const goPlaces = () => {
  const currentQueryString = window.location.search;
  const params = new URLSearchParams(currentQueryString);
  const prevPageName = currentParams.get('prev');
  const pages = [
    'history', 
    'search-results', 
    'view-historical-wiki', 
    'view-profile', 
    'wiki'
  ];
  const url = pages.includes(prevPageName) ? getURL(params, prevPageName) : './index.html';
  window.location.href = url;
};

export const logout = async () => {
    try {
      await onLogout();
      window.location.href = '../index.html';
    } catch(error) {
      const errorMessage = error.response.data.error; //error from axios
      console.log(errorMessage);
    };
};