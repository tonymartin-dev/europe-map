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
) => {
  const countriesArray = Object.entries(countries).filter(
    ([, country]) => !previouslySelectedCountries.has(country.code)
  )
  const lastCountryIndex = countriesArray.length - 1
  const randomIndex = Math.floor(Math.random() * lastCountryIndex)
  return countriesArray[randomIndex][1]
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
    'guess-country-name': `Este pa??s es ${country.name}`,
    'guess-capital': `${country.capital} es la capital de ${country.name}`,
    'guess-most-populated': `La poblaci??n de ${country.capital} es de ${country.population} habitantes`,
    'find-country': `Este pa??s es ${country.name}`
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
  "Alemania": "Berl??n",
  "Andorra": "Andorra La Vieja",
  "Armenia": "Erev??n",
  "Austria": "Viena",
  "Azerbaiy??n": "Bak??",
  "B??lgica": "Bruselas",
  "Bielorrusia": "Minsk",
  "Bosnia y Herzegovina": "Sarajevo",
  "Bulgaria": "Sof??a",
  "Chipre": "Nicosia",
  "Ciudad del Vaticano": "Ciudad del Vaticano",
  "Croacia": "Zagreb",
  "Dinamarca": "Copenhague",
  "Rep??blica Eslovaca": "Bratislava",
  "Eslovenia": "Liubliana",
  "Espa??a": "Madrid",
  "Estonia": "Tall??n",
  "Finlandia": "Helsinki",
  "Francia": "Par??s",
  "Georgia": "Tiflis",
  "Grecia": "Atenas",
  "Hungr??a": "Budapest",
  "Irlanda": "Dubl??n",
  "Islandia": "Reikiavik",
  "Italia": "Roma",
  "Kazajist??n": "Nursult??n",
  "Letonia": "Riga",
  "Liechtenstein": "Vaduz",
  "Lituania": "Vilna",
  "Luxemburgo": "Luxemburgo",
  "Macedonia del Norte": "Skopie",
  "Malta": "La Valeta",
  "Moldavia": "Chisinau",
  "M??naco": "M??naco",
  "Montenegro": "Podgorica",
  "Noruega": "Oslo",
  "Pa??ses Bajos": "??msterdam",
  "Polonia": "Varsovia",
  "Portugal": "Lisboa",
  "Reino Unido": "Londres",
  "Chequia": "Praga",
  "Rumania": "Bucarest",
  "Rusia": "Mosc??",
  "San Marino": "San Marino",
  "Serbia": "Belgrado",
  "Suecia": "Estocolmo",
  "Suiza": "Berna",
  "Turqu??a": "Ankara",
  "Ucrania": "Kiev",
}
