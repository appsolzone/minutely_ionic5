import { Injectable } from '@angular/core';
import { DatabaseService } from '../database/database.service';
import { User } from '../../interface/user';
import { ComponentsService } from '../components/components.service';
import { SendEmailService } from '../send-email/send-email.service';

@Injectable({
  providedIn: 'root'
})
export class ManageuserService {
  public incrementStatus: any = ['All', 'ACTIVE', 'REGISTERED'];
  public decrementStatus: any = ['SUSPENDED', 'REJECTED', 'LEAVER'];
  public newUser = {
                      uid: '',
                      subscriberId: '',
                      name: '',
                      email: '',
                      phoneNumber: '',
                      role: '',
                      jobTitle: '',
                      status: '',
                      address: '',
                      picUrl: '',
                      fcm: '',
                      lastUpdateTimeStamp: this.db.frb.firestore.FieldValue.serverTimestamp(),
                      userCreationTimeStamp: this.db.frb.firestore.FieldValue.serverTimestamp()
                  };

  constructor(
    public db: DatabaseService,
    private componentService: ComponentsService,
    private sendEmailService: SendEmailService
  ) {
    // TBA
  }
  getProfile(uid: string){
    return this.db.getAllDocumentsSnapshotByQuery(this.db.allCollections.users, [{field: 'uid', operator: '==', value: uid}]);
  }
  updateProfile(docId: string, userProfile: User){
    return this.db.setDocument(this.db.allCollections.users, docId, userProfile);
  }

  checkUser(user: any){
    if (user?.status != 'ACTIVE'){
      return {userStatus: user?.status, title: 'No access', body: 'Thank you ' + user?.name + '. Please ask your Admin to activate your account and unlock the benefits.'};
    }
    else{
      return {userStatus: user?.status, title: 'Welcome', body: 'Welcome back, ' + user?.name };
    }
  }

      // fetch All the users of org
  fetchAllUsers(queryObj){
    return this.db.getAllDocumentsSnapshotByQuery(this.db.allCollections.users, queryObj);
   }

    // User role change ADMIN to USER/EXTERNAL
    changeUserRole(data, newRole)
    {
      return this.db.setDocument(this.db.allCollections.users, data.id, {role: newRole}, true).then(() => {this.componentService.presentToaster('User role updated'); });
    }

    userDataUpdateTransection(data, whatToDo, orgProfile)
     {
      const subscriberRef = this.db.afs.firestore.collection(this.db.allCollections.subscribers).doc(orgProfile.subscriberId);
      const userRef = this.db.afs.firestore.collection(this.db.allCollections.users).doc(data.id);
      return this.db.afs.firestore.runTransaction(transaction => {
        return transaction.get(subscriberRef).then(function(subsDoc){
          // subscription data update
          const incrementObj = {noOfFreeLicense: this.db.frb.firestore.FieldValue.increment(+1)};
          const decrementObj = {noOfFreeLicense: this.db.frb.firestore.FieldValue.increment(-1)};
          if (this.decrementStatus.includes(whatToDo) && data.status !== 'REGISTERED'){
            this.db.setTransactDocument(transaction, subscriberRef, incrementObj, true);
          }else if (this.incrementStatus.includes(whatToDo)){ // && data.status !== 'REGISTERED'){
            this.db.setTransactDocument(transaction, subscriberRef, decrementObj, true);
          // }else if(this.incrementStatus.includes(whatToDo) && data.status !== 'REGISTERED'){
          //   this.db.setTransactDocument(transaction, subscriberRef,incrementObj,true);
          }else{
            // no need
          }
          // user data update
          this.db.setTransactDocument(transaction, userRef, {status: whatToDo}, true);
        }.bind(this)); // end of transaction callback
     }); // end of runTransaction
  }

  processAuthData(userData){
    const { displayName, email, phoneNumber } = userData.providerData[0];
    let uid = userData.uid;
    console.log("authUserData", userData);
    let newuseruids = {
      uid: uid,
      name: displayName,
      email,
      phoneNumber: phoneNumber ? phoneNumber : '',
      lastAccessTimeStamp: this.db.frb.firestore.FieldValue.serverTimestamp()
    };
    this.db.setDocument(
      this.db.allCollections.useruids,
      uid,
      newuseruids,
      true
    );
  }
}
