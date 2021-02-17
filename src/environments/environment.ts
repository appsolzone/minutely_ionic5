// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
      apiKey: "AIzaSyCJ2oB3ar3gpbj453zzeBALpBTi-HJaL9g",
      authDomain: "timesheet-tracker-f60b7.firebaseapp.com",
      databaseURL: "https://timesheet-tracker-f60b7.firebaseio.com",
      projectId: "timesheet-tracker-f60b7",
      storageBucket: "timesheet-tracker-f60b7.appspot.com",
      messagingSenderId: "62933662382",
      appId: "1:62933662382:web:bffbd2259e1f0923f0cb3f"

      // apiKey: "AIzaSyCHcqo53G1ou3nGv50SXxoxGyvZ782dHNg",
      // authDomain: "rnmm-7b33d.firebaseapp.com",
      // projectId: "rnmm-7b33d",
      // storageBucket: "rnmm-7b33d.appspot.com",
      // messagingSenderId: "418702508352",
      // appId: "1:418702508352:web:37971ae16be3fe0e49faa5"
  },

  paypalInfo: {
      paypalBillingUrl: "https://api.sandbox.paypal.com/v1/billing/subscriptions/",
      paypalBasicUrl:
        "Basic " +
        btoa(
          "ATackO0tNdQfaa8uPjXYp35BV9zVqddJfxJs8yuNzmfVt1SMexC-B1X91VDmHLbo2RpGYWbNkVE-DJIb:EIyViahIsCTMXugf4SOx1D3mWLsU6DS8C3wdSJ-M5PfMke5o-DJEa7fOdVsixXEY3HT7IToB3KLLkZ96"
        ),
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
