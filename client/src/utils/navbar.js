import { onLogout } from '../api/auth';

export const configureNav = (isAuth, registerButton, dropdown, createWikiLI, createWikiAnchor, communityLI, communityAnchor) => {
    if (isAuth) {
        registerButton.classList.add('d-none');
        dropdown.classList.remove('d-none');
        createWikiLI.setAttribute('title', '');
        createWikiAnchor.classList.remove('disabled');
        createWikiAnchor.setAttribute('tabindex', '1');
        createWikiAnchor.setAttribute('aria-disabled', 'false');
        communityLI.setAttribute('title', '');
        communityAnchor.classList.remove('disabled');
        communityAnchor.setAttribute('tabindex', '1');
        communityAnchor.setAttribute('aria-disabled', 'false');
    } else {
        registerButton.classList.remove('d-none');
        dropdown.classList.add('d-none');
        createWikiLI.setAttribute('title', 'Log in to create a wiki');
        createWikiAnchor.classList.add('disabled');
        createWikiAnchor.setAttribute('tabindex', '-1');
        createWikiAnchor.setAttribute('aria-disabled', 'true');
        communityLI.setAttribute('title', 'Log in to view');
        communityAnchor.classList.add('disabled');
        communityAnchor.setAttribute('tabindex', '-1');
        communityAnchor.setAttribute('aria-disabled', 'true');
    }
};

export const logout = async () => {
    try {
      await onLogout();
      localStorage.setItem('isAuth', 'false');
      window.location.reload();
    } catch(error) {
      const errorMessage = error.response.data.error; //error from axios
      console.log(errorMessage);
    };
};