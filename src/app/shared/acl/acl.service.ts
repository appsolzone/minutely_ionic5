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
    private componentsService: ComponentsService,
    private router: Router
  ) { }

  getRoleData(subscriberId){
    return this.db.getDocumentSnapshotById(this.db.allCollections.subscribers, subscriberId);
  }
    updateRole(subscriberId, queryObj){
      this.db.updateDocument(this.db.allCollections.subscribers, subscriberId, queryObj);

    }

     async pageAccessCheck(url, permission, userRole){
      return  this.permissionCheck(permission, userRole, url).then(feed => {
        console.log('return0005', feed);
        // let aclPermission = feed;
        return feed;



      }).catch(err => {
        console.log('return error005', false);



        Object.keys(permission[userRole].permission).forEach(ftrKey => {
          Object.keys(permission[userRole].permission[ftrKey].features).forEach(ftrKey2 => {
          if (ftrKey2 == url){
            this.aclPermission = permission[userRole].permission[ftrKey].features[url].access;
            this.msgDescription = permission[userRole].permission[ftrKey].features[url].description;
            this.redirectPath = permission[userRole].permission[ftrKey].features[url].redirectPath;


          }
         });
        });
        return [this.aclPermission, this.msgDescription, this.redirectPath];


      //  console.log('last data', aclPermission)


      });
     }




     updateAclMode(e, subscriberId, dataObj){
       this.db.updateDocument(this.db.allCollections.subscribers, subscriberId, dataObj);
     }


     async permissionCheck(permission, role, url){

      const msgDescription = permission[role].permission[url].description;
      const redirectPath = permission[role].permission[url].redirectPath;
      console.log('url url', url);

      return [permission[role].permission[url].access, msgDescription, redirectPath] ;

    }


    getFreeUserAclKpi(subscriberId){
      return this.db.getDocumentSnapshotById(this.db.allCollections.aclKpi, subscriberId);
    }
}
