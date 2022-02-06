import { CountryData, CountryDataList, RawCountryData } from '../models/countries';

// ToDo: make it editable by setting difficulty level
export const DEFAULT_COUNTRIES_OPTIONS = 3

// Countries not found in SVG map
const EXCLUDED_COUNTRIES = ['AX', 'SJ', 'GI']

export const getAllCountries = async (): Promise<CountryDataList> => {
  try {
    const countriesRawData = await fetch('https://restcountries.com/v3.1/region/europe')
    const countriesData: RawCountryData[] = await countriesRawData.json()
    console.log('RAW', countriesData)

    const countries: CountryDataList = { }

    for (const countryData of countriesData) {
      if (EXCLUDED_COUNTRIES.some(excludedCountry => excludedCountry === countryData.cca2)) {
        continue
      }
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

export const getRandomCountry = (countries: CountryDataList, mustBeVisible?: true) => {
  const countriesArray = Object.entries(countries)
  const lastCountryIndex = countriesArray.length - 1
  const randomIndex = Math.floor(Math.random() * lastCountryIndex)
  const randomCountry = countriesArray[randomIndex]
  if(!mustBeVisible){
    return randomCountry
  }
  // ToDo: Not in use because this isn't working since is executed before the render so it can't find the svg.
  const countriesPaths = [...(document.querySelectorAll('.country') as any).values()]
  const countriesElementsWithWidth = countriesPaths?.map(e => ({
      code: e.id.split('-')[0].toUpperCase(),
      width: e.getBoundingClientRect().width}
    ))
  console.log({countriesElementsWithWidth});
}

export const getRandomCountries = (
  allCountries: CountryDataList,
  numberOfCountries = DEFAULT_COUNTRIES_OPTIONS
) => {
  const randomCountries: CountryData[] = []

  while (randomCountries.length < numberOfCountries) {
    const [, countryData] = getRandomCountry(allCountries)
    if(!randomCountries.some(c => c.code === countryData.code )) {
      randomCountries.push(countryData);
    }
  }

  console.log({randomCountries});

  return [...randomCountries].sort((a,b) => a.code > b.code ? -1 : 1)
}

export const getHigherPopulationCountry = (countriesOptions: CountryData[]) => {
  const higherPopulation = Math.max(...countriesOptions.map(
    option => getIntFromString(option.population)
  ))
  return countriesOptions.find(
    option => getIntFromString(option.population) === higherPopulation
  )
}

const getIntFromString = (string: string) =>
  Number.parseInt(string.replace(/\./g,''))
