import { AclService } from 'src/app/shared/acl/acl.service';
import { ComponentsService } from 'src/app/shared/components/components.service';
import {
  Directive,
  Input,
  ElementRef,
  HostListener,
  Output,
  EventEmitter,
} from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../../shared/session/session.service';

@Directive({
  selector: '[appFeatureCheck]',
})
export class FeatureCheckDirective {
  @Input() permissionId;
  @Input() featureIdList;
  @Output() featureClick = new EventEmitter<any>();
  permission: any;
  feature: any;
  sessionSubs$: any;
  sessionInfo: any;
  userProfile: any;
  orgProfile: any;
  userRole: any;
  aclPermission: any;
  msgDescrition: any;
  AclToggleValue: any;
  kpiData: unknown;
  componentAccess = false;

  // constructor() {
  //   console.log("feature value", this.feature, this.featureClick)

  // }
  constructor(
    private router: Router,
    private session: SessionService,
    private ComponentsService: ComponentsService,
    private aclKpi: AclService
  ) {
    this.sessionSubs$ = this.session.watch().subscribe((value) => {
      console.log(
        'featurecheck Session Subscription got',
        value,
        this.feature?.access
      );
      // Re populate the values as required
      this.sessionInfo = value;
      this.userProfile = value?.userProfile;
      this.orgProfile = value?.orgProfile;
      this.userRole = value?.userProfile?.role;
      this.permission = value?.orgProfile?.ACL;
      this.AclToggleValue = value?.orgProfile?.settings?.ACL;

      // if (!this.sessionInfo) {
      //   this.router.navigate(["profile"]);
      // }
    });
  }

  @HostListener('click', ['$event'])

  // on click HostListener to check permission and propagate with actions as defined
  async onClick(e) {

    const element = e.target;
    console.log('feature', this.feature, e, element, this.featureClick);

    if (this.isAclAccessNotAllowed() || this.isKpiAclLimitExhausted()){
      return false;
    } else {
      this.featureClick.emit();
    }
    return true; // !!this.feature?.access;

  }

  // This function check kpi free acl limit for a feature
  isAclAccessNotAllowed(){
    return this.featureIdList.some(featureId => {
      // Now check the feature id
      // This is to be implemented once the role is implemented
      const feature = {access: true, description: 'No message available', redirectPath: null};
      const {access, description, redirectPath} = feature;
      console.log('isAclAccessAllowed', this.featureIdList, access, description, redirectPath);
      if (!access){
        const msg = description;
        const redirectionObj = {
          text: 'Ok',
          redirectPath: redirectPath ? redirectPath : '/'
        };
        this.showAlert(msg, redirectionObj);
      }
      // Now return false if access not allowed
      return !access;
    });
  }

  // This function check kpi free acl limit for a feature
  isKpiAclLimitExhausted(){
    const {aclFreeLimitKpi} = this.sessionInfo;
    return this.featureIdList.some(featureId => {
      const feature = aclFreeLimitKpi[featureId];
      const freeLimit = feature?.freeLimit!=null ?  feature?.freeLimit : -1;
      const usedLimit = feature?.usedLimit!=null ?  feature?.usedLimit : 0;
      const isWithinLimit = freeLimit == -1 ? true : freeLimit > usedLimit;
      console.log('isWithinKpiAclLimit', this.featureIdList, isWithinLimit, feature);
      if (!isWithinLimit){
        const msg = feature?.description;
        const redirectionObj = {
          text: 'Upgrade',
          redirectPath: feature?.redirectPath ? feature?.redirectPath : '/'
        };
        this.showAlert(msg, redirectionObj);
      }
      return !isWithinLimit;
    });

  }

  // Permission check for access through access check layer
  async showAlert(msg: string= '', redirectionObj: any = null) {
    const title = 'Warning';
    const body = msg;
    const buttons: any[] = [
                    {
                      text: 'Dismiss',
                      role: 'cancel',
                      cssClass: '',
                      handler: () => {}
                    }
                  ];
    if (redirectionObj){
      const redirectionButton = {
        text: redirectionObj.text,
        role: '',
        cssClass: '',
        handler: () => { this.router.navigate([redirectionObj.redirectPath]); }
      };
      buttons.push(redirectionButton);
    }

    this.ComponentsService.presentAlert(title, body, buttons);
  }
}
