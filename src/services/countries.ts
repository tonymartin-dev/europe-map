import { CountryDataList, RawCountryData } from '../models/countries';

export const getAllCountries = async (): Promise<CountryDataList> => {
  try {
    const countriesRawData = await fetch('https://restcountries.com/v3.1/region/europe')
    const countriesData: RawCountryData[] = await countriesRawData.json()

    const countries: CountryDataList = { }

    for (const countryData of countriesData) {
      countries[countryData.cca2] = {
        name: countryData.translations.spa.common,
        capital: countryData.capital[0],
        population: new Intl.NumberFormat().format(countryData.population),
        area: new Intl.NumberFormat().format(countryData.area),
        flag: countryData.flags.png,
      }
    }

    return countries
  } catch (e) {
    console.log('[ERROR GETTING COUNTRIES DATA]', e);
    return {}
  }
}
