import { Injectable } from '@angular/core';
import { CanLoad, CanActivate, Route, Router, ActivatedRouteSnapshot,  RouterStateSnapshot } from '@angular/router';
import { AclService } from 'src/app/shared/acl/acl.service';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { SessionService } from 'src/app/shared/session/session.service';



@Injectable()
@Autounsubscribe()
export class AuthguardService implements CanActivate, CanLoad {
  // observables
  sessionSubs$;
  url: string;
  sessionInfo: any;
  userProfile: any;
  orgProfile: any;
  aclPermission: any;
  userRole: any;
  permission: any;
  msgDescription: any;
  AclToggleValue: boolean=false;
  redirectPath: any;
  aclDetails: void | any[];
  constructor(
    private router: Router,
    private session: SessionService,
    private ComponentsService: ComponentsService,
    private Acl:AclService
  ) {

    this.sessionSubs$ = this.session.watch().subscribe(value=>{
      console.log("authguard Session Subscription got", value, this.url);
      // Re populate the values as required
      this.sessionInfo = value;
      this.userProfile = value?.userProfile;
       this.orgProfile = value?.orgProfile;
       this.userRole = value?.userProfile?.role;
       this.permission = value?.orgProfile?.ACL;
       this.AclToggleValue = value?.orgProfile?.settings?.ACL


      // if(!this.userProfile){
      //   this.router.navigate(['profile']);
      // }
      // else{
      //    this.canActivateOnGo();
      // }
    });
  }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // If the ACL check is not activated then anyone can visit any end point
    if(this.AclToggleValue == false){
      return true;
    }

    let url: string = route.routeConfig.path;
    console.log('CanLoadService canActivate Url:', url, route);
    // if (url=='admin') {
    //   alert('You are not authorised to visit this page');
    //   return false;
    // }

    //det
    this.url = url;

    return true; // this should the value of access
  }

  canLoad(route: Route): boolean {

    let url: string = route.path;
    console.log('CanLoadService Url:'+ url);
    // if (url=='admin') {
    //   alert('You are not authorised to visit this page');
    //   return false;
    // }

    //det
    this.url = url;

    return true; // this should the value of access
  }


//   async  canActivateOnGo() {
//
//     if(this.AclToggleValue == false){
//       return true;
//     }
//     else{
//
//       var parts = this.router.url.split('/',3);
//       const lastItem = parts[parts.length - 1]
//
//
//       await this.Acl.pageAccessCheck(lastItem, this.permission, this.userRole).then(val=>{
//         console.log('return val from service', val);
//         this.aclDetails = val
//             })
//
//
//             console.log('return permission',this.aclDetails)
//
//             if(this.aclDetails[0] == false){
//
//               let title="Access Denied";
//               let body = this.aclDetails[1]
//               let buttons: any[] = [
//                               {
//                                 text: 'Dismiss',
//                                 role: 'cancel',
//                                 cssClass: '',
//                                 handler: ()=>{}
//                               }
//                             ];
//
//                 this.ComponentsService.presentAlert(title,body,buttons)
//                 this.router.navigate([this.aclDetails[2]])
//
//             }
//
//
//             return this.aclDetails[0]; // this should the value of access
//
//   }
//   }
//   async  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
//     //return true;
//
//     if(this.AclToggleValue == false){
//       return true;
//     }
//     else{
//     let url: string = route.routeConfig.path;
//     console.log('canActivate Url:', url, route);
//
//     this.url = url;
//
//     await this.Acl.pageAccessCheck(this.url, this.permission, this.userRole).then(val=>{
//       console.log('return val from service', val);
//       this.aclDetails = val
//           })
//
//
//           console.log('return permission',this.aclDetails)
//
//           if(this.aclDetails[0] == false){
//
//             let title="Access Denied";
//             let body = this.aclDetails[1]
//             let buttons: any[] = [
//                             {
//                               text: 'Dismiss',
//                               role: 'cancel',
//                               cssClass: '',
//                               handler: ()=>{}
//                             }
//                           ];
//
//               this.ComponentsService.presentAlert(title,body,buttons)
//               this.router.navigate([this.aclDetails[2]])
//
//
//           }
//
//
//           return this.aclDetails[0]; // this should the value of access
//   }
//
//   }
//
//
//
//
//
//
//
//    async canLoad(route: Route) {
//
//     if(this.AclToggleValue == false){
//       return true;
//
//     }
//     else{
//
//     let url: string = route.path;
//     console.log('CanLoadService Url:'+ url);
//
//     this.url = url;
//
// await this.Acl.pageAccessCheck(this.url, this.permission, this.userRole).then(val=>{
// console.log('return val from service', val);
// this.aclDetails = val
//     })
//
//
//     console.log('return permission',this.aclDetails)
//
//     if(this.aclDetails[0] == false){
//
//       let title="Access Denied";
//       let body = this.aclDetails[1]
//       let buttons: any[] = [
//                       {
//                         text: 'Dismiss',
//                         role: 'cancel',
//                         cssClass: '',
//                         handler: ()=>{}
//                       }
//                     ];
//
//         this.ComponentsService.presentAlert(title,body,buttons)
//         this.router.navigate([this.aclDetails[2]])
//
//
//     }
//
//
//     return this.aclDetails[0]; // this should the value of access
//   }
//   }
//
//   permissionCheck(permission, role, url){
//
//     this.msgDescription = permission[role]['permission'][url]['description']
//     this.redirectPath = permission[role]['permission'][url]['redirectPath']
//     console.log('url url', url)
//
//     return  permission[role]['permission'][url]['access'];
//
//   }

}
