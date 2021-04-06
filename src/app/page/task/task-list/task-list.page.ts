import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { SessionService } from 'src/app/shared/session/session.service';
import { TaskService } from 'src/app/shared/task/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.page.html',
  styleUrls: ['./task-list.page.scss'],
})
@Autounsubscribe()
export class TaskListPage implements OnInit,OnDestroy {
  @Input() showOnlyUpcommingTasks: boolean = false;
  // observables
  sessionSubs$;
  tasksSubs$;
  
  public showSearchModesforUpcomming: boolean = false;
  public sessionInfo: any;
  public searchText: string;
  public limit: any = 20;
  public activeSearchMode:boolean = false;
  public searchMode: string = 'all';
  public searchModeUser: string = 'user';
  public options: any;
  public viewTasksResult: any = [];
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
    private taskService: TaskService,
  ) { }

  ngOnInit() {
     this.sessionSubs$ = this.session.watch().subscribe(value=>{
      // console.log("Session Subscription got", value);
      // Re populate the values as required
      if(this.sessionInfo?.uid != value?.uid){
        this.viewTasksResult = [];
        this.searchText = '';
      }
      this.sessionInfo = value;
      if(!this.sessionInfo){
        this.router.navigate(['profile']);
      }
      if( this.sessionInfo?.orgProfile.subscriberId && this.sessionInfo?.userProfile.uid && !this.tasksSubs$){
        this.getAllTasks();
      }
    });
  }
  ngOnDestroy(){
    if(this.sessionInfo?.orgProfile.subscriberId && this.sessionInfo?.userProfile.uid){
          this.getAllTasks();
        }
  }

  ionViewDidEnter(){
    if(this.sessionInfo?.orgProfile.subscriberId && this.sessionInfo?.userProfile.uid){
      this.getAllTasks();
    }
  }


  ionChange(e){

    this.getAllTasks();
  }

  onClear(e){
    this.viewTasksResult = [];
  }

  dateFormater(date,format){
    return moment(date).format(format ? format : "ll");
  }

  SearchOptionsChanged(e){
    this.activeSearchMode = !this.activeSearchMode;
    this.searchMode = e.detail.value;
    this.searchModeUser = 'all';
    this.getAllTasks();
  }

  SearchUserOptionsChanged(e){
    this.activeSearchMode = !this.activeSearchMode;
    this.searchMode = e.detail.value;
    this.getAllTasks();
  }

  profileImgErrorHandler(user: any){
    user.picUrl = '../../../../assets/shapes.svg';
  }

  openTaskDetails(task){
    this.router.navigate(['task/task-details'],{state: {data:{task: task}}});
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
      this.getAllTasks();
    }
  }



  // return the result of observable
  getAllTasks(){
    this.viewTasksResult = [];  

    let searchTextObj = null;
    let queryObj = [];
    if(this.tasksSubs$?.unsubscribe){
      this.tasksSubs$.unsubscribe();
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
      searchTextObj = {seachField: 'searchMap', text: this.searchText.trim(), searchOption: this.searchMode};
    }
    console.log("queryObj, searchTextObj, this.limit", queryObj, searchTextObj, this.limit);
    if(this.searchText?.trim().length>=3 || !this.activeSearchMode){ // or dates selected

      console.log("passsed if condition");
      this.viewTasksResult = null; 
        this.tasksSubs$ = this.taskService.getTasks(queryObj,searchTextObj)
          .subscribe(res=>{
            console.log("hjshdfljkahsd",res)
            this.viewTasksResult = res.map((b:any)=>{
                let id = b.payload.doc.id;
                let data = b.payload.doc.data();
                
                  data.docId = id;
                  data.targetCompletionDate = moment(data.targetCompletionDate.seconds*1000).format('ll');
                  data.actualCompletionDate =  data.actualCompletionDate ? moment(data.actualCompletionDate.seconds*1000).format('ll') : moment(data.targetCompletionDate.seconds*1000).format('ll');
                  data.taskInitiationDate = moment(data.taskInitiationDate.seconds*1000).format('ll');
                  data.overdue =  data.taskStatus != 'RESOLVED' && new Date(data.targetCompletionDate.seconds*1000 + 23.9*3600000) < new Date(moment().format('YYYY-MM-DD')) ? 'overdue' : '';
                return {id, data: {...data}};
              })
            // if(this.viewRisksResult.length == 0) this.viewRisksResult = null;
            console.log('all tasks are :',this.viewTasksResult);
          },
          err=>{
            console.log(err);
          }); 
    }

  }

  gotoAddTask(){
    this.router.navigate(['task/create-task'])
  }

}
