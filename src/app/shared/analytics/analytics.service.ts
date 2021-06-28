import { Injectable } from '@angular/core';
import { Plugins, Capacitor } from '@capacitor/core';
// import { FirebaseAnalytics } from "@capacitor-community/firebase-analytics";
import "@capacitor-community/firebase-analytics";
import { environment } from 'src/environments/environment';

const { FirebaseAnalytics } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor() { }

  initAnalytics(){
    // alert(Capacitor.platform)
    if (Capacitor.platform === 'web') {
      // alert("Inside web")
      this.initializeWeb();
    } else {
      this.getAppInstanceId();
    }
  }

  private initializeWeb() {
    FirebaseAnalytics.initializeFirebase(environment.firebaseConfig);
  }

  setUserId(user:any) {
    FirebaseAnalytics.setUserId({
      userId: user.uid,
    });
  }

  setUserProperty(property:any) {
    FirebaseAnalytics.setUserProperty({
      name: property.name,
      value: property.value, //"pizza",
    });
  }

  async getAppInstanceId(){
    // this is mobile only method, not supported on web
    const response = await FirebaseAnalytics.getAppInstanceId();

    const { instanceId } = response;
    // alert('Instance ID: ' + instanceId);
  }

  async setScreenName(page:any){
    await FirebaseAnalytics.setScreenName({ screenName: page.name });
  }

  async logEvent(event:any) {
    FirebaseAnalytics.logEvent({
      name: event.name, //"select_content",
      params: event.params? event.params : {}
      // params: {
      //   content_type: "image",
      //   content_id: "P12453",
      //   items: [{ name: "Kittens" }],
      // },
    });
  }
}
