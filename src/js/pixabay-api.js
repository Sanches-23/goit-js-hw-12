import axios from 'axios';

const API_KEY = '58335449-1ad808a4bb40cd38f6ceeb973';
const BASE_URL = 'https://pixabay.com/api/';
export const PER_PAGE = 15;

export const getImagesByQuery = async (query, page = 1) => {
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: PER_PAGE,
  };
  const res = await axios.get(BASE_URL, { params });
  return res.data;
};