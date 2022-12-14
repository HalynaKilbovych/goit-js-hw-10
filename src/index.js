import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
const DEBOUNCE_DELAY = 300;

// name.official - повна назва країни
// capital - столиця
// population - населення
// flags.svg - посилання на зображення прапора
// languages - масив мов

/* 1. Якщо у відповіді бекенд повернув більше ніж 10 країн - Notify.failure

2.  Якщо бекенд повернув від 2-х до 10-и країн, 
        під тестовим полем відображається список знайдених країн. 
        Кожен елемент списку складається з прапора та назви країни. 

3. Якщо результат запиту - це масив з однією країною, 
    в інтерфейсі відображається розмітка картки з даними про країну: 
    прапор, назва, столиця, населення і мови. */

const refs = {
    searchField: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
  };

refs.searchField.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
    const searchQuery = e.target.value.trim();

    fetchCountries(searchQuery)
    .then(data => {
        if (data.length > 10) {
            return Notify.failure(
              'Too many matches found. Please enter a more specific name.'
            );
          }
        if (data.length > 2 && data.length < 10) {
            renderCountryList(data);
            refs.countryInfo.innerHTML = '';
          return;
        }
        if (searchQuery === "") {
            refs.countryList.innerHTML = '';
            refs.countryInfo.innerHTML = '';
          return;
        }
        if (data.length === 1) {
            refs.countryList.innerHTML = '';
            renderCountryInfo(data);
            return;
          }
      })
      .catch(error => {
        Notify.failure('Oops, there is no country with that name');
        refs.countryList.innerHTML = '';
        refs.countryInfo.innerHTML = '';
      });
} 

function makeMarkupCountryList(data) { 
    return data
    .map(
      ({ name, flags }) =>
        `<li>
          <img src="${flags.svg}" alt="flag" width="60px"/>
          <h2>${name.official}</h2>
        </li>`
    )
    .join('');
}

function makeMarkupCountryInfo(data) {
    return data
      .map(
        ({ name, capital, population, flags, languages }) =>
          `<div class="info">
            <img src="${flags.svg}" alt="flag" width="100px"/>
            <h2>${name.official}</h2>
          </div>
          <div>
            <p><b>Capital:</b> ${capital}</p>
            <p><b>Population:</b> ${population}</p>
            <p><b>Languages:</b> ${Object.values(languages)}</p>
          </div>`
      )
      .join('');
  }

function renderCountryList(data) {
    refs.countryList.innerHTML = makeMarkupCountryList(data);
  }
function renderCountryInfo(data) {
    refs.countryInfo.innerHTML = makeMarkupCountryInfo(data);
  }