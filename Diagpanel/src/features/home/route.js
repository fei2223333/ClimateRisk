import { WelcomePage, SpineLayout, TemplateChart,ConanLayout } from './';

export default {
  path: '',
  childRoutes: [{ path: 'spine', component: SpineLayout,name:'spine', isIndex: true },
  { path: 'conan', component: ConanLayout, name:'conan'}],
};
