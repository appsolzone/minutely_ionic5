import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { DatabaseService } from '../database/database.service';
import { KpiService } from '../kpi/kpi.service';
import { LinkageService } from '../linkage/linkage.service';
import { NotificationsService } from '../notifications/notifications.service';
import { SendEmailService } from '../send-email/send-email.service';
import { TextsearchService } from '../textsearch/textsearch.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
   newTask = {
      taskTitle :'',
      taskOwner :{
        name:'',
        uid:'',
        subscriberId:'',
        picUrl:'',
      },
      taskInitiationDate :null,
      taskEntryDate : null,
      targetCompletionDate :null,
      actualCompletionDate: null,
      taskStatus: 'OPEN',
      lastUpdateDate:null,
      subscriberId: null,
      latestComment:{
        author:'',
        comment:'',
        date:null,
        picUrl:'',
        totalComment:0
      },
      taskInitiator :{
        name:'',
        uid:'',
        subscriberId:'',
        picUrl:'',
      },
      tags:[],
      details:'',
      searchMap:{},
      ownerInitiatorUidList:[],
  }

constructor(
    public db: DatabaseService,
    public searchMap: TextsearchService,
    public link: LinkageService,
    public kpi: KpiService,
    public notification: NotificationsService,
    public sendmail: SendEmailService,
  ){
     // TBA
  }

  // Read
  getTasksOnce(queryObj:any[], textSearchObj: any = null, limit: number=null){
    return this.db.getAllDocumentsByQuery(this.db.allCollections.task, queryObj, textSearchObj, limit);
  }

  // Read and watch
  getTasks(queryObj:any[], textSearchObj: any = null, limit: any=null){
    return this.db.getAllDocumentsSnapshotByQuery(this.db.allCollections.task, queryObj, textSearchObj, limit);
  }

  // Read and watch
  getTaskById(id: string){
    return this.db.getDocumentSnapshotById(this.db.allCollections.task, id);
  }

  // validate basic info functions
  validTitle(m){
    let task = m.data;
    let status = true;
    let title = "Task title";
    let body = "";
    if(task.taskTitle && task.taskTitle.trim()){
      status = true;
    } else {
      body = "Please enter a valid task title and try again.";
      status=false;
    }
    return {status, title, body};
  }

    dateChange(m, refInformation){
    let task = m.data;
    let title='Task Date';
    let body='';
    let status = true;
    let startDateTime = task.taskInitiationDate ? new Date(task.taskInitiationDate) : null;
    let endDateTime = task.targetCompletionDate ? new Date(task.targetCompletionDate) : null;


    if(!startDateTime) {
      status = false;
      title = "Invalid task Start Date";
      body = "task start date cannot be empty. The task start time should be future time.";
    } else if(!endDateTime) {
      status = false;
      title = "Invalid task End Date";
      body = "task end date cannot be empty. The task end time should be future time.";
    } else if((refInformation.taskInitiationDate == task.taskInitiationDate && refInformation.taskEnd == task.targetCompletionDate ) ||
              (new Date() <= startDateTime && new Date() <= endDateTime)
            ) {
      status = true;
    } else {
          title = "Invalid task Dates";
          body = "task cannot be set in past. The task start and end time should be future time.";
          status= false;
    }
    return {status, title, body};
  }


   validateBasicInfo(task, refInformation){

    let check = this.dateChange(task,refInformation);

    if(!check.status){
      return check;
    }

    check = this.validTitle(task);

    if(!check.status){
      return check;
    }

    return {status: true, title: 'Valid Basic Info', body: 'Valid Basic Info'};

  }


  processTask(task, refInformation, editedlinkages, sessionInfo){
    // if task is cancelled, just change the status to cancel

    // if changes are confined only to this instance, not be propagated, copy referenceInfomation for recurrence, if any

    // else changes to be propagated
    let taskData = task.data;
    let type = task.id ? 'update' : 'new';
    //return this.transaction(taskData, refInformation, editedlinkages, sessionInfo, type, false);
  }

    searchTextImplementation(task){
    let status = task.taskStatus;

    let searchStrings = task.taskTitle +" "+
                        task.tags.join(' ') +' ' +
                        task.taskOwner.u.name + ' ' + task.taskOwner.u.email + " " +
                        task.taskInitiator.u.name + ' ' + task.taskInitiator.u.email + " " +
                        status+" ";
      searchStrings += moment(new Date(task.taskInitiationDate)).format("D") + " "+
                        moment(new Date(task.taskInitiationDate)).format("YYYY") + " "+
                        moment(new Date(task.taskInitiationDate)).format("MMMM") + " " +
                        moment(new Date(task.taskInitiationDate)).format("MMM");
    return this.searchMap.createSearchMap(searchStrings);
  }

}
