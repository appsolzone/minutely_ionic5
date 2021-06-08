import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { DatabaseService } from 'src/app/shared/database/database.service';
import { TextsearchService } from 'src/app/shared/textsearch/textsearch.service';
import { LinkageService } from 'src/app/shared/linkage/linkage.service';
import { MinutelyKpiService } from 'src/app/shared/minutelykpi/minutelykpi.service';
import { KpiService } from 'src/app/shared/kpi/kpi.service';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
import { ItemUpdatesService } from 'src/app/shared/item-updates/item-updates.service';
import { SendEmailService } from 'src/app/shared/send-email/send-email.service';
import { Issue } from 'src/app/interface/issue';

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  public newIssue = {
      // issueId?:string,
      // id?:string,
      issueTitle : '',
      issueOwner : {
        name:'',
        uid:'',
        email:'',
        picUrl:'',
      },
      issueInitiationDate : null,
      // issueEntryDate : null,
      targetCompletionDate : null,
      actualCompletionDate: null,
      issueStatus: 'OPEN',
      lastUpdateDate: null,
      subscriberId:'',
      latestComment:{
        author:'',
        uid:'',
        email:'',
        picUrl:'',
        comment: '',
        date: null,
        totalComments: 0
      },
      issueInitiator:{
        name:'',
        uid:'',
        picUrl:'',
        email:''
      },
      tags:[],
      issueDetails:'',
      searchMap: {},
      ownerInitiatorUidList:[]
  };

  constructor(
    public db: DatabaseService,
    public searchMap: TextsearchService,
    public link: LinkageService,
    public kpi: MinutelyKpiService,
    public aclKpi: KpiService,
    public notification: NotificationsService,
    public itemupdate: ItemUpdatesService,
    public sendmail: SendEmailService,
  ) { }

  // Read
  getIssuesOnce(queryObj:any[], textSearchObj: any = null, limit: number=null){
    return this.db.getAllDocumentsByQuery(this.db.allCollections.issue, queryObj, textSearchObj, limit);
  }

  // Read and watch
  getIssues(queryObj:any[], textSearchObj: any = null, limit: any=null){
    return this.db.getAllDocumentsSnapshotByQuery(this.db.allCollections.issue, queryObj, textSearchObj, limit);
  }
  // Read and watch
  getIssueById(id: string){
    return this.db.getDocumentSnapshotById(this.db.allCollections.issue, id);
  }

  // validate basic info functions
  validTitle(m){
    let issue = m.data;
    let status = true;
    let title = "Issue title";
    let body = "";
    if(issue.issueTitle && issue.issueTitle.trim()){
      status = true;
    } else {
      body = "Please enter a valid issue title and try again.";
      status=false;
    }
    return {status, title, body};
  }

  dateChange(m, refInformation){
    let issue = m.data;
    let title='Issue Date';
    let body='';
    let status = true;
    let startDateTime = issue.issueInitiationDate ? new Date(moment(issue.issueInitiationDate).format("YYYY-MM-DD")) : null;
    let endDateTime = issue.targetCompletionDate ? new Date(moment(issue.targetCompletionDate).format("YYYY-MM-DD")) : null;


    if(!startDateTime) {
      status = false;
      title = "Invalid Issue Initiation Date";
      body = "Issue start date cannot be empty. Please provide a valid issue initiation date.";
    } else if(!endDateTime) {
      status = false;
      title = "Invalid Issue Due Date";
      body = "Issue target completion date cannot be empty. The issue end time should be future time.";
    } else if((refInformation.targetCompletionDate == issue.targetCompletionDate) ||
              (startDateTime <= endDateTime)
            ) {
      status = true;
    } else {

      title = "Invalid Date";
      body = "Issue target completion date can not be earlier than the issue initiation date.";
      status= false;
    }
    return {status, title, body};
  }

  validateBasicInfo(issue, refInformation){

    let check = this.dateChange(issue,refInformation);

    if(!check.status){
      return check;
    }

    check = this.validTitle(issue);

    if(!check.status){
      return check;
    }

    return {status: true, title: 'Valid Basic Info', body: 'Valid Basic Info'};

  }

  processIssue(issue, refInformation, editedlinkages, sessionInfo){
    // if issue is cancelled, just change the status to cancel

    // if changes are confined only to this instance, not be propagated, copy referenceInfomation for recurrence, if any

    // else changes to be propagated
    let issueData = issue.data;
    let type = issue.id ? 'update' : 'new';
    return this.transaction(issueData, refInformation, editedlinkages, sessionInfo, type, false);
  }

  getIssueDates(refDetails: any = {}, issueStatus){

    let issueInitiationDate = new Date(refDetails.issueInitiationDate);
    let targetCompletionDate = new Date(refDetails.targetCompletionDate);
    let actualCompletionDate = issueStatus=='RESOLVED' ? new Date() : null;

    return {issueInitiationDate, targetCompletionDate, actualCompletionDate} //, startDateTime, endDateTime, startTime, endTime, year, month, yearMonth};
  }

  searchTextImplementation(issue){
    let status = issue.issueStatus;
    let searchMap: any;

    let searchStrings = issue.issueTitle +" "+
                        issue.tags.join(' ') +' ' +
                        issue.issueOwner.name + " " + issue.issueOwner.email + " " +
                        issue.issueInitiator.name + " " + issue.issueInitiator.email + " " +
                        status+" ";
      searchStrings += moment(new Date(issue.targetCompletionDate)).format("D") + " "+
                        moment(new Date(issue.targetCompletionDate)).format("YYYY") + " "+
                        moment(new Date(issue.targetCompletionDate)).format("MMMM") + " " +
                        moment(new Date(issue.targetCompletionDate)).format("MMM");
    searchMap = this.searchMap.createSearchMap(searchStrings);
    issue.ownerInitiatorUidList.forEach(uid=>{if(uid)searchMap[uid]=true;});
    return searchMap;
  }

  transaction(issue, refCopy, editedlinkages, sessionInfo, type, silentMode: boolean = false){
    const {subscriberId, uid}= sessionInfo;
    let issueId = '';
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
          if(type=='new'){
            let issueRef = await this.db.generateDocuemnetRef(this.db.allCollections.issue)
            await transaction.get(issueRef.ref).then(doc=>{
              console.log("issueId doc", doc.id, doc.data())
              issueId = doc.id;
              refCopy.id = issueId;
            });
          } else {
            issueId = refCopy.id;
            let taskRef = this.db.afs.collection(this.db.allCollections.issue).doc(issueId).ref;
            await transaction.get(taskRef).then(doc=>{
              console.log("minutley task data doc", doc.id, doc.data())
              const data: any = doc.data();
              const id: string = doc.id;

              const issueInitiationDate = moment(data.issueInitiationDate?.seconds*1000).format('YYYY-MM-DD');
              const targetCompletionDate = moment(data.targetCompletionDate?.seconds ? new Date(data.targetCompletionDate?.seconds*1000) : null).format('YYYY-MM-DD');
              const actualCompletionDate = data.actualCompletionDate?.seconds ? new Date(data.actualCompletionDate?.seconds*1000) : null;
              const overdue =  data.issueStatus != 'RESOLVED' && new Date(moment(targetCompletionDate).add(1,'d').format('YYYY-MM-DD')) < new Date(moment().format('YYYY-MM-DD')) ? 'overdue' : '';
              const overdueby = overdue=='overdue' ? moment(moment(targetCompletionDate).add(1,'d').format('YYYY-MM-DD')).fromNow() : '';
              refCopy = {id, issueInitiationDate, targetCompletionDate, actualCompletionDate,
                                     issueStatus: data.issueStatus,
                                     issueInitiator: {...data.issueInitiator},
                                     issueOwner: {...data.issueOwner},
                                     ownerInitiatorUidList: [...data.ownerInitiatorUidList],
                                     taskTitle: data.issueTitle,
                                     tags: [...data.tags]
                                   };
              console.log("minutley issue data refCopy", doc.id, refCopy)
            });
          }

          console.log("running issue transaction status", issue.issueStatus, refCopy);
          let issueDates = this.getIssueDates(issue.issueStatus=='RESOLVED' ? refCopy : issue, issue.issueStatus);

          // issueId = type=='new' ?
          //           await this.db.generateDocuemnetRef(this.db.allCollections.issue)
          //           :
          //           refCopy.id; //subscriberId + "_"+ (totalSequenceId +'_' + i);

          // Get the minutelyKpi details
          let widgetData: any = {};
          let rlDocRef = this.db.afs.collection(this.db.allCollections.minutelykpi).doc(subscriberId).ref;
          await transaction.get(rlDocRef).then(doc=>{
            console.log("minutley kpi data doc", doc.id, doc.data())
            widgetData = doc.data();
          });
          // issueRef = this.db.afs.collection(this.db.allCollections.issue).doc(issueId).ref;

          console.log("running issue transaction issueId, issueDates", issueId, issueDates);
          let dataToSave = {...issue, ...issueDates,
                             // date: moment(eventDates.startDateTime).format('YYYY-MM-DD'),
                             searchMap: this.searchTextImplementation({...issue, ...issueDates}),
                             // status: type,
                             updatedAt: new Date(),
                           };
          // Propagate linkage only if linkage propagation is true along with other propagation options
          let linkage =  {
                            meetings:editedlinkages.meetings ? editedlinkages.meetings : [],
                            risks: editedlinkages.risks ? editedlinkages.risks : [],
                            tasks: editedlinkages.tasks ? editedlinkages.tasks : [],
                            issues: editedlinkages.issues ? editedlinkages.issues : []
                          };
          // console.log("linkage", linkage, issue.linkage.issues[0].id, issue.linkage.tasks[0].id);
          let statusChanged = (refCopy.issueStatus!=issue.issueStatus);
          let prevStatus = refCopy.issueStatus;
          let selfLinkData = this.link.getLinkData('issues', issue);
          console.log("runninh transaction", issueId, dataToSave, linkage , selfLinkData);
          await this.link.saveDocumentData(this.db.allCollections.issue, issueId, dataToSave, linkage , selfLinkData, transaction, type);



          // If this is the very first instance of the series of issues, check for status change and subsequently
          // update the records as required
          if(type=='new'){
            this.kpi.updateKpiDuringCreation('Issue',1,sessionInfo, transaction);
            this.aclKpi.updateKpiDuringCreation(
              'create-project-item',
              sessionInfo,
              transaction,
              1
            );
          } else {
            let statusChanged = (refCopy.issueStatus!=dataToSave.issueStatus);
            let prevStatus = refCopy.issueStatus;
            console.log("statusChanged",statusChanged, prevStatus,dataToSave.issueStatus, issue.issueStatus,refCopy)
            if(statusChanged)
              {
                await this.kpi.updateKpiDuringUpdate('Issue',prevStatus,dataToSave.issueStatus,dataToSave,sessionInfo, 1, widgetData, transaction, refCopy);
              }
          }
          console.log("running transaction end");
      }.bind(this));
    }.bind(this)).then(function() {
        if(!silentMode){

          // this.issueExpand = this.issueExpand = this.riskExpand = this.taskExpand = false;
          // what about seting the values of other fields which are required to be reset post update
          let infodata = issue;
          let eventInfo = {
            origin: 'issues',
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
          if(issue.issueStatus != 'CANCEL'){
            // this.sendMail(issue.attendeeList,refCopy.id,issue.issueStart,issue.issueEnd);
          }

          // this.sfp.defaultAlert("Successful","Issue Data updated successfully.");
          // this.navData.loader = false;
          console.log("runninh transaction", {status: 'success', title: "Successful", body: "Issue Data updated successfully."});
          //send mail during update and creation
          // this.sendMailDuringCreationUpdateToOwner(issue,sessionInfo,type);

          return {status: 'success', title: "Success", body: "Issue " +  (type=='new' ? 'created' : 'updated') + " successfully."};

        }
    }.bind(this)).catch(function(error) {
        console.log("runninh transaction failed",error);
        return {status: 'failed', title: "Error", body: "Issue " + (type=='new' ? 'creation' : 'updation') + " failed. Please try again."};
        // this.sfp.defaultAlert("Error Update Issue", "Issue Data update failed. " + error);
        // this.navData.loader = false;
    }.bind(this));
  }


  // share issue summary
  async shareIssueMinutes(issue, linkages,selectedMembers)
  {
      let m = issue.data;
      let id = issue.id;
      Object.keys(linkages).forEach(async lt=>{
        if(!linkages[lt] || linkages[lt].length==0){
          // linkage data not yet fetched, so fetch it now
          await this.link.getLinkagesOnce(id,'issue', lt)
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
        toName: m.issueOwner.name,


        meetingList: linkages.meetings,
        riskList: linkages.risks,
        issueList:linkages.issues,
        taskList:linkages.tasks,

        issueTitle:m.issueTitle,
        issueInitiationDate: moment(m.issueInitiationDate).format('MMM DD, YYYY') + " UTC",
        targetCompletionDate: moment(m.targetCompletionDate).format('MMM DD, YYYY') + " UTC",
        issueInitiator: m.issueInitiator,
        issueOwner: m.issueOwner,
        issueStatus: m.issueStatus,
        issueDetails: m.issueDetails,

      }
      console.log("minutesObj email", minutesObj);
      this.sendmail.sendCustomEmail(this.sendmail.shareIssuePath,minutesObj)
      .then((sent: any)=>
        {
          this.aclKpi.updateKpiDuringCreation(
            'share-project-item',
            {subscriberId: m.subscriberId} , //sessionInfo,
            null,
            selectedMembers.length
          );
        });
      return {status: "success", title: "Issue Details", body: "Issue details shared with selected users through email."};
  }



  sendMailDuringCreationUpdateToOwner(issueDetails,sessionInfo,type){
   let issueObj = {
    toEmail:issueDetails.issueOwner.email,
    toName: issueDetails.issueOwner.name,
    initiator:sessionInfo.userProfile.name,
    orgName:sessionInfo.orgProfile.subscriberId,
    issueTitle:issueDetails.issueTitle,
    initationDate:moment(issueDetails.issueInitiationDate).format('MMM DD, YYYY'),
    targetCompletionDate:moment(issueDetails.targetCompletionDate).format('MMM DD, YYYY'),
    status:issueDetails.issueStatus,
   };
   let path = type == 'updated'? this.sendmail.updateIssueMailPath : this.sendmail.newIssueMailPath;
   this.sendmail.sendCustomEmail(path,issueObj)
      .then((sent: any)=>
        {

        });
  }
}
