import { createStore } from "@stencil/store";
import { CountryDataList } from '../models/countries';

const { state, onChange }: {
  state: { countriesData: CountryDataList },
  onChange: (name:string, callback: (value: any) => void) => void
} = createStore({
  countriesData: undefined
});

onChange('countriesData', value => {
  console.log('countriesData Updated', value)
});

export default state;
