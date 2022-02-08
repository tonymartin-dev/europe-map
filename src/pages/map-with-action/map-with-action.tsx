import { Component, ComponentInterface, Element, h, Host, JSX, Prop, State, Watch } from '@stencil/core';
import { CountryData, CountryDataList } from '../../models/countries';
import {
  DEFAULT_COUNTRIES_OPTIONS,
  getAlertExtraMessage,
  getHigherPopulationCountry,
  getRandomCountries,
  getRandomCountry,
} from '../../services/countries';
import { onStoreChange, state } from '../../store/store';
import { GuessCountryName } from './components/guess-country-name';
import { FindFlag } from './components/find-flag';
import { failAlert, successAlert } from '../../services/feedback-alerts';
import { GuessCapital } from './components/guess-capital';
import { GuessMostPopulated } from './components/guess-most-populated';
import { GameType } from '../../models/routes';
import { FindCountry } from './components/find-country';

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
  @State() attempts = 0

  @Element() el!: HTMLAfMapWithActionElement

  @Watch('countriesData') private watchCountries() {
    if(!this.countriesData || !Object.keys(this.countriesData).length){
      return
    }

    if(this.game === "find-country"){
      // ToDO: avoid countries with a width less than 15, because they can't be clicked
      this.country = getRandomCountry(this.countriesData, this.previouslySelectedCountries)[1]
      this.previouslySelectedCountries.add(this.country.code)

      state.activeCountries = Object.values(this.countriesData).map(option => option.code)
      return
    }

    this.countriesOptions = getRandomCountries(this.countriesData, DEFAULT_COUNTRIES_OPTIONS, this.previouslySelectedCountries)

    if(this.game === "guess-most-populated") {
      state.activeCountries = this.countriesOptions.map(option => option.code)
      this.country = getHigherPopulationCountry(this.countriesOptions)
      return
    }

    const randomIndex = Math.floor(Math.random() * (this.countriesOptions.length - 1))
    this.country = (this.countriesOptions.filter(
      (country) => !this.previouslySelectedCountries.has(country.code)
    ))[randomIndex]
    this.previouslySelectedCountries.add(this.country.code)

    state.activeCountries = this.country?.code ? [this.country.code] : []

  }

  private previouslySelectedCountries: Set<string> = new Set()

  componentWillLoad(): Promise<void> | void {

    onStoreChange('countriesData', value => {
      this.countriesData = { ...value }
      this.watchCountries()
    })

    this.countriesData = { ...state.countriesData }
    this.watchCountries()
  }

  componentDidRender() {
    const countriesSvgPaths = document.querySelectorAll('.country')
    const selectedCountrySvgPath = Object.values(countriesSvgPaths)
      .find(e =>
        e.id.toUpperCase().split('-')?.[0] === this.country.code
      )
    const countryWidth = selectedCountrySvgPath?.getBoundingClientRect().width

    if(this.game === "find-country" && countryWidth < 15) {
      console.warn(`${this.country.name} is too small. Updating`);
      this.watchCountries()
    }
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
            {this.game === "find-country" ? (
              <app-clickable-map
                activeCountries={state.activeCountries}
                showTooltip={false}
                onCountryClick={({detail}) => this.checkCountrySelection(detail)}
              />
            ) : (
              <app-clickable-map
                activeCountries={state.activeCountries}
                showTooltip={false}
                highlightActive
              />
            )}

          </div>
        </div>
      </Host>
    );
  }

  private renderAction() {
    switch (this.game) {
      case 'guess-country-name':
        return <GuessCountryName
          options={this.countriesOptions}
          onClick={(code) => this.checkCountrySelection(code) }
        />
      case 'find-flag':
        return <FindFlag
          selectedCountry={this.country}
          options={this.countriesOptions}
          onClick={(code) => this.checkCountrySelection(code) }
        />
      case 'guess-capital':
        return <GuessCapital
          selectedCountry={this.country}
          options={this.countriesOptions}
          onClick={(code) => this.checkCountrySelection(code) }
        />
      case 'guess-most-populated':
        return <GuessMostPopulated
          options={this.countriesOptions}
          onClick={(code) => this.checkCountrySelection(code) }
        />
      case 'find-country':
        return <FindCountry selectedCountry={this.country}/>
      default:
        return <p>Game not found</p>
    }
  }

  private async checkCountrySelection(countryCode: string) {
    const isCorrect = countryCode === this.country.code
    const extraMsg = getAlertExtraMessage(this.game, countryCode)
    this.updatePoints(isCorrect)
    this.showAlert(isCorrect, extraMsg)
  }

  private showAlert (isCorrect?: boolean, extraMsg?: string) {
    if(isCorrect) {
      successAlert(extraMsg, () => this.watchCountries())
    } else {
      failAlert(
        extraMsg,
        this.attempts >= 2
          ? () => {
            this.attempts = 0
            this.watchCountries();
          }
          : undefined)
    }
  }


  private updatePoints(isCorrect: boolean) {
    if(isCorrect){
      state.points += 5
      this.attempts = 0
    } else {
      state.points = state.points < 2 ? 0 : state.points - 2
      this.attempts++
    }
  }

}

