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
      taskInitiationDate :new Date(),
      taskEntryDate : null,
      targetCompletionDate :new Date(),
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
    console.log(startDateTime,endDateTime);

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
    } 
    // else {
    //       title = "Invalid task Dates";
    //       body = "task cannot be set in past. The task start and end time should be future time.";
    //       status= false;
    // }
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

    console.log(taskData, refInformation, editedlinkages, sessionInfo, type, false)
    return this.transaction(taskData, refInformation, editedlinkages, sessionInfo, type, false);
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



  transaction(taskData, refCopy, editedlinkages, sessionInfo, type, silentMode: boolean = false){

    console.log("getting data     :",taskData);
    console.log("getting ref info :",refCopy);
    console.log("getting linkage  :",editedlinkages);

    const {subscriberId, uid}= sessionInfo;

    let docId = subscriberId;
    let docRef = this.db.afs.collection(this.db.allCollections.kpi).doc(docId).ref;
    let taskId = '';
    return this.db.afs.firestore.runTransaction(function(transaction) {
      return transaction.get(docRef).then(async function(regDoc) {
      
      let subscriber = regDoc.data();
      let totalTask = type=='new' ?
                              (subscriber.totalTask ? (subscriber.totalTask + 1) : 1)
                              : subscriber.totalTask;

      taskId = (type=='new' && !refCopy.id) ? this.db.this.afs.createId():refCopy.id; 
      let taskRef = this.db.afs.collection(this.db.allCollections.task).doc(taskId).ref;
     
      let dataToSave = {...taskData,
                      searchMap: this.searchTextImplementation({...taskData}),
                      updatedAt: new Date(),
                    }
       // If this is the very first instance of the series of tasks, check for status change and subsequently
       // update the records as required
      if(type=='new'){
        this.kpi.updateKpiDuringCreation('Task',1,sessionInfo)
      } else {
        let statusChanged = (refCopy.status!=taskData.status);
        let prevStatus = refCopy.status;
        if(statusChanged)
          {
            this.kpi.updateKpiDuringUpdate('Task',prevStatus,taskData.status,taskData,sessionInfo,1);
          }
      }
      // Propagate linkage only if linkage propagation is true along with other propagation options
      let linkage ={ meetings:editedlinkages.meetings ? editedlinkages.meetings : [],
                        risks: editedlinkages.risks ? editedlinkages.risks : [],
                        tasks: editedlinkages.tasks ? editedlinkages.tasks : [],
                        issues: editedlinkages.issues ? editedlinkages.issues : []
                      }
      let statusChanged = (refCopy.status!=taskData.status);
      let prevStatus = refCopy.status;
      let selfLinkData = this.link.getLinkData('meetings', taskData);
      console.log("runninh transaction", dataToSave, linkage , selfLinkData);
      await this.link.saveDocumentData(this.db.allCollections.meeting, taskId, dataToSave, linkage , selfLinkData, transaction, type);
      
      
      return true;

      }.bind(this))
    }.bind(this))
    .then(function() {
        if(!silentMode){
          let infodata = taskData;
          let eventInfo = {
            origin: 'tasks',
            eventType: type=='new' ? 'add' : 'update',
            data: {
              id: taskId,
              subscriberId: subscriberId,
              ...infodata
            },
            prevData: refCopy,
          };
          let notifications = this.itemupdate.getNotifications(eventInfo);
          this.notification.createNotifications(notifications);

          // this.sendMail(meeting.attendeeList,refCopy.id,meeting.meetingStart,meeting.meetingEnd);


          this.sfp.defaultAlert("Successful","Task Data updated successfully.");
          console.log("runninh transaction", {status: 'success', title: "Successful", body: "Task Data updated successfully."});
          return {status: 'success', title: "Success", body: "Task " +  (type=='new' ? 'created' : 'updated') + " successfully."};

        }
    }.bind(this)).catch(function(error) {
        console.log("running transaction failed",error);
        return {status: 'failed', title: "Error", body: "Task " + (type=='new' ? 'creation' : 'updation') + " failed. Please try again."};
    }.bind(this));
  }

}
