import iziToast from 'izitoast';

const icons = `${import.meta.env.BASE_URL}icons.svg`;

import { getImagesByQuery, PER_PAGE } from './js/pixabay-api.js';
import {
  clearGallery,
  createGallery,
  hideLoader,
  hideLoadMoreButton,
  refs,
  showLoader, showLoadMoreButton,
} from './js/render-functions.js';

let currentQuery = '';
let currentPage = 1;

refs.queryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get('search-text').trim();
    if (!query) {
      iziToast.show({
        message: `
              <div style="display: flex; align-items: center; gap: 12px;">
                <svg width="24" height="24" fill="#FFFFFF" style="flex-shrink: 0;">
                  <use href="${icons}#error-ic"></use>
                </svg>
                <span>Please enter a search query!</span>
              </div>
        `,
        position: 'topRight',
        backgroundColor: '#ef4040',
        messageColor: '#fafafb',
        progressBarColor: '#B51B1B',
        maxWidth: '432px',
        iconColor: '#fafafb',
        timeout: 5000,
      });
      return;
    }
    currentQuery = query;
    currentPage = 1;
    clearGallery();
    hideLoadMoreButton();
    showLoader();
    try {
      const data = await getImagesByQuery(query);

      if (data.hits.length === 0) {
        iziToast.show({
          message: `
          <div style="display: flex; align-items: center; gap: 12px;">
            <svg width="24" height="24" fill="#FFFFFF" style="flex-shrink: 0;">
              <use href="${icons}#error-ic"></use>
            </svg>
            <span>Sorry, there are no images matching your search query. Please try again!</span>
          </div>
        `,
          position: 'topRight',
          backgroundColor: '#ef4040',
          messageColor: '#fafafb',
          progressBarColor: '#B51B1B',
          maxWidth: '432px',
          timeout: 5000,
        });
        return;
      }
      createGallery(data.hits);
      if (data.totalHits > PER_PAGE) {
        showLoadMoreButton();
      } else {
        hideLoadMoreButton();
        iziToast.info({
          message: 'We\'re sorry, but you\'ve reached the end of search results.',
          position: 'topRight',
          timeout: 5000,
        });
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      iziToast.error({
        message: `
              <div style="display: flex; align-items: center; gap: 12px;">
                <svg width="24" height="24" fill="#FFFFFF" style="flex-shrink: 0;">
                  <use href="${icons}#error-ic"></use>
                </svg>
                <span>Failed to fetch images. Please try again later!</span>
              </div>
            `,
        position: 'topRight',
        backgroundColor: '#ef4040',
        messageColor: '#fafafb',
        progressBarColor: '#B51B1B',
        maxWidth: '432px',
        timeout: 5000,
      });
    } finally {
      hideLoader();
      e.target.reset();
    }
  },
);

refs.loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;
  hideLoadMoreButton();
  showLoader();
  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    createGallery(data.hits);

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    const loadedItemsCount = document.querySelectorAll('.gallery-item').length;
    if (loadedItemsCount >= data.totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        message: 'We\'re sorry, but you\'ve reached the end of search results.',
        position: 'topRight',
        timeout: 5000,
      });
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    console.error('Error fetching more images:', error);
    iziToast.show({
      message: `
      <div style="display: flex; align-items: center; gap: 12px;">
        <svg width="24" height="24" fill="#FFFFFF" style="flex-shrink: 0;">
          <use href="${icons}#error-ic"></use>
        </svg>
        <span>Failed to fetch more images.</span>
      </div>
    `,
      position: 'topRight',
      backgroundColor: '#ef4040',
      messageColor: '#fafafb',
      progressBarColor: '#B51B1B',
      maxWidth: '432px',
      iconColor: '#fafafb',
      timeout: 5000,
    });
  } finally {
    hideLoader();
  }
});