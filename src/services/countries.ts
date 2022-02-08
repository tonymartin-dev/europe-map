import { CountryData, CountryDataList, RawCountryData } from '../models/countries';
import { state } from '../store/store';
import { GameType } from '../models/routes';

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
        capital: translateCapital(countryData.translations.spa.common, countryData.capital[0]),
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

export const getRandomCountry = (
  countries: CountryDataList,
  previouslySelectedCountries: Set<string> = new Set(),
  mustBeVisible?: true
) => {
  const countriesArray = Object.entries(countries).filter(
    ([, country]) => !previouslySelectedCountries.has(country.code)
  )
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
  numberOfCountries = DEFAULT_COUNTRIES_OPTIONS,
  previouslySelectedCountries: Set<string> = new Set(),
) => {
  const randomCountries: CountryData[] = []

  while (randomCountries.length < numberOfCountries) {
    const [, countryData] = getRandomCountry(allCountries, previouslySelectedCountries)
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

const getCountryData = (countryCode: string) => {
  return Object.values(state.countriesData).find(({code}) => countryCode === code)
}

export const getAlertExtraMessage = (gameType: GameType, selectedCountryCode: string) => {
  const country = getCountryData(selectedCountryCode)
  if(!country){
    return ``
  }

  const messages: Record<GameType, string> = {
    'find-flag': `Esta bandera es de ${country.name}`,
    'guess-country-name': `Este país es ${country.name}`,
    'guess-capital': `${country.capital} es la capital de ${country.name}`,
    'guess-most-populated': `La población de ${country.capital} es de ${country.population} habitantes`,
    'find-country': `Este país es ${country.name}`
  }

  return messages[gameType]
}

const translateCapital = (name?: string, capital?: string) => {
  if(!name || !capital) {
    return
  }

  const capitalData = Object.entries(capitalsInSpanish).find(([countryName]) => countryName === name)
  const capitalInSpanish = capitalData?.[1]

  if(capitalInSpanish) {
    // console.log(`CAPITAL TRADUCIDA: ${capital} => ${capitalInSpanish}`);
  } else {
    console.log(`CAPITAL SIN TRADUCIR: ${capital} (${name})`);
  }

  return capitalInSpanish ?? capital
}

const capitalsInSpanish = {
  "Albania": "Tirana",
  "Alemania": "Berlín",
  "Andorra": "Andorra La Vieja",
  "Armenia": "Ereván",
  "Austria": "Viena",
  "Azerbaiyán": "Bakú",
  "Bélgica": "Bruselas",
  "Bielorrusia": "Minsk",
  "Bosnia y Herzegovina": "Sarajevo",
  "Bulgaria": "Sofía",
  "Chipre": "Nicosia",
  "Ciudad del Vaticano": "Ciudad del Vaticano",
  "Croacia": "Zagreb",
  "Dinamarca": "Copenhague",
  "República Eslovaca": "Bratislava",
  "Eslovenia": "Liubliana",
  "España": "Madrid",
  "Estonia": "Tallín",
  "Finlandia": "Helsinki",
  "Francia": "París",
  "Georgia": "Tiflis",
  "Grecia": "Atenas",
  "Hungría": "Budapest",
  "Irlanda": "Dublín",
  "Islandia": "Reikiavik",
  "Italia": "Roma",
  "Kazajistán": "Nursultán",
  "Letonia": "Riga",
  "Liechtenstein": "Vaduz",
  "Lituania": "Vilna",
  "Luxemburgo": "Luxemburgo",
  "Macedonia del Norte": "Skopie",
  "Malta": "La Valeta",
  "Moldavia": "Chisinau",
  "Mónaco": "Mónaco",
  "Montenegro": "Podgorica",
  "Noruega": "Oslo",
  "Países Bajos": "Ámsterdam",
  "Polonia": "Varsovia",
  "Portugal": "Lisboa",
  "Reino Unido": "Londres",
  "Chequia": "Praga",
  "Rumania": "Bucarest",
  "Rusia": "Moscú",
  "San Marino": "San Marino",
  "Serbia": "Belgrado",
  "Suecia": "Estocolmo",
  "Suiza": "Berna",
  "Turquía": "Ankara",
  "Ucrania": "Kiev",
}
