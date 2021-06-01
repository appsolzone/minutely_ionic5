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
import { Risk } from 'src/app/interface/risk';

@Injectable({
  providedIn: 'root'
})
export class RiskService {
  newRisk = {
      riskTitle :'',
      riskOwner :{
        name:'',
        uid:'',
        subscriberId:'',
        picUrl:'',
      },
      riskInitiationDate :new Date(),
      riskEntryDate : new Date(),
      targetCompletionDate :new Date(),
      actualCompletionDate: null,
      riskStatus: 'OPEN',
      lastUpdateDate:null,
      subscriberId: null,
      latestComment:{
        author:'',
        comment:'',
        date:null,
        picUrl:'',
        totalComments:0
      },
      riskInitiator :{
        name:'',
        uid:'',
        subscriberId:'',
        picUrl:'',
      },
      tags:[],
      riskProbability :'Low',
      riskImpact:'Low',
      riskMitigation:'',
      riskContingency:'',
      searchMap:{},
      ownerInitiatorUidList:[],
  }

constructor(
    public db: DatabaseService,
    public searchMap: TextsearchService,
    public link: LinkageService,
    public kpi: MinutelyKpiService,
    public aclKpi: KpiService,
    public notification: NotificationsService,
    public itemupdate: ItemUpdatesService,
    public sendmail: SendEmailService,
  ){
     // TBA
  }

  // Read
  getRisksOnce(queryObj:any[], textSearchObj: any = null, limit: number=null){
    return this.db.getAllDocumentsByQuery(this.db.allCollections.risk, queryObj, textSearchObj, limit);
  }

  // Read and watch
  getRisks(queryObj:any[], textSearchObj: any = null, limit: any=null){
    return this.db.getAllDocumentsSnapshotByQuery(this.db.allCollections.risk, queryObj, textSearchObj, limit);
  }

  // Read and watch
  getRiskById(id: string){
    return this.db.getDocumentSnapshotById(this.db.allCollections.risk, id);
  }

  // validate basic info functions
  validTitle(m){
    let risk = m.data;
    let status = true;
    let title = "Risk title";
    let body = "";
    if(risk.riskTitle && risk.riskTitle.trim()){
      status = true;
    } else {
      body = "Please enter a valid risk title and try again.";
      status=false;
    }
    return {status, title, body};
  }

  dateChange(m, refInformation){
    let risk = m.data;
    let title='Risk Date';
    let body='';
    let status = true;
    let startDateTime = risk.riskInitiationDate ? new Date(moment(risk.riskInitiationDate).format("YYYY-MM-DD")) : null;
    let endDateTime = risk.targetCompletionDate ? new Date(moment(risk.targetCompletionDate).format("YYYY-MM-DD")) : null;


    if(!startDateTime) {
      status = false;
      title = "Invalid Risk Initiation Date";
      body = "Risk start date cannot be empty. Please provide a valid risk initiation date.";
    } else if(!endDateTime) {
      status = false;
      title = "Invalid Risk Due Date";
      body = "Risk target completion date cannot be empty. The risk end time should be future time.";
    } else if((refInformation.targetCompletionDate == risk.targetCompletionDate) ||
              (startDateTime <= endDateTime)
            ) {
      status = true;
    } else {

      title = "Invalid Date";
      body = "Risk target completion date can not be earlier than the risk initiation date.";
      status= false;
    }
    return {status, title, body};
  }

  validateBasicInfo(risk, refInformation){

    let check = this.dateChange(risk,refInformation);

    if(!check.status){
      return check;
    }

    check = this.validTitle(risk);

    if(!check.status){
      return check;
    }

    return {status: true, title: 'Valid Basic Info', body: 'Valid Basic Info'};

  }

  processRisk(risk, refInformation, editedlinkages, sessionInfo){
    // if risk is cancelled, just change the status to cancel

    // if changes are confined only to this instance, not be propagated, copy referenceInfomation for recurrence, if any

    // else changes to be propagated
    let riskData = risk.data;
    let type = risk.id ? 'update' : 'new';
    return this.transaction(riskData, refInformation, editedlinkages, sessionInfo, type, false);
  }

