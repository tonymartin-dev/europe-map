import { Component, ComponentInterface, h, Host, JSX, State } from '@stencil/core';
import { modalController } from '@ionic/core';
import { getAllCountries } from '../../services/countries';
import { CountryData } from '../../models/countries';

@Component({
  tag: 'app-map',
  styleUrl: 'app-map.pcss',
  scoped: true,
})
export class AppMap implements ComponentInterface {
  @State() countriesData: Record<string, CountryData>

  componentDidLoad() {
    getAllCountries().then(countries => this.countriesData = countries)
  }

  render(): JSX.Element {
    const activeCountries = Object.keys(this.countriesData ?? {})
    return (
      <Host>
        <app-clickable-map
          activeCountries={activeCountries}
          onCountryClick={({detail}) => this.openCountryModal(detail)}
        />
      </Host>
    );
  }

  private async openCountryModal(countryCode: string) {
    console.log('openCountryModal', countryCode);
    const countryData = this.countriesData[countryCode]
    const modalRef = await modalController.create({
      component: 'app-info-modal',
      componentProps: {
        countryData,
      },
    });
    await modalRef.present();
  }
}
