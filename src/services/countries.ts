import { CountryData, CountryDataList, RawCountryData } from '../models/countries';

// ToDo: make it editable by setting difficulty level
const DEFAULT_COUNTRIES_OPTIONS = 3

export const getAllCountries = async (): Promise<CountryDataList> => {
  try {
    const countriesRawData = await fetch('https://restcountries.com/v3.1/region/europe')
    const countriesData: RawCountryData[] = await countriesRawData.json()
    console.log('RAW', countriesData)

    const countries: CountryDataList = { }

    for (const countryData of countriesData) {
      countries[countryData.cca2] = {
        name: countryData.translations.spa.common,
        capital: countryData.capital[0],
        population: new Intl.NumberFormat().format(countryData.population),
        area: new Intl.NumberFormat().format(countryData.area),
        flag: countryData.flags.png,
        code: countryData.cca2
      }
    }

    return countries
  } catch (e) {
    console.log('[ERROR GETTING COUNTRIES DATA]', e);
    return {}
  }
}

export const getRandomCountry = (countries: CountryDataList) => {
  const countriesArray = Object.entries(countries)
  const lastCountryIndex = countriesArray.length - 1
  const randomIndex = Math.floor(Math.random() * lastCountryIndex)
  return countriesArray[randomIndex]
}

export const getRandomCountries = (
  allCountries: CountryDataList,
  selectedCountry: [string, CountryData],
  numberOfCountries = DEFAULT_COUNTRIES_OPTIONS
) => {
  if(!selectedCountry){
    return
  }
  delete allCountries[selectedCountry[0]]
  const randomCountries = [selectedCountry[1]]

  while (randomCountries.length < numberOfCountries) {
    const [, countryData] = getRandomCountry(allCountries)
    randomCountries.push(countryData)
  }

  console.log({randomCountries});

  return [...randomCountries].sort((a,b) => a.code > b.code ? -1 : 1)
}
