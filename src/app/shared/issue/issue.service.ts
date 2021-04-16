import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { DatabaseService } from 'src/app/shared/database/database.service';
import { TextsearchService } from 'src/app/shared/textsearch/textsearch.service';
import { LinkageService } from 'src/app/shared/linkage/linkage.service';
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
    public kpi: KpiService,
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
    let startDateTime = issue.issueInitiationDate ? new Date(issue.issueInitiationDate) : null;
    let endDateTime = issue.targetCompletionDate ? new Date(issue.targetCompletionDate) : null;


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

  getIssueDates(refDetails: any = {}){

    let issueInitiationDate = new Date(refDetails.issueInitiationDate);
    let targetCompletionDate = new Date(refDetails.targetCompletionDate);
    let actualCompletionDate = refDetails.issueStatus=='RESOLVED' ? new Date() : null;

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
    issue.ownerInitiatorUidList.forEach(uid=>searchMap[uid]=true);
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

          console.log("running transaction");
          let issueDates = this.getIssueDates(this.status=='RESOLVED' ? refCopy : issue);

          // issueId = type=='new' ?
          //           await this.db.generateDocuemnetRef(this.db.allCollections.issue)
          //           :
          //           refCopy.id; //subscriberId + "_"+ (totalSequenceId +'_' + i);
          if(type=='new'){
            let issueRef = await this.db.generateDocuemnetRef(this.db.allCollections.issue)
            await transaction.get(issueRef.ref).then(doc=>{
              console.log("issueId doc", doc.id, doc.data())
              issueId = doc.id;
              refCopy.id = issueId;
            });
          } else {
            issueId = refCopy.id;
          }
          // issueRef = this.db.afs.collection(this.db.allCollections.issue).doc(issueId).ref;

          console.log("runninh transaction", issueId);
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
            this.kpi.updateKpiDuringCreation('Issue',1,sessionInfo)
          } else {
            let statusChanged = (refCopy.issueStatus!=issue.issueStatus);
            let prevStatus = refCopy.issueStatus;
            if(statusChanged)
              {
                this.kpi.updateKpiDuringUpdate('Issue',prevStatus,issue.issueStatus,issue,sessionInfo);
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
          if(issue.status != 'CANCEL'){
            // this.sendMail(issue.attendeeList,refCopy.id,issue.issueStart,issue.issueEnd);
          }

          // this.sfp.defaultAlert("Successful","Issue Data updated successfully.");
          // this.navData.loader = false;
          console.log("runninh transaction", {status: 'success', title: "Successful", body: "Issue Data updated successfully."});
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
    if(issue.data.status != 'RESOLVED'){
      return {status: "warning", title: "Issue status Open", body: "Issue minutes can only be shared for RESOLVED issues through email. Please mark the issue RESOLVED and then share issue minutes."};
    } else {
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
  
        });
      return {status: "success", title: "Issue Minutes", body: "Issue minutes shared with attendees through email."};
    }
  }
}
