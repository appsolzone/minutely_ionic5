export const environment = {
  production: true,
  firebaseConfig: {
    //===============[ Appsolzone ]===============
    // apiKey: "AIzaSyBAY9Jaq2AxSm0BOd-EI99U4P8LbXm9T_Q",
    //   authDomain: "hrms-2aae7.firebaseapp.com",
    //   databaseURL: "https://hrms-2aae7.firebaseio.com",
    //   projectId: "hrms-2aae7",
    //   storageBucket: "hrms-2aae7.appspot.com",
    //   messagingSenderId: "861175361633",
    //   appId: "1:861175361633:web:94baa25fe6565d9e72ba20",
    //   measurementId: "G-7Z29Z8ESVW"

    // apiKey: "AIzaSyCHcqo53G1ou3nGv50SXxoxGyvZ782dHNg",
    // authDomain: "rnmm-7b33d.firebaseapp.com",
    // projectId: "rnmm-7b33d",
    // storageBucket: "rnmm-7b33d.appspot.com",
    // messagingSenderId: "418702508352",
    // appId: "1:418702508352:web:37971ae16be3fe0e49faa5"
    
    apiKey: "AIzaSyAAlYcDlFQPlEEYZKimGAjNAvJhMlsjGdU",
    authDomain: "ocurrenshub.firebaseapp.com",
    databaseURL: "https://ocurrenshub.firebaseio.com",
    projectId: "ocurrenshub",
    storageBucket: "ocurrenshub.appspot.com",
    messagingSenderId: "438479765215",
    appId: "1:438479765215:web:9389987f7dcabee06b736a"
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
