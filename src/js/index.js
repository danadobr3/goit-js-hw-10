import { fetchBreeds, fetchCatByBreed } from "./cat-api";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SlimSelect from 'slim-select'
import 'slim-select/dist/slimselect.css';

const ref = {
    selector: document.querySelector('.breed-select'),
    divCatInformation: document.querySelector('.cat-info'),
    loader: document.querySelector('.loader'),
    error: document.querySelector('.error'),
};

const { selector, divCatInformation, loader, error } = ref;


loader.classList.add('is-hidden');
divCatInformation.classList.remove('is-hidden');


let arrBreedsId = [];
fetchBreeds()
    .then(data => {
        data.forEach(element => {
            arrBreedsId.push({ text: element.name, value: element.id });
        });
        new SlimSelect({
            select: selector,
            data: arrBreedsId,
            placeholder: '',
            search: false,
        });
    })
    .catch(onFetchError);
selector.addEventListener('change', onSelectBreed);

function onSelectBreed(event) {
    const selectedValue = event.currentTarget.value;

    if (!selectedValue) {
        return;
    }
    
    loader.classList.replace('is-hidden', 'loader');
    selector.classList.add('is-hidden');
    divCatInformation.classList.add('is-hidden');

    const breedId = selectedValue;
    fetchCatByBreed(breedId)
    .then(data => {
        loader.classList.replace('loader', 'is-hidden');
        selector.classList.remove('is-hidden');
        const { url, breeds } = data[0];
        
        divCatInformation.innerHTML = `<div class="box-img"><img src="${url}" alt="${breeds[0].name}" width="400"/></div><div class="box"><h1>${breeds[0].name}</h1><p>${breeds[0].description}</p><p><b>Temperament:</b> ${breeds[0].temperament}</p></div>`
        divCatInformation.classList.remove('is-hidden');
    })
    .catch(onFetchError);
};

function onFetchError(error) {
    selector.classList.remove('is-hidden');
    loader.classList.replace('loader', 'is-hidden');
    divCatInformation.classList.add('is-hidden');
    error.classList.remove('is-hidden');
    

    Notify.failure('Oops! Something went wrong! Try reloading the page or select another cat breed!', {
        position: 'center-center',
        timeout: 5000,
        width: '400px',
        fontSize: '24px'
    });
};
