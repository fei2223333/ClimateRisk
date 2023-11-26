import { WelcomePage, SpineLayout, TemplateChart, ConanLayout, CensusTractFilter } from './';

export default {
  path: '',
  childRoutes: [
  { path: 'climate_risk', component: ConanLayout, name:'conan'},
  {path: 'census_tract_filter', component: CensusTractFilter, name:"CensusTractFilter"}
  ],
};
