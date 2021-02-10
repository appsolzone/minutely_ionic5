import { ComponentsService } from 'src/app/shared/components/components.service';

import { SessionService } from 'src/app/shared/session/session.service';
import { DatabaseService } from './../database/database.service';
import { Injectable } from '@angular/core';
import firebase from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class UploadImageService {
  sessionInfo: any;

  constructor(
    public db: DatabaseService,
    public common: ComponentsService,
    public session: SessionService

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
}
