import { FunctionalComponent, h } from '@stencil/core';

export interface HeaderProps {
}

export const Header: FunctionalComponent<HeaderProps> = () => {
  return <ion-header>
    <ion-toolbar>
      <ion-buttons slot={"start"}>
        <ion-menu-button></ion-menu-button>
      </ion-buttons>
      <ion-title>Países de Europa</ion-title>
      <p slot="end">Haz click en un país coloreado para conocerlo</p>
    </ion-toolbar>
  </ion-header>;
};
