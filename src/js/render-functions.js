import SimpleLightbox from 'simplelightbox';

const refs = {
  galleryList: document.querySelector('.gallery'),
  loaderElement: document.querySelector('.loader'),
};

const lightbox = new SimpleLightbox('.gallery-link', {
  captionsData: 'alt',
  captionDelay: 250,
});

function imageTemplate(item) {
  return `
<li class="gallery-item">
      <a class="gallery-link" href="${item.largeImageURL}">
        <img class="gallery-image" src="${item.webformatURL}" alt="${item.tags}" />
      </a>
      <div class="info">
        <p class="info-item"><span class="info-value">Likes</span>${item.likes}</p>
        <p class="info-item"><span class="info-value">Views</span>${item.views}</p>
        <p class="info-item"><span class="info-value">Comments</span>${item.comments}</p>
        <p class="info-item"><span class="info-value">Downloads</span>${item.downloads}</p>
      </div>
    </li>
  `;
}

function imagesTemplate(items) {
  return items.map(imageTemplate).join('');
}

export function createGallery(images) {
  refs.galleryList.innerHTML = imagesTemplate(images);
  lightbox.refresh();
}

export function clearGallery() {
  refs.galleryList.innerHTML = '';
}

export function showLoader() {
  refs.loaderElement.classList.remove('is-hidden');
}

export function hideLoader() {
  refs.loaderElement.classList.add('is-hidden');
}