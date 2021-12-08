import { Component, h } from '@stencil/core';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
})
export class AppRoot {
  render() {
    return (
      <ion-app>

        <ion-menu side="start" contentId="main">
          <ion-header>
            <ion-toolbar color="primary">
              <ion-title>Start Menu</ion-title>
            </ion-toolbar>
          </ion-header>
          <ion-content>
            <ion-list>
              <ion-item>Menu Item</ion-item>
              <ion-item>Menu Item</ion-item>
              <ion-item>Menu Item</ion-item>
              <ion-item>Menu Item</ion-item>
              <ion-item>Menu Item</ion-item>
            </ion-list>
          </ion-content>
        </ion-menu>


        <div id="main-content">
          <ion-header>
            <ion-toolbar>
              <ion-buttons slot={"start"}>
                <ion-menu-button></ion-menu-button>
              </ion-buttons>
              <ion-title>Países de Europa</ion-title>
              <p slot="end">Haz click en un país coloreado para conocerlo</p>
            </ion-toolbar>
          </ion-header>
        </div>

        <ion-content id="main">
          <ion-router useHash={false}>
            <ion-route url="/" component="app-map" />
            <ion-route url="/profile/:name" component="app-profile" />
          </ion-router>
        </ion-content>

        <ion-nav />
      </ion-app>
    );
  }
}
