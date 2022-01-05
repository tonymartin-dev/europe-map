import { Component, Element, h } from '@stencil/core';
import { Header } from '../header/header';
import { SideMenu } from '../side-menu/side-menu';
import { state } from '../../store/store';
import { getAllCountries } from '../../services/countries';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
})
export class AppRoot {
  @Element() el: HTMLAppRootElement

  componentWillLoad() {
    getAllCountries().then(countries => state.countriesData = countries)
  }

  render() {
    return (
      <ion-app>
        <ion-menu side="start" contentId="main">
          <SideMenu parentRef={this.el}/>
        </ion-menu>

        <div id="main-content">
          <Header />
        </div>

        <ion-content id="main">
          <ion-router useHash={false}>
            <ion-route url="/" component="app-map" />
            <ion-route url="/map-game/:game" component="af-map-with-action" />
          </ion-router>
          <ion-nav />
        </ion-content>

      </ion-app>
    );
  }
}
