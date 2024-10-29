import PeaceChicken from '../images/peace_chicken.jpg';

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

//clear avatar from the DOM
const clearAvatar = (holder, id) => {
  const currentAvatar = document.getElementById(id);
  if (currentAvatar) holder.removeChild(currentAvatar);
};

//add avatar to the DOM
export const showAvatar = (avatarURL, holder, id, width) => {
  const newAvatar = document.createElement('img');
  newAvatar.id = id;
  newAvatar.src = avatarURL || PeaceChicken;
  newAvatar.classList.add('rounded-circle');
  newAvatar.style.width = width;
  newAvatar.style.maxHeight = width;
  newAvatar.style.height = 'auto';
  holder.appendChild(newAvatar);
};

export const refreshAvatar = (avatarURL, holder, id, width) => {
  clearAvatar(holder, id);
  showAvatar(avatarURL, holder, id, width);
};