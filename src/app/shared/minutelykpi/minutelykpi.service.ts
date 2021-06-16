import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatabaseService } from '../database/database.service';

@Injectable({
  providedIn: 'root'
})
export class MinutelyKpiService {
  kpi$ = new BehaviorSubject<any|undefined>(undefined);
  // Observable
  getKpiSubs$;
  kpiObj = {
            totalMeeting : 0,
            openMeeting : 0,
            completedMeeting : 0,
            cancelMeeting : 0,
            totalTask : 0,
            openTask : 0,
            inprogressTask : 0,
            resolvedTask : 0,
            averageResolutionTask : 0,
            totalRisk : 0,
            openRisk : 0,
            inprogressRisk : 0,
            resolvedRisk : 0,
            averageResolutionRisk : 0,
            totalIssue : 0,
            openIssue : 0,
            inprogressIssue : 0,
            resolvedIssue : 0,
            averageResolutionIssue : 0,
            riskLowLow: 0,
            riskLowMedium: 0,
            riskLowHigh: 0,
            riskMediumLow: 0,
            riskMediumMedium: 0,
            riskMediumHigh: 0,
            riskHighLow: 0,
            riskHighMedium: 0,
            riskHighHigh: 0,
            subscriberId: '',
        }
  constructor(
    private database:DatabaseService,
    public http: HttpClient
  ) {
    // initialise
    this.kpi$.next(undefined);
  }


  // Read and watch
  getKpis(queryObj:any[], textSearchObj: any = null){
    return this.database.getAllDocumentsSnapshotByQuery(this.database.allCollections.minutelykpi, queryObj, textSearchObj);
  }
  getKpisByDocId(docId: string){
    return this.database.getDocumentSnapshotById(this.database.allCollections.minutelykpi, docId);
  }

  async initialiseKpi(sessionInfo){
    let queryObj = [{field: 'subscriberId',operator: '==', value: sessionInfo.userProfile.subscriberId}];
    if(this.getKpiSubs$?.unsubscribe){
      await this.getKpiSubs$.unsubscribe();
    }
    // if(!this.getKpiSubs$){
      // this.getKpiSubs$ = this.getKpis(queryObj).subscribe(kpiDocs=>{
      this.getKpiSubs$ = this.getKpisByDocId(sessionInfo.userProfile.subscriberId).subscribe(kpiDocs=>{
                            let kpi = kpiDocs.payload.data();
                            // let kpi = kpiDocs.map((a: any) => {
                            //   const data = a.payload.doc.data();
                            //   const id = a.payload.doc.id;
                            //   return data;
                            // });
                            console.log('kpiData',kpi, sessionInfo.userProfile.subscriberId);
                            this.patch(kpi);
                          });
    // }

  }

  watch() { return this.kpi$; }
  peek() { return this.kpi$.value; }
  patch(t){ const newkpi = Object.assign({}, this.peek() ? this.peek() : {}, t); this.poke(newkpi);}
  poke(t) { this.kpi$.next(t); }
  clear() { this.poke(undefined); }

  updateKpiDuringCreation(type: any,counter:any,navData:any, transaction=null, currData=null)
  {
    return new Promise(async (res, rej) =>
    {
      const batch = transaction ? transaction : this.database.afs.firestore.batch();
      const kpiRef = this.database.afs
        .collection(this.database.allCollections.minutelykpi)
        .doc(navData.subscriberId).ref;
      let riskMatrix = {};
      if(type=="Risk"){
        riskMatrix = this.updateRiskMetrix(null, currData, navData);
      }
      batch.update(kpiRef, {
        [`total${type}`]: this.database.frb.firestore.FieldValue.increment(counter),
        [`open${type}`]: this.database.frb.firestore.FieldValue.increment(counter),
        ...riskMatrix
      });
      if(!transaction){
        batch
        .commit()
        .then(() => res(true))
        .catch((err) => {});
      } else {
        res(true)
      }
    });
  }