  getRiskDates(refDetails: any = {}){

    let riskInitiationDate = new Date(refDetails.riskInitiationDate);
    let targetCompletionDate = new Date(refDetails.targetCompletionDate);
    let actualCompletionDate = refDetails.riskStatus=='RESOLVED' ? new Date() : null;

    return {riskInitiationDate, targetCompletionDate, actualCompletionDate} //, startDateTime, endDateTime, startTime, endTime, year, month, yearMonth};
  }

  searchTextImplementation(risk){
    let status = risk.riskStatus;
    let searchMap: any;

    let searchStrings = risk.riskTitle +" "+
                        risk.tags.join(' ') +' ' +
                        risk.riskOwner.name + " " + risk.riskOwner.email + " " +
                        risk.riskInitiator.name + " " + risk.riskInitiator.email + " " +
                        status+" ";
      searchStrings += moment(new Date(risk.targetCompletionDate)).format("D") + " "+
                        moment(new Date(risk.targetCompletionDate)).format("YYYY") + " "+
                        moment(new Date(risk.targetCompletionDate)).format("MMMM") + " " +
                        moment(new Date(risk.targetCompletionDate)).format("MMM");
    searchMap = this.searchMap.createSearchMap(searchStrings);
    risk.ownerInitiatorUidList.forEach(uid=>{if(uid)searchMap[uid]=true;});
    return searchMap;
  }

