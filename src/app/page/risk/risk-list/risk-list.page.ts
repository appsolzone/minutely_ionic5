import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { RiskService } from 'src/app/shared/risk/risk.service';
import { SessionService } from 'src/app/shared/session/session.service';

@Component({
  selector: 'app-risk-list',
  templateUrl: './risk-list.page.html',
  styleUrls: ['./risk-list.page.scss'],
})
@Autounsubscribe()
export class RiskListPage implements OnInit,OnDestroy {
  @Input() showOnlyUpcommingRisks: boolean = false;
  // observables
  sessionSubs$;
  risksSubs$;

  public showSearchModesforUpcomming: boolean = false;
  public sessionInfo: any;
  public searchText: string;
  public limit: any = 20;
  public activeSearchMode:boolean = false;
  public searchMode: string = 'all';
  public searchModeUser: string = 'user';
  public options: any;
  public viewRisksResult: any = [];
  // public dateRange:any = {
  //                           startDate: '',
  //                           endDate: ''
  //                         };
  public colorStack: any[];

  public activeSearch:boolean = false;
  // public searchTexts:any = '';

  constructor(
    private router:Router,
    private session: SessionService,
    private riskService: RiskService,
  ) { }

  ngOnInit() {
     this.sessionSubs$ = this.session.watch().subscribe(value=>{
      // console.log("Session Subscription got", value);
      // Re populate the values as required
      if(this.sessionInfo?.uid != value?.uid){
        this.viewRisksResult = [];
        this.searchText = '';
      }
      this.sessionInfo = value;
      if(!this.sessionInfo){
        this.router.navigate(['profile']);
      }
      if( this.sessionInfo?.orgProfile.subscriberId && this.sessionInfo?.userProfile.uid && !this.risksSubs$){
        this.getAllRisks();
      }
    });
  }
  ngOnDestroy(){
    if(this.sessionInfo?.orgProfile.subscriberId && this.sessionInfo?.userProfile.uid){
          this.getAllRisks();
        }
  }

  ionViewDidEnter(){
    if(this.sessionInfo?.orgProfile.subscriberId && this.sessionInfo?.userProfile.uid){
      this.getAllRisks();
    }
  }


  ionChange(e){

    this.getAllRisks();
  }

  onClear(e){
    this.viewRisksResult = [];
  }

  dateFormater(date,format){
    return moment(date).format(format ? format : "ll");
  }

  SearchOptionsChanged(e){
    this.activeSearchMode = !this.activeSearchMode;
    this.searchMode = e.detail.value;
    this.searchModeUser = 'all';
    this.getAllRisks();
  }

  SearchUserOptionsChanged(e){
    this.activeSearchMode = !this.activeSearchMode;
    this.searchMode = e.detail.value;
    this.getAllRisks();
  }

  profileImgErrorHandler(user: any){
    user.picUrl = '../../../../assets/shapes.svg';
  }

  openRiskDetails(risk){
    this.router.navigate(['risk/risk-details'],{state: {data:{risk: risk}}});
  }
  showHideSearch(){
    this.showSearchModesforUpcomming=!this.showSearchModesforUpcomming;
    // re initialise all the serach variables
    this.limit = 20;
    //this.options.calendarOptions.pickMode = 'single';

   // this.cal.renderDataSet(this.options);

    this.searchMode = 'all';
    this.searchModeUser = 'user';
    this.searchText ='';
    // this.dateRange = {
    //                     startDate: '',
    //                     endDate: ''
    //                   };
    if(!this.showSearchModesforUpcomming){
      this.getAllRisks();
    }
  }



  // return the result of observable
  getAllRisks(){
    this.viewRisksResult = [];

    let searchTextObj = null;
    let queryObj = [];
    if(this.risksSubs$?.unsubscribe){
      this.risksSubs$.unsubscribe();
    }

    queryObj = [{field: 'subscriberId',operator: '==', value: this.sessionInfo.subscriberId}];

    if(this.searchModeUser=='user'){
      queryObj.push({field: 'ownerInitiatorUidList',operator: 'array-contains-any', value: [this.sessionInfo.uid]})
    }
    // if(this.dateRange.startDate){
    //   queryObj.push({field: 'meetingStart',operator: '>=', value: this.dateRange.startDate});
    // }
    // if(this.dateRange.endDate){
    //   queryObj.push({field: 'meetingStart',operator: '<=', value: this.dateRange.endDate});
    // }
    if(this.searchText?.trim().length>=3){
      searchTextObj = {seachField: 'titleSearchMap', text: this.searchText.trim(), searchOption: this.searchMode};
    }
    console.log("queryObj, searchTextObj, this.limit", queryObj, searchTextObj, this.limit);
    if(this.searchText?.trim().length>=3 || !this.activeSearchMode){ // or dates selected

      console.log("passsed if condition");
      this.viewRisksResult = null;
        this.risksSubs$ = this.riskService.getRisks(queryObj,searchTextObj)
          .subscribe(res=>{
            console.log("hjshdfljkahsd",res)
            this.viewRisksResult = res.map((b:any)=>{
                let id = b.payload.doc.id;
                let data = b.payload.doc.data();

                  data.docId = id;
                  let targetCompletionDate = new Date(data.targetCompletionDate.seconds*1000);
                  let actualCompletionDate =  data.actualCompletionDate ? new Date(data.actualCompletionDate.seconds*1000) : new Date(data.targetCompletionDate.seconds*1000);
                  let riskInitiationDate = new Date(data.riskInitiationDate.seconds*1000);
                  let overdue =  data.riskStatus != 'RESOLVED' && new Date(moment(targetCompletionDate).add(1,'d').format('YYYY-MM-DD')) < new Date(moment().format('YYYY-MM-DD')) ? 'overdue' : '';
                return {id, data: {...data, targetCompletionDate, actualCompletionDate, riskInitiationDate, overdue}};
              })
            // if(this.viewRisksResult.length == 0) this.viewRisksResult = null;
            console.log('all risks are :',this.viewRisksResult);
          },
          err=>{
            console.log(err);
          });
    }

  }

  gotoAddRisk(){
    this.router.navigate(['risk/create-risk'])
  }
}
