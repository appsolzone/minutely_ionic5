export const environment = {
  production: true,
  firebaseConfig: {
    apiKey: "AIzaSyBAY9Jaq2AxSm0BOd-EI99U4P8LbXm9T_Q",
      authDomain: "hrms-2aae7.firebaseapp.com",
      databaseURL: "https://hrms-2aae7.firebaseio.com",
      projectId: "hrms-2aae7",
      storageBucket: "hrms-2aae7.appspot.com",
      messagingSenderId: "861175361633",
      appId: "1:861175361633:web:94baa25fe6565d9e72ba20",
      measurementId: "G-7Z29Z8ESVW"
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
