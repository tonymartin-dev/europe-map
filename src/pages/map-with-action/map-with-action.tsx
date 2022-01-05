import { Component, ComponentInterface, h, Host, JSX, Prop, State, Watch } from '@stencil/core';
import { CountryData, CountryDataList } from '../../models/countries';
import { getRandomCountries, getRandomCountry } from '../../services/countries';
import { onStoreChange, state } from '../../store/store';
import { GuessCountryName } from './components/guess-country-name';
import { FindTheFlag } from './components/find-the-flag';
import { failAlert, successAlert } from '../../services/feedback-alerts';
import { GuessCapital } from './components/guess-capital';
import { GuessMorePopulation } from './components/guess-more-population';

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

    let activeCountries
    if(this.game === "find-more-population") {
      activeCountries = this.countriesOptions.map(option => option.code)
    } else {
      activeCountries = this.country?.[0] ? [this.country?.[0]] : []
    }

    return (
      <Host>
        <div class="main-content">

          {this.renderAction()}

          <div class="small-map-container">
            <app-clickable-map activeCountries={activeCountries} showTooltip={this.game !== 'find-country'}/>
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
      case 'find-more-population':
        return <GuessMorePopulation
          options={this.countriesOptions}
          onClick={(code) => this.getMorePopulated(code, this.countriesOptions) }
        />
      default:
        return <p>Game not found</p>
    }
  }

  private async checkCountrySelection(countryCode: string) {
    const isCorrect = countryCode === this.country[0]
    this.showAlert(isCorrect)
  }

  private getMorePopulated (selected: string, options: CountryData[]) {
    const selectedPopulation = options.find(option => option.code === selected)?.population

    if(!selectedPopulation){
      alert('Se ha producido un error')
    }

    const allPopulations = options.map(option => Number.parseInt(option.population))
    const maxPopulation = Math.max(...allPopulations)
    const isCorrect = Number.parseInt(selectedPopulation) === maxPopulation

    this.showAlert(isCorrect)
  }

  private showAlert (isCorrect?: boolean) {
    if(isCorrect) {
      successAlert(() => this.watchCountries())
    } else {
      failAlert()
    }
  }

}
