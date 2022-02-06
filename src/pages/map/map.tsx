import { Component, ComponentInterface, h, Host, JSX } from '@stencil/core';
import { modalController } from '@ionic/core';
import { CountryDataList } from '../../models/countries';
import { state } from '../../store/store';

@Component({
  tag: 'app-map',
  styleUrl: 'map.pcss',
  scoped: true,
})
export class Map implements ComponentInterface {

  render(): JSX.Element {
    // Prevent component to be loaded twice because of ionic router behavior
    if(state.isGameRoute ) {
      return ''
    }

    const countriesData = state.countriesData
    state.activeCountries = Object.keys(countriesData ?? {})
    return (
      <Host>
        <app-clickable-map
          activeCountries={state.activeCountries}
          onCountryClick={({detail}) => this.openCountryModal(detail, countriesData)}
        />
      </Host>
    );
  }

  private async openCountryModal(countryCode: string, countriesData: CountryDataList) {
    const countryData = countriesData[countryCode]
    const modalRef = await modalController.create({
      component: 'app-info-modal',
      componentProps: {
        countryData,
      },
    });
    await modalRef.present()
  }
}
