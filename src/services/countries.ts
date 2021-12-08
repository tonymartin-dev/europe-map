import {  CountryData } from '../models/countries';

export const getAllCountries = async (): Promise<Record<string, CountryData>> => {
  try {
    const countriesRawData = await fetch('https://restcountries.com/v3.1/region/europe')
    const countriesData = await countriesRawData.json()
    console.log(countriesData);

    const countries = { }

    for (const countryData of countriesData) {
      countries[countryData.cca2] = {
        name: countryData.translations.spa.common,
        capital: countryData.capital[0],
        population: new Intl.NumberFormat().format(countryData.population),
        flag: countryData.flags.png,
      }
    }

    return countries
  } catch (e) {
    console.log(e);
    return {}
  }
}
