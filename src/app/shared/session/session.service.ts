import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Plugins } from '@capacitor/core';
import * as moment from 'moment';
import { AuthenticationService } from '../authentication/authentication.service';
import { ManageuserService } from '../manageuser/manageuser.service';
import { SubscriberService } from '../subscriber/subscriber.service';
// import { Subscriber } from '../../../interface/subscriber';
// import { User } from '../../../interface/user';
import { PlanService } from '../plan/plan.service';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { KpiService } from '../kpi/kpi.service';

const { Storage, Geolocation, Network } = Plugins;

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  session$ = new BehaviorSubject<any | undefined>(undefined);
  // Observable
  getProfileSubs$;
  getSubscriberSubs$;
  getPlanSubs$;
  getFreeLimitKpiSubs$;
  // network handler
  handler;

  constructor(
    private auth: AuthenticationService,
    private user: ManageuserService,
    private subscriber: SubscriberService,
    private plan: PlanService,
    private componentService: ComponentsService,
    private aclKpi: KpiService
  ) {
    // initialise
    this.session$.next(undefined);
    // Get the current network status
    this.setNetworkStatus();
    // network status check listener
    this.handler = Network.addListener('networkStatusChange', async (status) => {
      // console.log("Network status changed", status);
      // this.patch({networkStatus: status});
      // if(!this.peek().networkStatus.connected){
      if (!status.connected) {
        await componentService.showLoader(
          'Please check network connection, you are currently offline.'
        );
      } else {
        setTimeout(() => componentService.hideLoader(), 300);
      }
    });
  }

  async setNetworkStatus() {
    const status = await Network.getStatus();
    // console.log("networkstatus", status);
    this.patch({ networkStatus: status });
  }

  // subscribe user profile database
  // this should be called inside authState call back before setting the subscriber/sessionInfo
  async getProfiles(uid) {
    // clear the existing session$ values as we have logged in using a new uid
    this.clear();
    // if any residual subscription, unsubscribe it
    if (this.getProfileSubs$?.unsubscribe) {
      await this.getProfileSubs$.unsubscribe();
    }

    this.getProfileSubs$ = this.user.getProfile(uid).subscribe(async (up) => {
      const allProfiles = up.map((a: any) => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, data };
      });
      // lets set the userProfile
      const { data, id } = this.getUserProfile(null, allProfiles);
      // let coordinates = await this.getCurrentPosition();
      console.log('all profile userprofile', allProfiles, data, id);
      // lets patch the allprofiles data for session$
      // this.patch({ uid, coordinates, userProfile: data, userProfileDocId: id, allProfiles });
      this.patch({ uid, userProfile: data, userProfileDocId: id, allProfiles });
    });
  }

  // get user profile
  getUserProfile(subscriberId: string = null, allProfiles: any = null) {
    const sessionInfo = this.peek();
    subscriberId = subscriberId ? subscriberId : sessionInfo?.subscriberId;
    allProfiles = allProfiles ? allProfiles : sessionInfo?.allProfiles;
    if (sessionInfo?.uid && subscriberId) {
      const userProfile = allProfiles.filter(
        (p) =>
          p.data.uid == sessionInfo?.uid && p.data.subscriberId == subscriberId
      );
      console.log('getUserProfile userProfile', userProfile);
      return userProfile[0];
    } else {
      return { id: undefined, data: undefined };
    }
  }

  // get User profile
  // post authState getprofile either user select the organisation i.e subscriberId,
  // or if its the oly organisation auto login using the subscriberId
  getSessionInfo(subscriberId) {
    if (!subscriberId || subscriberId == null || subscriberId == 'undefined') {
      // no user index so publish the data
    } else {
      this.getSubscriberProfile(subscriberId);
    }
  }

  // get subscriber data
  async getSubscriberProfile(subscriberId) {
    // check if the new subscriber id is selected or it is existing subscriber id
    if (subscriberId != this.peek()?.subscriberId) {
      if (this.getSubscriberSubs$?.unsubscribe) {
        await this.getSubscriberSubs$.unsubscribe();
      }
      if (this.getFreeLimitKpiSubs$?.unsubscribe) {
        // also unsubscribe the freeLimitKpi for the subscriber as we changed the subscriber
        await this.getFreeLimitKpiSubs$.unsubscribe();
      }
      // add Acl kpi doc if already not created
      // this.aclKpi.checkTheAclKpiExist(subscriberId);

      // kpi freelimit changed so fetch again
      this.getAclFreeLimitKpiData(subscriberId);

      this.getSubscriberSubs$ = this.subscriber
        .getSubscriber(subscriberId)
        .subscribe((sub) => {
          //// console.log("subscribed up", data.userData, this.userData);
          const allSubData = sub.map((a: any) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, data };
          });

          console.log('allSubData', allSubData);

          if (
            this.peek()?.orgProfile?.subscriptionType !=
            allSubData[0]?.data?.subscriptionType
          ) {
            // plan changed so fetch plan again
            this.getSubscriptionPlan(subscriberId, allSubData[0].data);
          } else {
            // lets set the userProfile
            const { data, id } = this.getUserProfile(subscriberId);
            // // If the no of users changed update freelimit
            // if(this.peek()?.orgProfile?.noOfUserAllowed != allSubData[0]?.data?.noOfUserAllowed){
            //   // Lets set the freeKpiLimits according to the plan
            //   // let  planFreeLimit = Perform deep merge using lodash _.merge
            //   let planData = this.peek()?.orgPlan;
            //   if(planData?.planFreeLimit) {
            //     // limits are per user, so loop through and set it for the no of license the user have got
            //     let freeLimitObj:any = {};
            //     Object.keys(planData.planFreeLimit).forEach(fId=>{
            //       freeLimitObj[fId]={...planData.planFreeLimit[fId],
            //                         freeLimit: planData.planFreeLimit[fId].freeLimit ?
            //                                    planData.planFreeLimit[fId].freeLimit * allSubData[0]?.data?.noOfUserAllowed
            //                                    :
            //                                    null
            //                         }
            //     });
            //     this.aclKpi.setAclKpi(
            //                           subscriberId,
            //                           freeLimitObj
            //                         );
            //   }
            // }

            // plan has not changed so just patch the session data
            this.patch({
              subscriberId,
              userProfile: data,
              userProfileDocId: id,
              orgProfile: allSubData[0].data,
            });
          }
        });
    }
  }

  // get subscriber data
  async getSubscriptionPlan(subscriberId, orgProfile) {
    const { subscriptionType } = orgProfile;
    // console.log("getSubscriptionPlan",subscriptionType)
    if (this.peek()?.orgProfile?.subscriptionType != subscriptionType) {
      // unsubscribe any residual observables
      if (this.getPlanSubs$?.unsubscribe) {
        await this.getPlanSubs$.unsubscribe();
      }
      this.getPlanSubs$ = this.plan
        .getPlan(subscriptionType)
        .subscribe((sub) => {
          // console.log("subscribed up", data.userData, this.userData);
          const allPlanData = sub.map((a: any) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, data };
          });
          const currentSession = this.peek();
          // lets set the userProfile
          const { data, id } = this.getUserProfile(subscriberId);
          console.log('subscribed up', data, id);
          // // Lets set the freeKpiLimits according to the plan
          // // let  planFreeLimit = Perform deep merge using lodash _.merge
          // let planData = allPlanData[0]?.data;
          // if(planData?.planFreeLimit) {
          //   // limits are per user, so loop through and set it for the no of license the user have got
          //   let freeLimitObj:any = {};
          //   Object.keys(planData.planFreeLimit).forEach(fId=>{
          //     freeLimitObj[fId]={...planData.planFreeLimit[fId],
          //                       freeLimit: planData.planFreeLimit[fId].freeLimit ?
          //                                  planData.planFreeLimit[fId].freeLimit * orgProfile.noOfUserAllowed
          //                                  :
          //                                  null
          //                       }
          //   });
          //   this.aclKpi.setAclKpi(
          //                         subscriberId
          //                         ? subscriberId
          //                         : currentSession?.subscriberId,
          //                         freeLimitObj
          //                       );
          // }
          this.patch({
            subscriberId: subscriberId
              ? subscriberId
              : currentSession?.subscriberId,
            orgProfile: orgProfile ? orgProfile : currentSession?.orgProfile,
            orgPlan: allPlanData[0]?.data,
            userProfile: data,
            userProfileDocId: id,
          });
        });
    }
  }

  // get subscriber data
  async getAclFreeLimitKpiData(subscriberId) {
    // unsubscribe any residual observables
    if (this.getFreeLimitKpiSubs$?.unsubscribe) {
      await this.getFreeLimitKpiSubs$.unsubscribe();
    }

    this.getFreeLimitKpiSubs$ = this.aclKpi
      .getKpisByDocId(subscriberId)
      .subscribe((kpiDocs) => {
        const aclFreeLimitKpi = kpiDocs.payload.data();
        if (!aclFreeLimitKpi){
          // Lets set the freeKpiLimits according to the plan
          // let  planFreeLimit = Perform deep merge using lodash _.merge
          this.aclKpi.setAclKpi(
                                  subscriberId,
                                  null
                                );
        } else{
          // let aclFreeLimitKpi = kpiDocs.payload.data();
          console.log('getKpisByDocId amended value', aclFreeLimitKpi);
          const currentSession = this.peek();
          // lets set the userProfile
          // let { data, id } = this.getUserProfile(subscriberId);
          this.patch({
            aclFreeLimitKpi
          });
        }
      });
  }

  // get geolocation
  async getCurrentPosition() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      // console.log('Current', coordinates);
      return coordinates;
    } catch (error) {
      // this.componentService.presentAlert("Error","Please note that location can not be determined. Check location service is on and permission is given to the app from settings.");
      return undefined;
    }
  }

  watch() {
    return this.session$;
  }
  peek() {
    return this.session$.value;
  }
  patch(t) {
    const newSession = Object.assign({}, this.peek() ? this.peek() : {}, t);
    this.poke(newSession);
  }
  poke(t) {
    this.session$.next(t);
  }
  clear() {
    this.poke(undefined);
    this.setNetworkStatus();
  }
}
