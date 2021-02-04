import { DatabaseService } from './database.service';
import { Injectable } from '@angular/core';
import * as moment from 'moment';




@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(public database: DatabaseService) { }

  batchPerform(uId:string, sId:string, companyName:string, address:string, name:string, email:string){
    // this.loader = true;



      // Create a reference to the SF doc.
const subscriberRef = this.database.afs.firestore.collection(this.database.allCollections.subscribers).doc(sId);
const userRef = this.database.afs.firestore.collection(this.database.allCollections.users).doc(sId);
const notificationRef = this.database.afs.firestore.collection(this.database.allCollections.notifications).doc(sId);
const useruids = this.database.afs.firestore.collection(this.database.allCollections.useruids).doc(sId);

return this.database.afs.firestore.runTransaction(transaction =>{


 return transaction.get(subscriberRef).then(f=>{
    transaction.set(subscriberRef,{
      companyName: companyName,
      country: '',
      email: '',
      enrollmentDate: this.database.frb.firestore.FieldValue.serverTimestamp(),
      noOfFreeLicense: 2,
      noOfUserAllowed: 3,
      paypalId: '',
      phoneNo: '',
      subscriberId: sId,
      subscriptionEnd: this.database.frb.firestore.FieldValue.serverTimestamp(),
      subscriptionStart: this.database.frb.firestore.FieldValue.serverTimestamp(),
      subscriptionType: "FREE",
      tncVersion:'',
      countryServe: '',
      regionServe: '',
      address: address
    })

   transaction.set(userRef,{
        uid: uId,
        name: name,
        email: email,
        jobTitle: "New user",
        phone: '',
        role: 'ADMIN',
        picUrl: '',
        status: 'ACTIVE',
        subscriberId: sId,
        userCreationTimeStamp: this.database.frb.firestore.FieldValue.serverTimestamp(),
        isExternal: false,
        fcm:''
   }) 

   transaction.set(notificationRef,{
    uid: uId,
        name: name,
        totalAlerts: 0,
        totalAlertsUnread: 0
   })

   transaction.set(useruids,{
    uid: uId, email: email 
   })

  })

  })

  
    
  }

  batchPerformUser(uId:string, sId:string, name:string, email:string)
  {

const subscriberRef = this.database.afs.firestore.collection(this.database.allCollections.subscribers).doc(sId);
const userRef = this.database.afs.firestore.collection(this.database.allCollections.users).doc(sId);
const notificationRef = this.database.afs.firestore.collection(this.database.allCollections.notifications).doc(sId);
const useruids = this.database.afs.firestore.collection(this.database.allCollections.useruids).doc(sId);

return this.database.afs.firestore.runTransaction(transaction =>{


  return transaction.get(userRef).then(f=>{
     transaction.set(userRef,{
      'uid': uId,
      'name': name,
      'email': email,
      'jobTitle': "New user",
      'phone': '',
      'role': 'USER',
      'picUrl': '',
      'status': "REGISTERED",
      'subscriberId': sId,
      'userCreationTimeStamp': this.database.frb.firestore.FieldValue.serverTimestamp(),
      'isExternal': false,
      'fcm':'',
      'countryServe': '',
      'regionServe': ''
     })
 
    // transaction.set(userRef,{
    //      uid: uId,
    //      name: name,
    //      email: email,
    //      jobTitle: "New user",
    //      phone: '',
    //      role: 'ADMIN',
    //      picUrl: '',
    //      status: 'ACTIVE',
    //      subscriberId: sId,
    //      userCreationTimeStamp: this.database.frb.firestore.FieldValue.serverTimestamp(),
    //      isExternal: false,
    //      fcm:''
    // }) 
 
    transaction.set(notificationRef,{
      uid: uId,
      name: name,
      totalAlerts: 0,
      totalAlertsUnread: 0
    })
 
    transaction.set(useruids,{
     uid: uId, email: email 
    })
 
   })
 
   })

  }
}
