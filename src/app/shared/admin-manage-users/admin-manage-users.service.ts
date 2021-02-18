import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ComponentsService } from '../components/components.service';
import { DatabaseService } from '../database/database.service';
import { SendEmailService } from '../send-email/send-email.service';

@Injectable({
  providedIn: 'root'
})
export class AdminManageUsersService {
  public newMemberAddRoles:any = ['USER','ADMIN'];
  public incrementStatus:any = ['All','ACTIVE','REGISTERED'];
  public decrementStatus:any = ['SUSPENDED','REJECTED','LEAVER']
  constructor(
    private db:DatabaseService,
    private componentService:ComponentsService,
    private sendEmailService:SendEmailService
  ) { }
    // fetch All the users of org
  fetchAllUsers(orgProfile){
    let queryObj = [
      {
        field:'subscriberId',
        operator:'==',
        value:orgProfile.subscriberId

      }
    ]
   return this.db.getAllDocumentsSnapshotByQuery(this.db.allCollections.users,queryObj)
      .pipe(
        map((actions: any[]) => actions.map((a: any) => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      )
  }

  // User role change ADMIN to USER/EXTERNAL
  changeUserRole(data, newRole)
  {
    return this.db.setDocument(this.db.allCollections.users,data.id,{'role':newRole},true).then(()=>{this.componentService.presentToaster('User role updated')})
  }

  batchPerform(data, whatToDo,orgProfile){
    this.componentService.showLoader();
    const batch = this.db.afs.firestore.batch();

    // update in the user collection of this user
    let userRef = this.db.afs.collection(this.db.allCollections.users).doc(data.id).ref;
    batch.update(userRef,{
      'status': whatToDo,
      'isExternal':  (whatToDo=="EXTERNAL") ? true : false,
    })

    // update of organization licenses
    let noOfFreeLicense = 0;

    let subRef = this.db.afs.collection(this.db.allCollections.subscribers).doc(orgProfile.subscriberId).ref;
    if(this.decrementStatus.includes(whatToDo) && data.status !== 'REGISTERED')
    {
      batch.update(subRef,{
        'noOfFreeLicense': this.db.frb.firestore.FieldValue.increment(+1),
      })
    }else if(this.incrementStatus.includes(whatToDo) && data.status !== 'REGISTERED'){
      batch.update(subRef,{
        'noOfFreeLicense': this.db.frb.firestore.FieldValue.increment(-1),
      })
    }else if(this.incrementStatus.includes(whatToDo) && data.status !== 'REGISTERED'){
      batch.update(subRef,{
        'noOfFreeLicense': this.db.frb.firestore.FieldValue.increment(+1),
      })
    }else{
      // no need
      batch.update(subRef,{
        'noOfFreeLicense': this.db.frb.firestore.FieldValue,
      })
    }

    batch.commit().then(()=>{
       this.componentService.hideLoader();
       this.componentService.presentToaster('User role updated')
    }).catch(err =>{
       this.componentService.hideLoader();
       this.componentService.presentAlert("Error",err);

    })
  }
}
