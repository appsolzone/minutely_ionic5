import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
})
@Autounsubscribe()
export class TaskPage implements OnInit,OnDestroy {
  // observables
  sessionSubs$;
  allTasks$;
  kpi$;

  userData: any;
  allProfiles: any[];
  userProfile: User;
  orgProfile:any =null;

  allTasks:any;
  kpiData:any;
  activeSearch:boolean = false;


  searchTexts:any = '';
  searchEmptyTexts:any;
  searchEmptyObj = SearchText;
  searchType = 'all';
  searchService:any;
  allSearchresult:any;
  searchServ:any;

  constructor(
    private _router:Router,
    private _crud:CrudService,
    private _session:SessionService,
    private _db:DatabaseService,
    private _componentService:ComponentsService,
    private _kpi:KpiService
  ) { }

  ngOnInit() {
    this.getSessionInfo();
    this.fetchAllTasks();
  }

  ngOnDestroy(){}

  ionViewWillEnter(){
      this._crud.crud_action$.next(undefined);
  }
  getSessionInfo(){
    this.sessionSubs$ = this._session.watch().subscribe(value=>{
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
     service:'Task',
     type:'create',
     parentModule:'task',
     header:'Create new task',
     object:this._crud.passingObj
   } 
   this._crud.crud_action$.next(actions);
   this._router.navigate(['/task/initiate']);
  }

  fetchAllTasks(){
    
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
      field:'taskStatus',
      operator:'in',
      value:['OPEN','INPROGRESS']
    }
    ]
    this.returnObservable(queryObj);
    this.kpi$ = this._kpi.getKpiData(this.orgProfile.subscriberId).subscribe(res=>this.kpiData=res);
  }

  // search the risks
  async searchMood(toggled:boolean){
    if(toggled){
    this.searchType = this.searchType == 'any'?'all':'any';
    }

    let searchTextObj = null;
    let queryObj = [];
    if(this.allTasks$ ?.unsubscribe){
      await this.allTasks$ .unsubscribe();
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
  this.allTasks = [];  
  this._componentService.showLoader();  
  this.allTasks$ = this._crud.fetchAllServices(this._db.allCollections.task,queryObj,searchTextObj).
   pipe(
    map((a:any[])=>{
        return a.map((b:any)=>{
         let id = b.payload.doc.id;
         let data = b.payload.doc.data();
         
          data.docId = id;
          data.targetCompletionDate = moment(data.targetCompletionDate.seconds*1000).format('ll');
          data.actualCompletionDate =  data.actualCompletionDate ? moment(data.actualCompletionDate.seconds*1000).format('ll') : moment(data.targetCompletionDate.seconds*1000).format('ll');
          data.taskInitiationDate = moment(data.taskInitiationDate.seconds*1000).format('ll');
          data.overdue =  data.taskStatus != 'RESOLVED' && new Date(data.targetCompletionDate.seconds*1000 + 23.9*3600000) < new Date(moment().format('YYYY-MM-DD')) ? 'overdue' : '';
         return {
            id: id,
            ...data
        };
       })
     })
   )
   .subscribe(res=>{
    this.allTasks = res;
    console.log('all risks are :',this.allTasks);
    this._componentService.hideLoader();
   });
  }



  //search page navigate
  toggleSearch(goToPage:boolean = false){
    this.activeSearch = !this.activeSearch;
    let searchService = 'risk';
    this._crud.search_action$.next(searchService); 
    if(goToPage){ 
     this._router.navigate(['/task/search']);
    }
    if(!this.activeSearch){
     this.fetchAllTasks();
    }
  }
}
