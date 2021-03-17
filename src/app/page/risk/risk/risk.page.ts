import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { User } from 'src/app/interface/user';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { CrudService } from 'src/app/shared/crud/crud.service';
import { DatabaseService } from 'src/app/shared/database/database.service';
import { SearchText } from 'src/app/shared/empty-screen-text/empty-screen-text';
import { KpiService } from 'src/app/shared/kpi/kpi.service';
import { SessionService } from 'src/app/shared/session/session.service';
import { ModalPagePage } from '../../modal-page/modal-page.page';

@Component({
  selector: 'app-risk',
  templateUrl: './risk.page.html',
  styleUrls: ['./risk.page.scss'],
})
@Autounsubscribe()
export class RiskPage implements OnInit,OnDestroy {
  // observables
  sessionSubs$;
  allRisks$;
  kpi$;

  userData: any;
  allProfiles: any[];
  userProfile: User;
  orgProfile:any =null;

  allRisks:any;
  kpiData:any;
  activeSearch:boolean = false;


  searchTexts:any = '';
  searchEmptyTexts:any;
  searchEmptyObj = SearchText;
  searchType = 'all';
  searchService:any;
  allSearchresult:any;
  searchServ:any;

  result:string|null = null;
  constructor(
    private _router:Router,
    private _crud:CrudService,
    private _session:SessionService,
    private _db:DatabaseService,
    private _componentService:ComponentsService,
    private _kpi:KpiService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.getSessionInfo();
    this.fetchAllRisks();
  }

  ngOnDestroy(){}

  ionViewWillEnter(){
      this._crud.crud_action$.next(undefined);
  }
  getSessionInfo(){
    this.sessionSubs$ = this._session.watch().subscribe(value=>{
      console.log("testing :",value?.userProfile?true:false);
       if(value?.userProfile){
       // Nothing to do just display details
       // Re populate the values as required
       this.userProfile = value?.userProfile;
       this.orgProfile = value?.orgProfile;
       } else {
          this._router.navigate(['profile']);
       }
     });
  }
  naviageteAddPage(){
   let actions = this._crud.crud_action; 
   actions = {
     service:'Risk',
     type:'create',
     parentModule:'risk',
     header:'Create new risk',
     object:this._crud.passingObj
   } 
   this._crud.crud_action$.next(actions);
   this._router.navigate(['/risk/initiate']);
  }

  fetchAllRisks(){
    
     let queryObj = [{
      field:'subscriberId',
      operator:'==',
      value:this.orgProfile.subscriberId
     },
    {
      field:'ownerInitiatorUidList',
      operator:'array-contains',
      value:this.userProfile.uid
    },
    {
      field:'riskStatus',
      operator:'in',
      value:['OPEN','INPROGRESS']
    }
    ]
    this.returnObservable(queryObj);
    this.kpi$ = this._kpi.getKpiData(this.orgProfile.subscriberId).subscribe(res=>{this.kpiData=res;console.log(this.kpiData=res)});
  }

  // search the risks
  async searchMood(toggled:boolean){
    if(toggled){
    this.searchType = this.searchType == 'any'?'all':'any';
    }

    let searchTextObj = null;
    let queryObj = [];
    if(this.allRisks$ ?.unsubscribe){
      await this.allRisks$ .unsubscribe();
    }

    if(this.userProfile?.uid && this.orgProfile?.subscriberId){
      const {subscriberId, uid} = this.userProfile;
      queryObj = [
                  {field: 'subscriberId',operator: '==', value: subscriberId},
                  ];
      if(this.searchTexts.trim()!='' && this.searchTexts.trim().length>=2){
        searchTextObj = {seachField: 'titleSearchMap', text: this.searchTexts.trim(), searchOption: this.searchType};
      }
      this.returnObservable(queryObj,searchTextObj);

    } else {
      // console.log("else part");
    }
  }
  

  // return the result of observable

  returnObservable(queryObj,searchTextObj=null){
  this.allRisks = [];  
  this._componentService.showLoader();  
  this.allRisks$ = this._crud.fetchAllServices(this._db.allCollections.risk,queryObj,searchTextObj).
   pipe(
    map((a:any[])=>{
        return a.map((b:any)=>{
         let id = b.payload.doc.id;
         let data = b.payload.doc.data();
         
          data.docId = id;
          data.targetCompletionDate = moment(data.targetCompletionDate.seconds*1000).format('ll');
          data.actualCompletionDate =  data.actualCompletionDate ? moment(data.actualCompletionDate.seconds*1000).format('ll') : moment(data.targetCompletionDate.seconds*1000).format('ll');
          data.riskInitiationDate = moment(data.riskInitiationDate.seconds*1000).format('ll');
          data.overdue =  data.riskStatus != 'RESOLVED' && new Date(data.targetCompletionDate.seconds*1000 + 23.9*3600000) < new Date(moment().format('YYYY-MM-DD')) ? 'overdue' : '';
         return {
            id: id,
            ...data
        };
       })
     })
   )
   .subscribe(res=>{
    this.allRisks = res;
    console.log('all risks are :',this.allRisks);
    this._componentService.hideLoader();
   });
  }



  //search page navigate
  toggleSearch(goToPage:boolean = false){
    this.activeSearch = !this.activeSearch;
    let searchService = 'risk';
    this._crud.search_action$.next(searchService); 
    if(goToPage){ 
     this._router.navigate(['/risk/search']);
    }
    if(!this.activeSearch){
     this.fetchAllRisks();
    }
  }


  //go to details page 
  goToDetailsPage(data:object):void{
   this._crud.detailsPagePasing$.next(data);
   this._router.navigate(['/risk/details']);
  }



  async openModal(){
   const modal = await this.modalController.create({
    component: ModalPagePage,
    cssClass: 'my-custom-class',
    componentProps: {
      data: 'Hellow Arnab',
    }
  });
  modal.onDidDismiss()
      .then((data) => {
        const result = data; // Here we get data
        console.log('Modal back result',result);
        this.result = result.data.data;
    });
  return await modal.present();
  
}
}
