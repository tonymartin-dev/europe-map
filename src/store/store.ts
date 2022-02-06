import { createStore } from "@stencil/store";
import { CountryDataList } from '../models/countries';
import { GAME_ROUTES } from '../models/routes';

const { state, onChange }: {
  state: {
    countriesData?: CountryDataList,
    activeCountries: string[],
    route?: string,
    isGameRoute: boolean
  },
  onChange: (name:string, callback: (value: any) => void) => void
} = createStore({
  countriesData: undefined,
  activeCountries: [],
  route: undefined,
  isGameRoute: false
});

onChange('countriesData', value => {
  console.log('countriesData Updated', value)
});

onChange('route', (newRoute: string) => {
  state.isGameRoute = GAME_ROUTES.some(route => newRoute.includes(route))
  console.log(`> Navigation: ${newRoute}. ${state.isGameRoute ? "" : "No"} Game Route`);
})

onChange('activeCountries', activeCountries => {
  console.log('[CHANGE] Active Countries', activeCountries);
})

export { state, onChange as onStoreChange };
