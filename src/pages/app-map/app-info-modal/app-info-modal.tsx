import { Component, ComponentInterface, Element, h, Host, JSX, Prop } from '@stencil/core';

@Component({
  tag: "app-info-modal",
  styleUrl: "app-info-modal.pcss",
  scoped: true,
})
export class InfoModal implements ComponentInterface {
  @Prop() countryData?: {
    name: string,
    capital: string,
    population: number,
    flag: string
  }

  @Element() el!: HTMLAppInfoModalElement

  private modalRef?: HTMLIonModalElement

  componentDidLoad() {
    console.log('countryData', this.countryData);
    this.modalRef = this.el.closest('ion-modal')
  }

  render(): JSX.Element {
    return (
      <Host>
        <ion-header>
          <ion-toolbar>
            <h1>{this.countryData.name}</h1>
            <ion-button slot="end" fill="clear" onClick={() => this.modalRef?.dismiss()}>
              <ion-icon name="close"/>
            </ion-button>
          </ion-toolbar>
        </ion-header>

        <ion-content>

          <div class="flag-container">
            <img class="flag" src={this.countryData.flag} />
          </div>

          <ion-list>
            <ion-item>
              <ion-label>Capital</ion-label>
              <p>{this.countryData.capital}</p>
            </ion-item>
            <ion-item>
              <ion-label>Población</ion-label>
              <p>{this.countryData.population}</p>
            </ion-item>
          </ion-list>

        </ion-content>
      </Host>
    )
  }
}

