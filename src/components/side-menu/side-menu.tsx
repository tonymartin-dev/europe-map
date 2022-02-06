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
      <ion-item {...menuLink("/map-game/guess-country-name", parentRef)}>
        Adivina el país
      </ion-item>
      <ion-item {...menuLink("/map-game/guess-capital", parentRef)}>
        Adivina la capital
      </ion-item>
      <ion-item {...menuLink("/map-game/guess-most-populated", parentRef)}>
        ¿Dónde vive más gente?
      </ion-item>
      <ion-item {...menuLink("/map-game/find-country", parentRef)}>
        Encuentra el país
      </ion-item>
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
