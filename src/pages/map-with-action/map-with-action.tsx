import { Component, ComponentInterface, h, Host, JSX, Prop, State, Watch } from '@stencil/core';
import { CountryData, CountryDataList } from '../../models/countries';
import { getRandomCountries, getRandomCountry } from '../../services/countries';
import { onStoreChange, state } from '../../store/store';
import { GuessCountryName } from './components/guess-country-name';
import { FindTheFlag } from './components/find-the-flag';
import { failAlert, successAlert } from '../../services/feedback-alerts';
import { GuessCapital } from './components/guess-capital';

@Component({
  tag: 'af-map-with-action',
  styleUrl: 'map-with-action.pcss',
  scoped: true,
})
export class MapWithAction implements ComponentInterface {
  @Prop() game?: string

  @State() country?: [string, CountryData]
  @State() countriesData?: CountryDataList
  @State() countriesOptions: CountryData[] = []

  @Watch('countriesData') private watchCountries() {
    if(!this.countriesData){
      return
    }
    this.country = getRandomCountry(this.countriesData)
    this.countriesOptions = getRandomCountries(this.countriesData, this.country)
  }

  componentWillLoad(): Promise<void> | void {
    console.log('GAME', this.game)

    onStoreChange('countriesData', value => {
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

    return (
      <Host>
        <div class="main-content">

          {this.renderAction()}

          <div class="small-map-container">
            <app-clickable-map activeCountries={countryCode ? [countryCode] : []} />
          </div>
        </div>
      </Host>
    );
  }

  private renderAction() {
    switch (this.game) {
      case 'find-country':
        return <GuessCountryName
          options={this.countriesOptions}
          onClick={(code) => this.checkCountrySelection(code) }
        />
      case 'find-flag':
        return <FindTheFlag
          selectedCountry={this.country[1]}
          options={this.countriesOptions}
          onClick={(code) => this.checkCountrySelection(code) }
        />
      case 'find-capital':
        return <GuessCapital
          selectedCountry={this.country[1]}
          options={this.countriesOptions}
          onClick={(code) => this.checkCountrySelection(code) }
        />
      default:
        return <p>Game not found</p>
    }
  }

  private async checkCountrySelection(countryCode: string) {
    const isCorrect = countryCode === this.country[0]
    if(isCorrect) {
      successAlert(() => this.watchCountries())
    } else {
      failAlert()
    }
  }
}
