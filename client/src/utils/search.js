export const submitSearch = (search, country, sector) => {
  const params = new URLSearchParams();
  params.append('search', search);
  params.append('country', country);
  params.append('sector', sector);
  const queryString = params.toString();
  const url = `./search-results.html?${queryString}`;
  window.location.href = url;
};