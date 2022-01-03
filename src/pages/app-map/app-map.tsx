import { Component, ComponentInterface, h, Host, JSX, State } from '@stencil/core';
import { modalController } from '@ionic/core';
import { CountryDataList } from '../../models/countries';
import state from '../../store/store';

@Component({
  tag: 'app-map',
  styleUrl: 'app-map.pcss',
  scoped: true,
})
export class AppMap implements ComponentInterface {

  render(): JSX.Element {
    const countriesData = state.countriesData
    const activeCountries = Object.keys(countriesData ?? {})
    return (
      <Host>
        <app-clickable-map
          activeCountries={activeCountries}
          onCountryClick={({detail}) => this.openCountryModal(detail, countriesData)}
        />
      </Host>
    );
  }

  private async openCountryModal(countryCode: string, countriesData: CountryDataList) {
    console.log('openCountryModal', countryCode);
    const countryData = countriesData[countryCode]
    const modalRef = await modalController.create({
      component: 'app-info-modal',
      componentProps: {
        countryData,
      },
    });
    await modalRef.present();
  }
}
