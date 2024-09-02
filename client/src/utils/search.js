const countryInput = document.getElementById('country');
const sectorInput = document.getElementById('sector');
const searchEngine = document.getElementById('search-engine');
const searchDiv = document.getElementById('search-div');

export const submitSearch = () => {
    const params = new URLSearchParams();
    const searchPattern = searchEngine.value;
    const selectedCountry = countryInput.value;
    const selectedSector = sectorInput.value;
    params.append('search', searchPattern);
    params.append('country', selectedCountry);
    params.append('sector', selectedSector);
    const queryString = params.toString();
    const url = `./search-results.html?${queryString}`;
    window.location.href = url;
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