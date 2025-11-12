// Описаний у документації
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";
// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";

import { pixApi } from "./js/pixabay-api";
import { createImg } from "./js/render-function";

const formField = document.querySelector(".form");
const subButton = document.querySelector(".but-style");
const imageField = document.querySelector(".gallery");
const loader = document.querySelector(".loader-container");
const butMore = document.querySelector(".but-more");

// Модальні вікна картинок
const galleryOpen = new SimpleLightbox('.gallery a', {
    captionsData: 'alt', captionDelay: 250, captions: true,
});

// Вимикаю лоадер при загрузці сторінки
loader.style.display = 'none';

let currentPage = 1;
let inputValue = "";

const imageGallery = async (event) => {
    try {
        imageField.innerHTML = "";
        loader.style.display = 'flex';
        event.preventDefault();

        // Оновлюємо значення інпута
        inputValue = formField.elements.search.value.trim();

        // Перевірка значення інпута
        if (inputValue === "") {
            loader.style.display = 'none';
            iziToast.warning({
                title: 'Warning',
                message: 'Enter correct data.'
            });
            return;
        }

        // Очищення форми 
        formField.reset();
        currentPage = 1;

        // Запит до сервера
        const response = await pixApi(inputValue, currentPage);

        // Перевіряю чи повертаються з сервера картинки
        if (response.data.total === 0) {
            iziToast.error({
                title: 'Error',
                message: 'Sorry, there are no images matching your search query. Please try again!'
            });
            return;
        }

        // Генерую HTML
        const imageArray = response.data.hits.map(el => createImg(el));

        // Вставляю елементи в DOM
        imageField.innerHTML = imageArray.join('');
        galleryOpen.refresh();

        // Показую кнопку "Load more"
        if (response.data.totalHits > 15) {
            butMore.classList.remove("is-hidden");
            butMore.removeEventListener("click", addPicture);
            butMore.addEventListener("click", addPicture);
        }
    } catch (error) {
        console.log(error);
    } finally {
        // Ховаю кнопку "Load more"
        loader.style.display = 'none';
    }
};

async function addPicture() {
    try {
        butMore.classList.add("is-hidden");
        loader.style.display = 'flex';
        currentPage++;

        const addResponse = await pixApi(inputValue, currentPage);
        const imageArrayAdd = addResponse.data.hits.map(el => createImg(el)).join("");
        // Додаємо розмітку в кінець всіх елементів
        imageField.insertAdjacentHTML("beforeend", imageArrayAdd);
        // Отримуємо висоту однієї карточки
        const cardHeight = document.querySelector(".gallery-item").getBoundingClientRect().height;

        // Прокрутка вниз на дві висоти карточки
        window.scrollBy({
            top: cardHeight * 2,
            behavior: "smooth"
        });
        galleryOpen.refresh();

        // Перевіряємо, чи досягли останньої сторінки
        const totalPages = Math.ceil(addResponse.data.totalHits / 15);
        if (currentPage >= totalPages) {
            iziToast.error({
                title: 'Error',
                message: "We're sorry, but you've reached the end of search results."
            });
            butMore.classList.add("is-hidden");
            butMore.removeEventListener("click", addPicture);
            return;
        }
        butMore.classList.remove("is-hidden");
    } catch (error) {
        console.log(error);
    } finally {
        loader.style.display = 'none';

    }
}

formField.addEventListener("submit", imageGallery);
