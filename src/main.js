import iziToast from 'izitoast';
const icons = `${import.meta.env.BASE_URL}icons.svg`;

import { getImagesByQuery } from './js/pixabay-api.js';
import { clearGallery, createGallery, hideLoader, showLoader } from './js/render-functions.js';

const queryForm = document.querySelector('.form');
queryForm.addEventListener('submit', (e) => {
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
    clearGallery();
    showLoader();
    getImagesByQuery(query)
      .then(({ hits }) => {
        if (hits.length === 0) {
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
        createGallery(hits);
      })
      .catch(error => {
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

      })
      .finally(() => {
        hideLoader();
      });
    e.target.reset();
  },
);