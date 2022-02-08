import { FunctionalComponent, h } from '@stencil/core';
import { CountryData } from '../../../models/countries';

export interface FindTheFlagProps {
  selectedCountry: CountryData
  onClick?: (countryCode: string) => void
}

export const FindCountry: FunctionalComponent<FindTheFlagProps> = (
  {selectedCountry}
) => {
  return <div>
    <h1>¿Dónde está {selectedCountry.name}?</h1>
  </div>;
};
