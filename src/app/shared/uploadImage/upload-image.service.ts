import { ComponentsService } from 'src/app/shared/components/components.service';

import { SessionService } from 'src/app/shared/session/session.service';
import { DatabaseService } from './../database/database.service';
import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { ActionSheetController, AlertController, Platform } from '@ionic/angular';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class UploadImageService {
  sessionInfo: any;
  photo: any;

  constructor(
    public db: DatabaseService,
    public common: ComponentsService,
    public session: SessionService,
    public alertController: AlertController,
    public actionSheetCtrl:ActionSheetController,
    private sanitizer: DomSanitizer,




  ) {
    this.session.watch().subscribe(value=>{
      this.sessionInfo = value;
      console.log("Subscription got AttendancePage", this.sessionInfo);
    })

   }


   upload_profile_photo(base64Image)
   {
     this.common.showLoader();
     let storageRef = firebase.storage().ref();

     const filename = this.sessionInfo?.userProfile.uid+'_'+this.sessionInfo?.userProfile.subscriberId;

     // Create a reference to 'images/todays-date.jpg'
     const imageRef = storageRef.child(`profile_images/${filename}.jpg`);

     imageRef.putString(base64Image, firebase.storage.StringFormat.DATA_URL)
       .then((snapshot)=> {
         // Do something here when the data is succesfully uploaded!
         snapshot.ref.getDownloadURL().then((downloadURL)=>{

           this.db.updateDocument(this.db.allCollections.users, this.sessionInfo?.userProfileDocId , {
               'picUrl': downloadURL, //imageRef.toString()
             }
           )
           .then((res)=>{

             // this.loader = false;
             this.common.hideLoader();
             this.common.presentAlert("Success","Data updated successfully.");

           })
           .catch((err)=>{
             // this.loader = false;
             this.common.hideLoader();
             this.common.presentAlert("Error","Profile could not be updated successfully. Error: " + err.toString());
           });
         });
     });
   }



   async take_photo(){
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Edit profile picture',
      cssClass: 'my-custom-class',
      buttons: [
                {
                  text: 'Select source',
                  icon: 'person-circle',
                  handler: () => {
                  this.takePicture();
                  }
                },
                {
                  text: 'Cancel',
                  icon: 'close',
                  role: 'cancel',
                  handler: () => {
                    console.log('Cancel clicked');
                  }
                }
              ],
    });
    await actionSheet.present();
   }

   async takePicture() {
    const image = await Plugins.Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      // source: source =='camera' ? CameraSource.Camera : CameraSource.Photos,
      height:128,
      width:128
    });

    this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl))
    console.log('image_dataUrl',image.dataUrl);
    this.upload_profile_photo(image.dataUrl)
  }
}
