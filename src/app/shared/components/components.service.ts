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

    async presentAlert(header,message,buttons?:any) {

    let defaultDuttons:any = {
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
      ]
    }

    const alert = this.alertController.create({
      cssClass: 'my-custom-class',
      header: header,
      //subHeader: subtitle,
      message: message,
      buttons:buttons ? buttons : defaultDuttons[header],
    });

    (await alert).present();

  }
  presentAlertConfirm(header,message){
  return new Promise(async (resolve) => {
        const alert = await this.alertController.create({
          header: header,
          message: message,
          buttons: [
            {
              text: 'Dismiss',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                resolve(false);
              }
            }, {
              text: 'Ok',
              handler: () => {
                resolve(true);
              }
            }
          ]
        });
        alert.present();
      });
  }


    //============[ loader ]====================
     async showLoader(message: string = 'Please wait!') {
        // console.log("this.loader", message);
        if(!this.loader){
          this.loader = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: message,
          });

          (await this.loader)?.present();
        }
    }

    async hideLoader(message: string='Hiding the loader') {
       // console.log("this.loader", message);
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
