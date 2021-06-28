import { Injectable } from '@angular/core';
import { CanLoad, CanActivate, Route, Router, ActivatedRouteSnapshot,  RouterStateSnapshot } from '@angular/router';
import { AclService } from 'src/app/shared/acl/acl.service';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { SessionService } from 'src/app/shared/session/session.service';


@Injectable({
  providedIn: 'root'
})
@Autounsubscribe()
export class AuthguardService implements CanActivate, CanLoad {
  // observables
  // observables
  sessionSubs$;
  sessionInfo: any;
  url: string;
  permission: any = {};
  constructor(
    private router: Router,
    private session: SessionService,
    private common: ComponentsService,
  ) {

    this.sessionSubs$ = this.session.watch().subscribe(value=>{
      console.log("authguard Session Subscription got", value, this.url);
      // Re populate the values as required
      this.sessionInfo = value;
      if(!this.sessionInfo?.userProfile){
        this.router.navigate(['profile']);
      }
    });
  }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    let url: string = route.routeConfig.path;
    this.permission = {};
    this.url = url;
    console.log('CanLoadService canActivate Url:', url, route);    
    const {features} = (this.sessionInfo?.permissions ? this.sessionInfo?.permissions : {features: {}});
    if(url){
      if (features[url]){
        this.permission = {...features[url] };
      } else {
        this.permission = {access: false};
      }
      // if (url=='admin') {
      //   alert('You are not authorised to visit this page');
      //   return false;
      // }

      //det
      if(!this.permission.access && this.sessionInfo?.userProfile){
        // this.presentAccessDenied();
        this.router.navigate(['access-denied/'+this.url], {state:{data:{url: this.url, permission: this.permission}}});
      }

      return this.permission.access; // this should the value of access
    } else {
      return true;
    }

  }

  canLoad(route: Route): boolean {

    let url: string = route.path;
    this.permission = {};
    this.url = url;
    console.log('CanLoadService Url:'+ url);
    const {features} = (this.sessionInfo?.permissions ? this.sessionInfo?.permissions : {features: {}});
    if(url){
      if (features[url]){
        this.permission = {...features[url] };
      } else {
        this.permission = {access: false};
      }
      // if (url=='admin') {
      //   alert('You are not authorised to visit this page');
      //   return false;
      // }

      //det
      if(!this.permission.access && this.sessionInfo?.userProfile){
        // this.presentAccessDenied();
        this.router.navigate(['access-denied/'+this.url],{state:{data:{url: this.url, permission: this.permission}}});
      }

      return this.permission.access; // this should the value of access
    } else {
      return true;
    }

  }

  presentAccessDenied(){
    this.common.presentAlert(
      'Access denied',
      'Please note that you can not access ' + (this.permission.moduleName ? this.permission.moduleName : this.url) +
      ' page at present. Contact your system administrator to grant permission if you require access for '  + (this.permission.moduleName ? this.permission.moduleName : this.url) + ' page.',
      [
         {
          text: 'Dismiss',
          role: 'error',
          cssClass: 'error-button',
          handler: () => {
            console.log('Confirm Ok');
          }
        }
      ]
    )
  }

}
