/* This file sends requests to the server using axios for token-based requests */
import { SERVER_URL } from '../constants/index';
import axios from 'axios';
axios.defaults.withCredentials = true; //send the cookie back to the server with token

export async function onPostWiki(wikiContent) {
    return await axios.post(`${SERVER_URL}/main/postWiki`, wikiContent);
};

export async function getWikis(selectedCountry, selectedSector) {
    return await axios.get(`${SERVER_URL}/main/getWikis?country=${selectedCountry}&sector=${selectedSector}`);
};

export async function getProfileData() {
    return await axios.get(`${SERVER_URL}/main/getProfileData`);
};

export async function putProfile(profileData) {
    return await axios.put(`${SERVER_URL}/main/updateProfile`, profileData);
};

export async function postAvatar(payload) {
    return await axios.post(`${SERVER_URL}/main/postAvatar`, payload);
};

export async function getCreateWikiData() {
    return await axios.get(`${SERVER_URL}/main/getCreateWikiData`);
};

export async function onViewWiki(wikiID) {
    return await axios.get(`${SERVER_URL}/main/getWikiByID?wiki=${wikiID}`);
};

export async function onPutWiki(payload) {
    return await axios.put(`${SERVER_URL}/main/putWiki`, payload);
};

export async function onViewHistory(wikiID) {
    return await axios.get(`${SERVER_URL}/main/viewHistory?wiki=${wikiID}`);
};

export async function onViewProfile(userID) {
    return await axios.get(`${SERVER_URL}/main/viewProfile?user=${userID}`);
};

export async function onViewHistoricalWiki(wikiHistoryID) {
    return await axios.get(`${SERVER_URL}/main/viewHistoricalWiki?wikiHistoryID=${wikiHistoryID}`);
};

export async function postCommunity(payload) {
    return await axios.post(`${SERVER_URL}/main/postCommunity`, payload);
};

export async function createPaymentIntent(payload) {
    return await axios.post(`${SERVER_URL}/main/createPaymentIntent`, payload);
};