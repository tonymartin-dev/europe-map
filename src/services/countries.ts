import { CountryData, CountryDataList, RawCountryData } from '../models/countries';

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

export const getRandomFlags = (
  countries: CountryDataList,
  selectedCountry: [string, CountryData],
  numberOfFlags = 3
) => {
  delete countries[selectedCountry[0]]
  const flags = [{country: selectedCountry[0], flag: selectedCountry[1].flag}]

  while (flags.length < numberOfFlags) {
    const [country, { flag }] = getRandomCountry(countries)
    flags.push({country, flag})
  }

  return flags.sort(
    (a, b) =>  a.country < b.country ? -1 : 1
  )
}

export const getRandomCountries = (
  allCountries: CountryDataList,
  selectedCountry: [string, CountryData],
  numberOfFlags = 3
) => {
  delete allCountries[selectedCountry[0]]
  const randomCountries = [selectedCountry[1]]

  while (randomCountries.length < numberOfFlags) {
    const [_countryCode, countryData] = getRandomCountry(allCountries)
    randomCountries.push(countryData)
  }

  return randomCountries
}
