export const setNotLoading = (spinnerElement, mainContainer) => {
    spinnerElement.classList.add('d-none');
    mainContainer.classList.remove('d-none');
};

export const setLoading = (spinnerElement, mainContainer) => {
    spinnerElement.classList.remove('d-none');
    mainContainer.classList.add('d-none');
};