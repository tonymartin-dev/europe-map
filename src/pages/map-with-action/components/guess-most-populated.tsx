import { FunctionalComponent, h } from '@stencil/core';
import { CountryData } from '../../../models/countries';

export interface GuessMorePopulationProps {
  options: CountryData[]
  onClick?: (countryCode: string) => void
}

export const GuessMostPopulated: FunctionalComponent<GuessMorePopulationProps> = (
  {options, onClick}
) => {
  return <div>
    <h2>¿En qué país vive más gente?</h2>

    {options?.map(({ name, code }) => (
      <ion-button onClick={() => onClick(code)}> {name} </ion-button>
    ))}

    <h4>Ubicación en el mapa</h4>
  </div>
};