  async updateKpiDuringUpdate( type,prevStatus: string,currStatus: string,data:any,navData:any,counter:any=1, widgetData, transaction, refData:any = null)
  {
    var prevS = prevStatus.toLowerCase();
    var currS = currStatus.toLowerCase();
    var typeL = type.toLowerCase();

    let rlDocRef = this.database.afs.firestore.collection(this.database.allCollections.minutelykpi).doc(navData.subscriberId);
    // this.database.afs.firestore.runTransaction(function(transaction){
    //   // This code may get re-run multiple times if there are conflicts related to rlDocRef.
    //   return transaction.get(rlDocRef).then((doc)=>{
    //       if (doc.exists) {
    //         this.widgetData = doc.data();
            let riskMatrix = {};
            if(type=="Risk"){
              riskMatrix = this.updateRiskMetrix(refData, data, navData);
            }
            console.log("inside update kpi", type, counter, currStatus,prevStatus,widgetData, prevS + type, widgetData[prevS + type],  currS + type, widgetData[currS + type])

            if (![currStatus,prevStatus].includes("RESOLVED"))
            {
              transaction.update(rlDocRef, {
                [prevS + type]: widgetData[prevS + type] ?  widgetData[prevS + type] -  counter : 0, //this.database.frb.firestore.FieldValue.increment(-counter),
                [currS + type]: widgetData[currS + type] ?  widgetData[currS + type] +  counter : counter, //this.database.frb.firestore.FieldValue.increment(counter),
                ...riskMatrix
              });
            } else
            {
              //-----------find the averageResolution days---------------
              // this.widgetData = this.getKpiData(navData.subscriberId);
              // The currAvRes should be at least 1 day even when we resolve the item on the same day of initiation
              // this add 1 day to the momment.diff value
              let currAvgRes = currStatus == "RESOLVED" ?
                               moment(data.actualCompletionDate).diff(data[typeL + 'InitiationDate'], "days") + 1
                               :
                               moment(refData.actualCompletionDate).diff(refData[typeL + 'InitiationDate'], "days") + 1
                               ;

              // This is to handle re-open of already RESOLVED caseses , we have to rebaseline average resolution days for this
              let avgFinal = currStatus == "RESOLVED" ?
                (widgetData[currS + type] * widgetData['averageResolution' + type] + currAvgRes) / (widgetData[currS + type] + 1)
                :
                (widgetData[prevS + type] * widgetData['averageResolution' + type] - currAvgRes) / (widgetData[prevS + type] == 1 ? 1 : widgetData[prevS + type] - 1);;
              // Lets round it to 2 decimal places as we do not require anything precise than this
              avgFinal = Math.round( avgFinal * 100 + Number.EPSILON ) / 100;

              //----------------------------------------------------------
              transaction.update(rlDocRef, {
                [prevS + type]: widgetData[prevS + type] ?  widgetData[prevS + type] -  1 : 0,
                [currS + type]: widgetData[currS + type] ?  widgetData[currS + type] +  1 : 1,
                // [prevS + type]: this.database.frb.firestore.FieldValue.increment(-1),
                // [currS + type]: this.database.frb.firestore.FieldValue.increment(1),
                ['averageResolution' + type]: avgFinal,
                ...riskMatrix
              }
            );
            }
          // } else {
          //     // doc.data() will be undefined in this case
          //
          // }
    //   });
    // }.bind(this)).then(function(res){
    //     // Now safely delete the ference from the queue
    //
    //     return true;
    // }.bind(this)).catch(function(error){
    //
    //     return false;
    // }.bind(this));

  }

  updateRiskMetrix(riskPrevData = null, riskCurrData, navData, transaction= null) {
    console.log("updateRiskMetrix", riskPrevData, riskCurrData, riskPrevData?.riskStatus, riskCurrData.riskStatus)
    // return new Promise((res, rej) => {
    //   var batch = transaction ?  transaction : this.database.afs.firestore.batch();
    //   const a = this.database.afs
    //     .collection(this.database.allCollections.minutelykpi)
    //     .doc(navData.subscriberId).ref;

      //------------------only for risk------------
      let riskMatrix = {};
      if(riskCurrData.riskStatus=='RESOLVED' && riskPrevData?.riskStatus!='RESOLVED'){
          // batch.update(a, {
          //    ["risk" +
          //    riskCurrData.riskProbability +
          //    riskCurrData.riskImpact]: this.database.frb.firestore.FieldValue.increment(-1),
          //  });
          riskMatrix = {
                  ["risk" +
                  riskPrevData.riskProbability +
                  riskPrevData.riskImpact]: this.database.frb.firestore.FieldValue.increment(-1)
                };
      }else if(riskCurrData.riskStatus!='RESOLVED' && riskPrevData?.riskStatus=='RESOLVED'){
          // batch.update(a, {
          //    ["risk" +
          //    riskCurrData.riskProbability +
          //    riskCurrData.riskImpact]: this.database.frb.firestore.FieldValue.increment(1),
          //  });
          riskMatrix = {
             ["risk" +
             riskCurrData.riskProbability +
             riskCurrData.riskImpact]: this.database.frb.firestore.FieldValue.increment(1),
           };
      } else if(riskPrevData?.id && (riskPrevData.riskProbability != riskCurrData.riskProbability ||
         riskPrevData.riskImpact != riskCurrData.riskImpact))
      {
           // batch.update(a, {
           //   ["risk" +
           //   riskPrevData.riskProbability +
           //   riskPrevData.riskImpact]: this.database.frb.firestore.FieldValue.increment(-1),
           //   ["risk" +
           //   riskCurrData.riskProbability +
           //   riskCurrData.riskImpact]: this.database.frb.firestore.FieldValue.increment(1),
           // });
           riskMatrix = {
             ["risk" +
             riskPrevData.riskProbability +
             riskPrevData.riskImpact]: this.database.frb.firestore.FieldValue.increment(-1),
             ["risk" +
             riskCurrData.riskProbability +
             riskCurrData.riskImpact]: this.database.frb.firestore.FieldValue.increment(1),
           };

      }else if(!riskPrevData){
          // batch.update(a, {
          //    ["risk" +
          //    riskCurrData.riskProbability +
          //    riskCurrData.riskImpact]: this.database.frb.firestore.FieldValue.increment(1),
          //  });
          riskMatrix =  {
             ["risk" +
             riskCurrData.riskProbability +
             riskCurrData.riskImpact]: this.database.frb.firestore.FieldValue.increment(1),
           };
      }

      if(transaction){
        const a = this.database.afs
            .collection(this.database.allCollections.minutelykpi)
            .doc(navData.subscriberId).ref;
        transaction.update(a, {
           ...riskMatrix
         });
      } else {
        return riskMatrix;
      }

      //------------------only for risk------------
    //   if(!transaction){
    //     batch
    //     .commit()
    //     .then(() => res(true))
    //     .catch((err) => {});
    //   }
    // });
  }

  getKpiData(subscriberId: string)
  {
    return this.database.getDocumentSnapshotById(this.database.allCollections.minutelykpi,subscriberId)
      .pipe(
        map((a) => {
          const data = a.payload.data();
          return data ;
        })
      );
  }
}
