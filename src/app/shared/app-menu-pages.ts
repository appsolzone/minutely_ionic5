// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// new tabs to be added as follows, the order to be defined as per the design
// {
//   title: '<title of the tab>',
//   url: '<router path>',
//   icon: '<ion-icon name>',
//   tab: '<tab route>',
// },
export const appPages = [
  {
    title: 'Activities',
    url: 'activities',
    icon: 'body',
    tab: 'activities',
  },
  // {
  //   title: 'Leaves',
  //   url: 'leave',
  //   icon: 'cafe',
  //   tab: 'leave',
  // },
  // {
  //   title: 'Expenses',
  //   url: 'expense',
  //   icon: 'cash',
  //   tab: 'expense',
  // },
  {
    title: 'Profile',
    url: 'profile',
    icon: 'person-circle',
    tab: 'profile',
  },
  {
    title: 'Ntification',
    url: 'notification',
    icon: 'notifications',
    tab: 'notification',
  },
  // {
  //   title: 'Regions',
  //   url: 'region',
  //   icon: 'earth',
  //   tab: 'region',
  // },
  {
    title: 'Organisation',
    url: 'admin',
    icon: 'people',
    tab: 'admin',
  },
  {
    title: 'Subscription',
    url: 'subscription',
    icon: 'card',
    tab: 'subscription',
  },
];

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
