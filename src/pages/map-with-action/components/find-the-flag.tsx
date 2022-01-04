import { FunctionalComponent, h } from '@stencil/core';
import { CountryData } from '../../../models/countries';

export interface FindTheFlagProps {
  selectedCountry: CountryData
  options: CountryData[]
  onClick?: (countryCode: string) => void
}

export const FindTheFlag: FunctionalComponent<FindTheFlagProps> = (
  {selectedCountry, options, onClick}
) => {
  return <div>
    <h1>Encuentra la bandera de este país</h1>

    <div class="data-container">
      <h3>{selectedCountry.name}</h3>
      {options.map(({ code, flag }) => (
        <img
          class="flag"
          src={flag}
          alt=''
          onClick={() => onClick(code)}
        />
      ))}
    </div>

    <h4>Ubicación en el mapa</h4>
  </div>;
};
