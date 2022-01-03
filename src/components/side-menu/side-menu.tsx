import { FunctionalComponent, h } from '@stencil/core';

export interface SideMenuProps {
}

export const SideMenu: FunctionalComponent<SideMenuProps> = () => {
  return <ion-content>
    <ion-list>
      <ion-item href="/flags">Encuentra la bandera</ion-item>
      <ion-item>Busca el país</ion-item>
      <ion-item>Adivina la capital</ion-item>
      <ion-item>¿Dónde vive más gente?</ion-item>
    </ion-list>
  </ion-content>;
};
