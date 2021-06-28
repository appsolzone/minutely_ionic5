import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from './../../shared/database/database.service';
import { ComponentsService } from 'src/app/shared/components/components.service';

@Injectable({
  providedIn: 'root'
})
export class AclService {
  pageAccess: any;
  pageEditAccess: any;
  aclPermission: any;
  msgDescription: any;
  redirectPath: any;

  constructor(
    private db: DatabaseService,
    private common: ComponentsService,
    private router: Router
  ) { }

  getRoleData(queryObj:any[] = [], textSearchObj = null){
    // return this.db.getDocumentSnapshotById(this.db.allCollections.subscribers, subscriberId);
    return this.db.getAllDocumentsSnapshotByQuery(
      this.db.allCollections.roles,
      queryObj,
      textSearchObj
    );
  }

  async saveRole(roleObj){
    const subscriberRef = this.db.afs.firestore
      .collection(this.db.allCollections.subscribers)
      .doc(roleObj.data.subscriberId);
    return this.db.afs.firestore.runTransaction((transaction) => {
      return transaction.get(subscriberRef).then(async (subsDoc) => {
        if (subsDoc.exists) {
          // since we have the subscriber doc
          let subscriberData = subsDoc.data();
          let roles = subscriberData.settings?.roles ? subscriberData.settings?.roles : [];
          // Hardcoded system roles ADMIN and USER here to avoid any duplicate role created by the same name
          // roles = ['ADMIN','USER', ...roles];
          let roleRef: any;
          console.log("subscriberData.settings", roleObj.data.roleName, roles, subscriberData.settings, subscriberData);
          let idx = ['ADMIN','USER', ...roles].findIndex(r=>r.toLowerCase()==roleObj.data.roleName.toLowerCase());
          if(idx != -1 && !roleObj.id){
            return {status: 'error', title: 'Role exists', msg: 'Another role exists with the same role name "'+ roleObj.data.roleName +'". Please change the role name and try again.'}
          } else {

            if(!roleObj.id){
              roles.push(roleObj.data.roleName);
              let newroleObj = await this.db.generateDocuemnetRef(this.db.allCollections.roles);
              roleRef = newroleObj.ref;
            } else {
              roleRef = this.db.afs.firestore
                .collection(this.db.allCollections.roles)
                .doc(roleObj.id);
            }

            transaction.set(roleRef,roleObj.data);

            transaction.set(subscriberRef, {settings:{roles: roles}},{merge: true})
          }

        }
      })
    });
  }
}
