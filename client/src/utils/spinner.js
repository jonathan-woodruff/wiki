export const setNotLoading = (spinnerElement, mainContainer, navbar) => {
    mainContainer.style.display = 'block';
    spinnerElement.style.display = 'none';
    navbar.style.display = 'block';
};

export const setLoading = (spinnerElement, mainContainer, navbar) => {
    mainContainer.style.display = 'none';
    spinnerElement.style.display = 'block';
    navbar.style.display = 'none';
};

export const setLoadingButton = (buttonElement, buttonText) => {
    buttonElement.classList.add('disabled');
    const spinnerSpan = document.createElement('span');
    spinnerSpan.classList.add('spinner-border');
    spinnerSpan.classList.add('spinner-border-sm');
    spinnerSpan.classList.add('me-1');
    spinnerSpan.role = 'status';
    spinnerSpan.ariaHidden = 'true';
    buttonElement.innerHTML = '';
    buttonElement.appendChild(spinnerSpan);
    buttonElement.innerHTML += buttonText;
  };
  
export const setNotLoadingButton = (buttonElement, buttonText) => {
    buttonElement.classList.remove('disabled');
    buttonElement.innerHTML = buttonText;
};