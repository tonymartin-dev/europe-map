import { Component, ComponentInterface, h, Host, JSX, Prop, State, Watch } from '@stencil/core';
import { CountryData, CountryDataList } from '../../models/countries';
import { getHigherPopulationCountry, getRandomCountries } from '../../services/countries';
import { onStoreChange, state } from '../../store/store';
import { GuessCountryName } from './components/guess-country-name';
import { FindTheFlag } from './components/find-the-flag';
import { failAlert, successAlert } from '../../services/feedback-alerts';
import { GuessCapital } from './components/guess-capital';
import { GuessMostPopulated } from './components/guess-most-populated';
import { GameType } from '../../models/routes';

@Component({
  tag: 'af-map-with-action',
  styleUrl: 'map-with-action.pcss',
  scoped: true,
})
export class MapWithAction implements ComponentInterface {
  @Prop() game?: GameType

  @State() country?: CountryData
  @State() countriesData?: CountryDataList
  @State() countriesOptions: CountryData[] = []

  @Watch('countriesData') private watchCountries() {
    if(!this.countriesData || !Object.keys(this.countriesData).length){
      return
    }
    this.countriesOptions = getRandomCountries(this.countriesData)

    if(this.game === "find-most-populated") {
      state.activeCountries = this.countriesOptions.map(option => option.code)
      this.country = getHigherPopulationCountry(this.countriesOptions)
    } else {
      state.activeCountries = this.country?.code ? [this.country.code] : []
      const randomIndex = Math.floor(Math.random() * (this.countriesOptions.length - 1))
      this.country = this.countriesOptions[randomIndex]
    }
  }

  componentWillLoad(): Promise<void> | void {
    console.log('GAME', this.game)

    onStoreChange('countriesData', value => {
      this.countriesData = { ...value }
      this.watchCountries()
    })

    this.countriesData = { ...state.countriesData }
    this.watchCountries()
  }

  render(): JSX.Element {
    // Prevent component to be loaded twice because of ionic router behavior
    if(!this.country || !state.isGameRoute ) {
      return ''
    }

    return (
      <Host>
        <div class="main-content">

          {this.renderAction()}

          <div class="small-map-container">
            <app-clickable-map activeCountries={state.activeCountries} showTooltip={this.game !== 'find-country'}/>
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
          selectedCountry={this.country}
          options={this.countriesOptions}
          onClick={(code) => this.checkCountrySelection(code) }
        />
      case 'find-capital':
        return <GuessCapital
          selectedCountry={this.country}
          options={this.countriesOptions}
          onClick={(code) => this.checkCountrySelection(code) }
        />
      case 'find-most-populated':
        return <GuessMostPopulated
          options={this.countriesOptions}
          onClick={(code) => this.checkCountrySelection(code) }
        />
      default:
        return <p>Game not found</p>
    }
  }

  private async checkCountrySelection(countryCode: string) {
    const isCorrect = countryCode === this.country.code
    const extraMsg = this.game === "find-most-populated"
      ? `${this.country.name} tiene ${this.country.population} habitantes.`
      : undefined
    this.showAlert(isCorrect, extraMsg)
  }

  private showAlert (isCorrect?: boolean, extraMsg?: string) {
    if(isCorrect) {
      successAlert(extraMsg, () => this.watchCountries())
    } else {
      failAlert()
    }
  }

}
