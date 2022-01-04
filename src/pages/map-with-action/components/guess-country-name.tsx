import { FunctionalComponent, h } from '@stencil/core';
import { CountryData } from '../../../models/countries';

export interface GuessCountryNameProps {
  options: CountryData[]
  onClick?: (countryCode: string) => void
}

export const GuessCountryName: FunctionalComponent<GuessCountryNameProps> = (
  {options, onClick}
) => {

  return <div>
    <h2>¿Cuál es el país que aparece señalado en el mapa?</h2>

    {options?.map(({ name, code }) => (
      <ion-button onClick={() => onClick(code)}> {name} </ion-button>
    ))
    }
  </div>;
};
