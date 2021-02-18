import { Injectable } from '@angular/core';
import { DatabaseService } from '../database/database.service';
import { User } from '../../interface/user';
import { ComponentsService } from '../components/components.service';
import { SendEmailService } from '../send-email/send-email.service';

@Injectable({
  providedIn: 'root'
})
export class ManageuserService {
  public incrementStatus:any = ['All','ACTIVE','REGISTERED'];
  public decrementStatus:any = ['SUSPENDED','REJECTED','LEAVER'];
  public newUser = {
                      uid: '',
                      subscriberId: '',
                      name: '',
                      email: '',
                      phoneNumber: '',
                      appRole: '',
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
    private componentService:ComponentsService,
    private sendEmailService:SendEmailService
  ) {
    // TBA
  }
  getProfile(uid:string){
    return this.db.getAllDocumentsSnapshotByQuery(this.db.allCollections.users, [{field: 'uid',operator: '==', value: uid}]);
  }
  updateProfile(docId:string, userProfile:User){
    return this.db.setDocument(this.db.allCollections.users, docId, userProfile);
  }

  checkUser(user){
    return new Promise((res,rej)=>{
    if(user?.status != 'ACTIVE'){
      console.log('not active user');
      return rej(false);
    }
    else{
      console.log('active user');
      return res(true);
    }

    })
    }
  
      // fetch All the users of org
    fetchAllUsers(orgProfile){
      let queryObj = [
        {
          field:'subscriberId',
          operator:'==',
          value:orgProfile.subscriberId

        }
      ]
    return this.db.getAllDocumentsSnapshotByQuery(this.db.allCollections.users,queryObj);
    }

    // User role change ADMIN to USER/EXTERNAL
    changeUserRole(data, newRole)
    {
      return this.db.setDocument(this.db.allCollections.users,data.id,{'role':newRole},true).then(()=>{this.componentService.presentToaster('User role updated')})
    }

    userDataUpdateTransection(data, whatToDo,orgProfile)
     {
      const subscriberRef = this.db.afs.firestore.collection(this.db.allCollections.subscribers).doc(orgProfile.subscriberId);
      const userRef = this.db.afs.firestore.collection(this.db.allCollections.users).doc(data.id);
      return this.db.afs.firestore.runTransaction(transaction =>{
        return transaction.get(subscriberRef).then(function(subsDoc){
          // subscription data update
          let incrementObj = {'noOfFreeLicense': this.db.frb.firestore.FieldValue.increment(+1)};
          let decrementObj = {'noOfFreeLicense': this.db.frb.firestore.FieldValue.increment(-1)};
          if(this.decrementStatus.includes(whatToDo) && data.status !== 'REGISTERED'){
            this.db.setTransactDocument(transaction, subscriberRef,incrementObj,true);
          }else if(this.incrementStatus.includes(whatToDo) && data.status !== 'REGISTERED'){
            this.db.setTransactDocument(transaction, subscriberRef,decrementObj,true);
          }else if(this.incrementStatus.includes(whatToDo) && data.status !== 'REGISTERED'){
            this.db.setTransactDocument(transaction, subscriberRef,incrementObj,true);
          }else{
            // no need
          }
          // user data update
           this.db.setTransactDocument(transaction, userRef, {'status': whatToDo},true);
        }.bind(this)); // end of transaction callback
     }); // end of runTransaction
  }  
}