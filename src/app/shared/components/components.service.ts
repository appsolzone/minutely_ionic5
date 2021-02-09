import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ComponentsService {
  loader:any;
  constructor(
    public alertController: AlertController,
    public loadingController: LoadingController,
    public toastController:ToastController
    ) {}


  //this.componentService.presentAlert('Success','message');
  //this.componentService.presentAlert('Error','message');
  //this.componentService.presentAlert('Warning','message');
  //this.componentService.presentAlert('Alert','message');

    async presentAlert(header,message) {
    let buttons:any = {
      Success:[
         {
          text: 'Ok',
          role: 'ok',
          cssClass: 'ok-button',
          handler: () => {
           console.log('Confirm Ok');
          }
        }
      ],
      Error:[
         {
          text: 'Dismiss',
          role: 'error',
          cssClass: 'error-button',
          handler: () => {
            console.log('Confirm Ok');
          }
        }
      ],
      Warning:[
         {
          text: 'Dismiss',
          role: 'cancel',
          cssClass: 'cancel-button',
          handler: () => {
           console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          role: 'ok',
          cssClass: 'ok-button',
          handler: () => {
            console.log('Confirm Ok');
          }
        }
      ]
    }

    const alert = this.alertController.create({
      cssClass: 'my-custom-class',
      header: header,
      //subHeader: subtitle,
      message: message,
      buttons:buttons[header],
    });

    (await alert).present();
  }



    //============[ loader ]====================
     async showLoader(message: string = 'Please wait!') {
        this.loader = await this.loadingController.create({
          cssClass: 'my-custom-class',
          message: message,
        });

        (await this.loader)?.present();
    }

    async hideLoader() {
       (await this.loader)?.dismiss();
        this.loader = null;
    }
    //===============[ toaster ]===============
    async presentToaster(msg) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'bottom',
      duration: 3500
    });
    (await toast).present();
  }
}
