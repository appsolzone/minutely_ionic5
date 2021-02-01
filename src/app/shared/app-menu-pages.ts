// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const appPages = [
  {
    title: 'Attendance',
    url: '/tabs/attendance',
    icon: 'time',
    tab: 'attendance',
  },
  {
    title: 'Leaves',
    url: '/tabs/leave',
    icon: 'cafe',
    tab: 'leave',
  },
  {
    title: 'Expenses',
    url: '/tabs/expense',
    icon: 'cash',
    tab: 'expense',
  },
  {
    title: 'Profile',
    url: '/tabs/profile',
    icon: 'person-circle',
    tab: 'profile',
  },
  {
    title: 'Ntification',
    url: '/tabs/notification',
    icon: 'notifications',
    tab: 'notification',
  },
  {
    title: 'Regions',
    url: '/tabs/region',
    icon: 'earth',
    tab: 'region',
  },
  {
    title: 'Organisation',
    url: '/tabs/admin',
    icon: 'people',
    tab: 'admin',
  },
  {
    title: 'Subscription',
    url: '/tabs/subscription',
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
