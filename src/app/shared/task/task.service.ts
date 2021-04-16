import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { DatabaseService } from 'src/app/shared/database/database.service';
import { TextsearchService } from 'src/app/shared/textsearch/textsearch.service';
import { LinkageService } from 'src/app/shared/linkage/linkage.service';
import { KpiService } from 'src/app/shared/kpi/kpi.service';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
import { ItemUpdatesService } from 'src/app/shared/item-updates/item-updates.service';
import { SendEmailService } from 'src/app/shared/send-email/send-email.service';
import { Task } from 'src/app/interface/task';

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
        totalComments:0
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
    public itemupdate: ItemUpdatesService,
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
      title = "Invalid Task Initiation Date";
      body = "Task start date cannot be empty. Please provide a valid task initiation date.";
    } else if(!endDateTime) {
      status = false;
      title = "Invalid Task Due Date";
      body = "Task target completion date cannot be empty. The task end time should be future time.";
    } else if((refInformation.targetCompletionDate == task.targetCompletionDate) ||
              (startDateTime <= endDateTime)
            ) {
      status = true;
    } else {

      title = "Invalid Date";
      body = "Task target completion date can not be earlier than the task initiation date.";
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
    return this.transaction(taskData, refInformation, editedlinkages, sessionInfo, type, false);
  }

  getTaskDates(refDetails: any = {}){

    let taskInitiationDate = new Date(refDetails.taskInitiationDate);
    let targetCompletionDate = new Date(refDetails.targetCompletionDate);
    let actualCompletionDate = refDetails.taskStatus=='RESOLVED' ? new Date() : null;

    return {taskInitiationDate, targetCompletionDate, actualCompletionDate} //, startDateTime, endDateTime, startTime, endTime, year, month, yearMonth};
  }

  searchTextImplementation(task){
    let status = task.taskStatus;
    let searchMap: any;

    let searchStrings = task.taskTitle +" "+
                        task.tags.join(' ') +' ' +
                        task.taskOwner.name + " " + task.taskOwner.email + " " +
                        task.taskInitiator.name + " " + task.taskInitiator.email + " " +
                        status+" ";
      searchStrings += moment(new Date(task.targetCompletionDate)).format("D") + " "+
                        moment(new Date(task.targetCompletionDate)).format("YYYY") + " "+
                        moment(new Date(task.targetCompletionDate)).format("MMMM") + " " +
                        moment(new Date(task.targetCompletionDate)).format("MMM");
    searchMap = this.searchMap.createSearchMap(searchStrings);
    task.ownerInitiatorUidList.forEach(uid=>searchMap[uid]=true);
    return searchMap;
  }

  transaction(task, refCopy, editedlinkages, sessionInfo, type, silentMode: boolean = false){
    const {subscriberId, uid}= sessionInfo;
    let taskId = '';
    // we are handling type = 'update' && 'new' only
    // let's lock the document we would like to create readlock
    let docId = subscriberId;
    let docRef = this.db.afs.collection(this.db.allCollections.subscribers).doc(docId).ref;
    // transaction provide here
    return this.db.afs.firestore.runTransaction(function(transaction) {
      // get the read consistency lock on the subscriber doc
      return transaction.get(docRef).then(async function(regDoc) {
          let subscriber = regDoc.data();
          // Note that we should start at the current event seq id to cascade the events

          console.log("running transaction");
          let taskDates = this.getTaskDates(this.status=='RESOLVED' ? refCopy : task);

          // taskId = type=='new' ?
          //           await this.db.generateDocuemnetRef(this.db.allCollections.task)
          //           :
          //           refCopy.id; //subscriberId + "_"+ (totalSequenceId +'_' + i);
          if(type=='new'){
            let taskRef = await this.db.generateDocuemnetRef(this.db.allCollections.task)
            await transaction.get(taskRef.ref).then(doc=>{
              console.log("taskId doc", doc.id, doc.data())
              taskId = doc.id;
              refCopy.id = taskId;
            });
          } else {
            taskId = refCopy.id;
          }
          // taskRef = this.db.afs.collection(this.db.allCollections.task).doc(taskId).ref;

          console.log("runninh transaction", taskId);
          let dataToSave = {...task, ...taskDates,
                             // date: moment(eventDates.startDateTime).format('YYYY-MM-DD'),
                             searchMap: this.searchTextImplementation({...task, ...taskDates}),
                             // status: type,
                             updatedAt: new Date(),
                           };
          // Propagate linkage only if linkage propagation is true along with other propagation options
          let linkage =  {
                            meetings:editedlinkages.meetings ? editedlinkages.meetings : [],
                            tasks: editedlinkages.tasks ? editedlinkages.tasks : [],
                            issues: editedlinkages.issues ? editedlinkages.issues : [],
                            risks: editedlinkages.risks ? editedlinkages.risks : []
                          };
          // console.log("linkage", linkage, task.linkage.tasks[0].id, task.linkage.tasks[0].id);
          let statusChanged = (refCopy.taskStatus!=task.taskStatus);
          let prevStatus = refCopy.taskStatus;
          let selfLinkData = this.link.getLinkData('tasks', task);
          console.log("runninh transaction", taskId, dataToSave, linkage , selfLinkData);
          await this.link.saveDocumentData(this.db.allCollections.task, taskId, dataToSave, linkage , selfLinkData, transaction, type);



          // If this is the very first instance of the series of tasks, check for status change and subsequently
          // update the records as required
          if(type=='new'){
            this.kpi.updateKpiDuringCreation('Task',1,sessionInfo)
          } else {
            let statusChanged = (refCopy.taskStatus!=task.taskStatus);
            let prevStatus = refCopy.taskStatus;
            if(statusChanged)
              {
                this.kpi.updateKpiDuringUpdate('Task',prevStatus,task.taskStatus,task,sessionInfo);
              }
          }
          console.log("running transaction end");
      }.bind(this));
    }.bind(this)).then(function() {
        if(!silentMode){

          // this.taskExpand = this.taskExpand = this.riskExpand = this.taskExpand = false;
          // what about seting the values of other fields which are required to be reset post update
          let infodata = task;
          let eventInfo = {
            origin: 'tasks',
            eventType: type=='new' ? 'add' : 'update',
            updatedBy: sessionInfo?.userProfile,
            data: {
              id: refCopy.id,
              subscriberId: subscriberId,
              ...infodata
            },
            prevData: refCopy,
          };
          let notifications = this.itemupdate.getNotifications(eventInfo);
          this.notification.createNotifications(notifications);
          if(task.status != 'CANCEL'){
            // this.sendMail(task.attendeeList,refCopy.id,task.taskStart,task.taskEnd);
          }

          // this.sfp.defaultAlert("Successful","Task Data updated successfully.");
          // this.navData.loader = false;
          console.log("runninh transaction", {status: 'success', title: "Successful", body: "Task Data updated successfully."});
          return {status: 'success', title: "Success", body: "Task " +  (type=='new' ? 'created' : 'updated') + " successfully."};

        }
    }.bind(this)).catch(function(error) {
        console.log("runninh transaction failed",error);
        return {status: 'failed', title: "Error", body: "Task " + (type=='new' ? 'creation' : 'updation') + " failed. Please try again."};
        // this.sfp.defaultAlert("Error Update Task", "Task Data update failed. " + error);
        // this.navData.loader = false;
    }.bind(this));
  }


  // share task summary
  async shareTaskMinutes(task, linkages,selectedMembers)
  {
    console.log(task.data,task.data.taskStatus)
    // if(task.data.taskStatus != 'RESOLVED'){
    //   return {status: "warning", title: "Task status Open", body: "Task minutes can only be shared for RESOLVED tasks through email. Please mark the task RESOLVED and then share task minutes."};
    // } else {
      let m = task.data;
      console.log(m);
      let id = task.id;
      Object.keys(linkages).forEach(async lt=>{
        if(!linkages[lt] || linkages[lt].length==0){
          // linkage data not yet fetched, so fetch it now
          await this.link.getLinkagesOnce(id,'task', lt)
                .then(allDocs=>{
                  linkages[lt] = [];
                  allDocs.forEach((doc) => {
                        // doc.data() is never undefined for query doc snapshots
                        let id = doc.id;
                        let data = doc.data();
                        // console.log(doc.id, " => ", doc.data());
                        linkages[lt].push({id,data});
                    });
                })
        }
      })
      let minutesObj = {
        toEmail:selectedMembers.map(a=>{return {email: a.email};}),
        taskStart: moment.utc(m.taskStart).format('MMM DD, YYYY h:mm a') + " UTC",
        toName: m.taskInitiator.name,
        taskTitle:m.taskTitle,
        taskInitiationDate: moment(m.taskInitiationDate).format('MMM DD, YYYY'),
        targetCompletionDate: moment(m.targetCompletionDate).format('MMM DD, YYYY'),
        taskDetails: m.taskDetails,
        taskStatus: m.taskStatus,
        taskInitiator: m.taskInitiator,
        taskOwner: m.taskOwner,
        meetingList: linkages.meetings,
        riskList: linkages.risks,
        taskList:linkages.tasks,
        issueList:linkages.issue,
      }
      console.log("minutesObj email", minutesObj);

      this.sendmail.sendCustomEmail(this.sendmail.shareTaskPath,minutesObj)
      .then((sent: any)=>
        {
  
        });
      return {status: "success", title: "Task Minutes", body: "Task minutes shared with attendees through email."};
   // }
  }

}
