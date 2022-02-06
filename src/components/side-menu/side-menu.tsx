import { FunctionalComponent, h } from '@stencil/core';

export interface SideMenuProps {
  parentRef?: HTMLAppRootElement
}

export const SideMenu: FunctionalComponent<SideMenuProps> = ({parentRef}) => {
  console.log({parentRef});

  return <ion-content>
    <ion-list>
      <ion-item {...menuLink('/', parentRef)}>
        Mapa informativo
      </ion-item>
      <ion-item {...menuLink("/map-game/find-flag", parentRef)}>
        Encuentra la bandera
      </ion-item>
      <ion-item {...menuLink("/map-game/find-country", parentRef)}>
        Busca el país
      </ion-item>
      <ion-item {...menuLink("/map-game/find-capital", parentRef)}>
        Adivina la capital
      </ion-item>
      <ion-item>¿Dónde vive más gente?</ion-item>
    </ion-list>
  </ion-content>;
}

const menuLink = (url: string, parentRef?: HTMLAppRootElement) => {
  return {
    href: url,
    onClick: () => closeMenu(parentRef)
  }
}

const closeMenu = (parentRef?: HTMLAppRootElement) => {
  if(!parentRef){
    return
  }
  const menuRef = parentRef.querySelector('ion-menu')
  if (menuRef) {
    menuRef?.close()
  }
}
