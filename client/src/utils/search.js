const countryInput = document.getElementById('country');
const sectorInput = document.getElementById('sector');
const searchEngine = document.getElementById('search-engine');
const searchDiv = document.getElementById('search-div');
const errorDiv = document.getElementById('error-div');

export const handleMostRecent = () => {
  const params = new URLSearchParams();
  params.append('search', '');
  params.append('country', 'All');
  params.append('sector', 'All');
  params.append('most-recent', true);
  const queryString = params.toString();
  const url = `./search-results.html?${queryString}`;
  window.location.href = url;
};

export const submitSearch = () => {
  if (searchEngine.value) {
    const params = new URLSearchParams();
    const searchPattern = searchEngine.value;
    const selectedCountry = countryInput.value;
    const selectedSector = sectorInput.value;
    params.append('search', searchPattern);
    params.append('country', selectedCountry);
    params.append('sector', selectedSector);
    params.append('most-recent', false);
    const queryString = params.toString();
    const url = `./search-results.html?${queryString}`;
    window.location.href = url;
  } else {
    errorDiv.classList.remove('d-none');
    searchDiv.classList.replace('border-dark', 'border-danger');
  }
};

export const enterSubmit = (event) => {
  if (event.key === 'Enter') submitSearch();
};

export const focusOnInput = () => {
  searchEngine.focus();
};

export const showFocus = () => {
  searchDiv.classList.replace('border-1', 'border-2');
};

export const showFocusOut = () => {
  searchDiv.classList.replace('border-2', 'border-1');
};

export const hideError = () => {
  errorDiv.classList.add('d-none');
  searchDiv.classList.replace('border-danger', 'border-dark');
};