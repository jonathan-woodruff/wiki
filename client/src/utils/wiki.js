export const goToWiki = (wikiID) => {
    const params = new URLSearchParams();
    params.append('wiki', wikiID);
    const queryString = params.toString();
    const url = `./wiki.html?${queryString}`;
    window.location.href = url;
};