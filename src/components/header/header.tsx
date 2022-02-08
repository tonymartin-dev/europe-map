import { FunctionalComponent, h } from '@stencil/core';
import { state } from '../../store/store';

export interface HeaderProps {
}

export const Header: FunctionalComponent<HeaderProps> = () => {
  return <ion-header>
    <ion-toolbar style={{padding: "0 12px"}}>
      <ion-buttons slot={"start"}>
        <ion-menu-button></ion-menu-button>
      </ion-buttons>
      <ion-router-link href="/"><ion-title>Países de Europa</ion-title></ion-router-link>
      <p slot="end">Puntos: <span>{state.points}</span></p>
    </ion-toolbar>
  </ion-header>;
};
