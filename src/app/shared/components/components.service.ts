import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController, ModalController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ComponentsService {
  loader: any;
  loderCount = 0;
  public modal: any;
  constructor(
    public alertController: AlertController,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public modalCtrl: ModalController,
    ) {}


  // this.componentService.presentAlert('Success','message');
  // this.componentService.presentAlert('Error','message');
  // this.componentService.presentAlert('Warning','message');
  // this.componentService.presentAlert('Alert','message');

  async presentModal(modalComponent, componentProps: any ={}, onDismissCallback: any = null) {
    this.modal = await this.modalCtrl.create({
      component: modalComponent,
      swipeToClose: true,
      // presentingElement: this.routerOutlet.nativeEl,
      componentProps: { ...componentProps }
    });
    await this.modal.present();

    const { data } = await this.modal.onWillDismiss();
    if (data && onDismissCallback) {
      onDismissCallback(data);
    }
  }

  async dismissModal(){
    await this.modal.dismiss();
    this.modal = null;
  }

    async presentAlert(header, message, buttons?: any) {

    const defaultDuttons: any = {
      Success: [
         {
          text: 'Ok',
          role: 'ok',
          cssClass: 'ok-button',
          handler: () => {
           console.log('Confirm Ok');
          }
        }
      ],
      Error: [
         {
          text: 'Dismiss',
          role: 'error',
          cssClass: 'error-button',
          handler: () => {
            console.log('Confirm Ok');
          }
        }
      ]
    };

    const alert = this.alertController.create({
      cssClass: 'my-custom-class',
      header,
      // subHeader: subtitle,
      message,
      buttons: buttons ? buttons : defaultDuttons[header],
    });

    (await alert).present();

  }
  presentAlertConfirm(header, message, buttons?: any){
  return new Promise(async (resolve) => {
        // process buttons
        let newButtons = [];
        if (buttons){
          newButtons = buttons.map(b => {
            return {
              text: b.text,
              role: b.role,
              cssClass: '',
              handler: () => {
                b.handler();
                resolve(b.resolve);
              }
            };
          });
        }
        const alert = await this.alertController.create({
          header,
          message,
          buttons: buttons ? newButtons : [
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


    // ============[ loader ]====================
     async showLoader(message: string = 'Please wait!', duration: number = 0, spinner: any=null) {
        // console.log("this.loader requested for ", message);
        // if(!this.loader){
          console.log('creating this.loader for ', message, this.loderCount);
          this.loader = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message,
            spinner: spinner,
            duration // auto timeout limit
          });

          this.loderCount++;
          console.log('creating this.loader for this.loderCount ', message, this.loderCount);
          return (this.loader)?.present();

        // }

    }

    async hideLoader(message: string= 'Hiding the loader') {
       console.log('this.loader', message, this.loader, this.loderCount);
       (await this.loader)?.dismiss();
       if (this.loderCount > 0) { this.loderCount--; }
        // this.loader = null;
       console.log('this.loader post dismiss', message, this.loader, this.loderCount);

    }
    // ===============[ toaster ]===============
    async presentToaster(msg) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'bottom',
      duration: 3500
    });
    (await toast).present();
  }
}
