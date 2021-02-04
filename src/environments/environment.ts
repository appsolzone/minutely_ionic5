// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    // apiKey: "AIzaSyBAY9Jaq2AxSm0BOd-EI99U4P8LbXm9T_Q",
    //   authDomain: "hrms-2aae7.firebaseapp.com",
    //   databaseURL: "https://hrms-2aae7.firebaseio.com",
    //   projectId: "hrms-2aae7",
    //   storageBucket: "hrms-2aae7.appspot.com",
    //   messagingSenderId: "861175361633",
    //   appId: "1:861175361633:web:94baa25fe6565d9e72ba20",
    //   measurementId: "G-7Z29Z8ESVW"

    apiKey: "AIzaSyARa8_ZMTMIhnFy0C3OcR-SYuEOwCjr8IQ",
    authDomain: "chat-70583.firebaseapp.com",
    databaseURL: "https://chat-70583.firebaseio.com",
    projectId: "chat-70583",
    storageBucket: "chat-70583.appspot.com",
    messagingSenderId: "814702150307",
    appId: "1:814702150307:web:8d6e1849dceb079d8eb516"
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
