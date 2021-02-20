import { Injectable } from '@angular/core';
import { DatabaseService } from '../database/database.service';
import { User } from '../../interface/user';

@Injectable({
  providedIn: 'root'
})
export class ManageuserService {
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
  ) {
    // TBA
  }
  getProfile(uid:string){
    return this.db.getAllDocumentsSnapshotByQuery(this.db.allCollections.users, [{field: 'uid',operator: '==', value: uid}]);
  }
  updateProfile(docId:string, userProfile:User){
    return this.db.setDocument(this.db.allCollections.users, docId, userProfile);
  }

  checkUser(user: any){
    if(user?.status != 'ACTIVE'){
      return {userStatus: user?.status, title: 'No access', body: 'Your account seems to be inactive, Please contact the administrator'};
    }
    else{
      return {userStatus: user?.status, title: 'Welcome', body: 'Welcome back, ' + user?.name };
    }
  }
}
