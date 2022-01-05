import { FunctionalComponent, h } from '@stencil/core';
import { CountryData } from '../../../models/countries';

export interface GuessCapitalProps {
  selectedCountry: CountryData
  options: CountryData[]
  onClick?: (countryCode: string) => void
}

export const GuessCapital: FunctionalComponent<GuessCapitalProps> = (
  {selectedCountry, options, onClick}
) => {
  return <div>
    <h2>¿Cuál es la capital de</h2>
    <h2>{selectedCountry.name}?</h2>

    {options?.map(({ capital, code }) => (
      <ion-button onClick={() => onClick(code)}> {capital} </ion-button>
    ))}
  </div>;
};