  transaction(risk, refCopy, editedlinkages, sessionInfo, type, silentMode: boolean = false){
    const {subscriberId, uid}= sessionInfo;
    let riskId = '';
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
          let riskDates = this.getRiskDates(this.status=='RESOLVED' ? refCopy : risk);

          // riskId = type=='new' ?
          //           await this.db.generateDocuemnetRef(this.db.allCollections.risk)
          //           :
          //           refCopy.id; //subscriberId + "_"+ (totalSequenceId +'_' + i);
          if(type=='new'){
            let riskRef = await this.db.generateDocuemnetRef(this.db.allCollections.risk)
            await transaction.get(riskRef.ref).then(doc=>{
              console.log("riskId doc", doc.id, doc.data())
              riskId = doc.id;
              refCopy.id = riskId;
            });
          } else {
            riskId = refCopy.id;
          }
          // riskRef = this.db.afs.collection(this.db.allCollections.risk).doc(riskId).ref;

          console.log("runninh transaction", riskId);
          let dataToSave = {...risk, ...riskDates,
                             // date: moment(eventDates.startDateTime).format('YYYY-MM-DD'),
                             searchMap: this.searchTextImplementation({...risk, ...riskDates}),
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
          // console.log("linkage", linkage, risk.linkage.risks[0].id, risk.linkage.tasks[0].id);
          let statusChanged = (refCopy.riskStatus!=risk.riskStatus);
          let prevStatus = refCopy.riskStatus;
          let selfLinkData = this.link.getLinkData('risks', risk);
          console.log("runninh transaction", riskId, dataToSave, linkage , selfLinkData);
          await this.link.saveDocumentData(this.db.allCollections.risk, riskId, dataToSave, linkage , selfLinkData, transaction, type);



          // If this is the very first instance of the series of risks, check for status change and subsequently
          // update the records as required
          if(type=='new'){
            this.kpi.updateKpiDuringCreation('Risk',1,sessionInfo);
            this.aclKpi.updateKpiDuringCreation(
              'create-project-item',
              sessionInfo,
              transaction,
              1
            );
          } else {
            let statusChanged = (refCopy.riskStatus!=risk.riskStatus);
            let prevStatus = refCopy.riskStatus;
            if(statusChanged)
              {
                this.kpi.updateKpiDuringUpdate('Risk',prevStatus,risk.riskStatus,risk,sessionInfo);
              }
          }
          console.log("running transaction end");
      }.bind(this));
    }.bind(this)).then(function() {
        if(!silentMode){

          // this.riskExpand = this.riskExpand = this.riskExpand = this.taskExpand = false;
          // what about seting the values of other fields which are required to be reset post update
          let infodata = risk;
          let eventInfo = {
            origin: 'risks',
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
          if(risk.status != 'CANCEL'){
            // this.sendMail(risk.attendeeList,refCopy.id,risk.riskStart,risk.riskEnd);
          }
          //send mail during update and creation
          this.sendMailDuringCreationUpdateToOwner(risk,sessionInfo,type);

          // this.sfp.defaultAlert("Successful","Risk Data updated successfully.");
          // this.navData.loader = false;
          console.log("runninh transaction", {status: 'success', title: "Successful", body: "Risk Data updated successfully."});
          return {status: 'success', title: "Success", body: "Risk " +  (type=='new' ? 'created' : 'updated') + " successfully."};

        }
    }.bind(this)).catch(function(error) {
        console.log("runninh transaction failed",error);
        return {status: 'failed', title: "Error", body: "Risk " + (type=='new' ? 'creation' : 'updation') + " failed. Please try again."};
        // this.sfp.defaultAlert("Error Update Risk", "Risk Data update failed. " + error);
        // this.navData.loader = false;
    }.bind(this));
  }


  // share risk summary
  async shareRiskMinutes(risk, linkages,selectedMembers)
  {
      let m = risk.data;
      let id = risk.id;
      Object.keys(linkages).forEach(async lt=>{
        if(!linkages[lt] || linkages[lt].length==0){
          // linkage data not yet fetched, so fetch it now
          await this.link.getLinkagesOnce(id,'risk', lt)
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
        toName: m.riskOwner.name,

        meetingList: linkages.meetings,
        riskList: linkages.risks,
        issueList:linkages.issues,
        taskList:linkages.tasks,

        riskTitle:m.riskTitle,
        riskInitiationDate: moment(m.riskInitiationDate).format('MMM DD, YYYY') + " UTC",
        targetCompletionDate: moment(m.targetCompletionDate).format('MMM DD, YYYY') + " UTC",
        riskInitiator: m.riskInitiator,
        riskOwner: m.riskOwner,
        riskStatus: m.riskStatus,
        riskImpact: m.riskImpact,
        riskProbability: m.riskProbability,
        riskContingency: m.riskContingency,
        riskMitigation: m.riskMitigation,
      }
      console.log("minutesObj email", minutesObj);
      this.sendmail.sendCustomEmail(this.sendmail.shareRiskPath,minutesObj)
      .then((sent: any)=>
        {
          this.aclKpi.updateKpiDuringCreation(
            'share-project-item',
            {subscriberId: m.subscriberId} , //sessionInfo,
            null,
            selectedMembers.length
          );
          console.log("response from risk share email", sent);

        });
      return {status: "success", title: "Risk Details", body: "Risk details shared with selected users through email."};
  }
  sendMailDuringCreationUpdateToOwner(riskDetails,sessionInfo,type){
   let taskObj = {
    toEmail:riskDetails.riskOwner.email,
    toName: riskDetails.riskOwner.name,
    initiator:sessionInfo.userProfile.name,
    orgName:sessionInfo.orgProfile.subscriberId,
    riskTitle:riskDetails.riskTitle,
    initationDate:moment(riskDetails.riskInitiationDate).format('MMM DD, YYYY'),
    targetCompletionDate:moment(riskDetails.targetCompletionDate).format('MMM DD, YYYY'),
    status:riskDetails.riskStatus,
    probability:riskDetails.riskProbability,
    impact:riskDetails.riskImpact,
   };
   let path = type == 'updated'? this.sendmail.updateRiskMailPath : this.sendmail.newRiskMailPath;
   this.sendmail.sendCustomEmail(path,taskObj)
      .then((sent: any)=>
        {

        });
  }
}
