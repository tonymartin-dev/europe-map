export interface RawCountryData {
  name: {
    common: string
    official: string
    nativeName: {
      dan: {
        official: string
        common: string
      }
    }
  },
  tld: string[]
  cca2: string
  ccn3: string
  cca3: string
  cioc: string
  independent: boolean
  status: string
  unMember: boolean
  currencies: {
    DKK: {
      name: string
      symbol: string
    }
  }
  idd: {
    root: string
    suffixes: string[]
  }
  capital: string[]
  altSpellings: string[]
  region: string
  subregion: string
  languages: {
    dan: string
  }
  translations: Record<string, {
    official: string
    common: string
  }>
  latlng: [number, number]
  landlocked: false
  borders: string[]
  area: number
  demonyms: {
    eng: {
      f: string
      m: string
    }
    fra: {
      f: string
      m: string
    }
  }
  flag: string
  maps: {
    googleMaps: string
    openStreetMaps: string
  }
  population: number
  gini: Record<string, number>
  fifa: string
  car: {
    signs:string[]
    side: string
  }
  timezones: string[]
  continents: string[]
  flags: {
    png: string
    svg: string
  }
  coatOfArms: {
    png: string
    svg: string
  }
  startOfWeek: string
  capitalInfo: {
    latlng: [number, number]
  }
  postalCode: {
    format: string
    regex: string
  }
}

export interface CountryData {
  name: string
  capital: string
  population: string
  flag: string
  area: string
}

export type CountryDataList = Record<string, CountryData>
