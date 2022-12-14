export function fetchCountries(country) {
  const endPoint = 'https://restcountries.com/v3.1/name';

  return fetch(
    `${endPoint}/${country}?fields=name,capital,population,flags,languages`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
