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