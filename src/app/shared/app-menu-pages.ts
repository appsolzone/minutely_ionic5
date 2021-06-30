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
  // {
  //   title: 'List',
  //   url: 'activitysearch',
  //   icon: 'list',
  //   tab: 'activitysearch',
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
    disabled: false,
  },
  {
    title: 'Alerts',
    url: 'notification',
    icon: 'notifications',
    tab: 'notification',
    disabled: true,
  },
  {
    title: 'Broadcast',
    url: 'broadcast-message',
    icon: 'megaphone',
    tab: 'broadcast-message',
    disabled: true,
  },

  // {
  //   title: 'Regions',
  //   url: 'region',
  //   icon: 'earth',
  //   tab: 'region',
  // },
  {
    title: 'Organization',
    url: 'admin',
    icon: 'people',
    tab: 'admin',
    disabled: true,
  },
  {
    title: 'Subscription',
    url: 'subscription',
    icon: 'card',
    tab: 'subscription',
    disabled: false,
  },
  {
    title: 'Settings',
    url: 'settings',
    icon: 'settings',
    tab: 'settings',
    disabled: true,
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
