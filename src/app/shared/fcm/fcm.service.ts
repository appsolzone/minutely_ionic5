import { Injectable } from '@angular/core';
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
  Capacitor
} from '@capacitor/core';
import { Router } from '@angular/router';
import { ComponentsService } from 'src/app/shared/components/components.service';

const { App, PushNotifications, Browser } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(
    private router: Router,
    private common: ComponentsService,
    ) { }

  initPush() {
    // alert(Capacitor.platform)
    if (Capacitor.platform !== 'web') {
      this.registerPush();
    }
  }

  private registerPush() {
    PushNotifications.requestPermission().then((permission) => {
      if (permission.granted) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // No permission for push granted
        // alert('Permission not granted')
      }
    });

    PushNotifications.addListener(
      'registration',
      (token: PushNotificationToken) => {
        // alert('My token: ' + JSON.stringify(token))
        console.log('My token: ' + JSON.stringify(token));
      }
    );

    PushNotifications.addListener('registrationError', (error: any) => {
      // alert('Error: ' + JSON.stringify(error))
      console.log('Error: ' + JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotification) => {
        // alert('Push received: ' + JSON.stringify(notification))
        console.log('Push received: ' + JSON.stringify(notification));
      }
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      async (notification: PushNotificationActionPerformed) => {
        const data = notification.notification.data;
        console.log('Action performed: ' + JSON.stringify(notification.notification));
        if (data.detailsId) {
          // this.router.navigateByUrl(`/home/${data.detailsId}`);
        }
        // Process specific request for campaign
        if (data.showMsg=="yes" && data.msgTitle && data.msgBody) {
          let title = data.msgTitle;
          let body = data.msgBody;
          let response: boolean = false;
          let buttons: any[] = [
                          {
                            text: 'Dismiss',
                            role: 'cancel',
                            cssClass: '',
                            handler: ()=>{response = false;},
                            resolve: false
                          }
                        ];
          if(data.targetUrl){
            buttons.push({
              text: 'Continue',
              role: '',
              cssClass: '',
              handler: async ()=>{
                // check if any app can launch it
                let ret = await App.canOpenUrl({ url: data.targetUrl });
                if(ret){
                  await App.openUrl({ url: data.targetUrl });
                } else {
                  // no suitable app found so launch using inapp Browser
                  await Browser.open({ url: data.targetUrl });
                }                
                response = true;
              },
              resolve: true
            });
          }
          await this.common.presentAlertConfirm(title,body, buttons);
        }
      }
    );
  }
}
