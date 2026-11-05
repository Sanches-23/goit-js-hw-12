import axios from 'axios';

const API_KEY = '58335449-1ad808a4bb40cd38f6ceeb973';
const BASE_URL = 'https://pixabay.com/api/';

export const getImagesByQuery = (query) => {
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  };
  return axios.get(BASE_URL, { params })
    .then(res => res.data);
};