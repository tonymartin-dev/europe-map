import { Component, ComponentInterface, h, Host, JSX, State, Watch } from '@stencil/core';
import { state, onStoreChange } from '../../store/store';
import { CountryData, CountryDataList } from '../../models/countries';

@Component({
  tag: 'app-flags',
  styleUrl: 'app-flags.pcss',
  scoped: true,
})
export class AppFlags implements ComponentInterface {
  @State() country?: [string, CountryData]
  @State() countriesData?: CountryDataList

  @Watch('countriesData') private watchCountries() {
    console.log('watchCountries');
    if(!this.countriesData){
      return
    }
    this.country = getRandomCountry(this.countriesData)
    console.log('Country', this.country)
  }

  componentWillLoad(): Promise<void> | void {
    onStoreChange('countriesData', value => {
      console.log('change');
      this.countriesData = value
      this.watchCountries()
    })

    this.countriesData = state.countriesData
    this.watchCountries()
  }

  render(): JSX.Element {
    if(!this.country) {
      return ''
    }

    const countryCode = this.country?.[0]
    const countryData = this.country?.[1]

    const flags = getRandomFlags(this.countriesData, this.country)

    console.log('render', { flags, countriesData: this.countriesData, country: this.country });
    return (
      <Host>
        <div class="main-content">
          <h1>Encuentra la bandera de este país</h1>

          <div class="data-container">
            <h3>{countryData.name}</h3>
            {flags.map(({country, flag}) => (
              <img
                class="flag"
                src={flag}
                alt=''
                onClick={() => alert(country === this.country[0] ? 'Oh yeah' : 'Oooooh :(')}
              />
            ))}
          </div>

          <div class="small-map-container">
            <app-clickable-map activeCountries={countryCode ? [countryCode] : []} />
          </div>

        </div>
      </Host>
    );
  }
}

const getRandomCountry = (countries: CountryDataList) => {
  const countriesArray = Object.entries(countries)
  const lastCountryIndex = countriesArray.length - 1
  const randomIndex = Math.floor(Math.random() * (lastCountryIndex - 0) + 0)
  return countriesArray[randomIndex]
}

const getRandomFlags = (
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

  console.log('Pre sort', flags);

  return flags.sort(
    (a, b) =>  a.country < b.country ? -1 : 1
  )
}
