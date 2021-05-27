import { Injectable } from '@angular/core';
import { appDefaultAclKpi } from './appDefaultAclKpi';
import { DatabaseService } from '../database/database.service';

@Injectable({
  providedIn: 'root',
})
export class KpiService {
  // Observable

  // initiate object
  public kpiObject: any = appDefaultAclKpi;

  constructor(private database: DatabaseService) {
    // initialise
  }

  // Read and watch
  getKpis(queryObj: any[], textSearchObj: any = null) {
    return this.database.getAllDocumentsSnapshotByQuery(
      this.database.allCollections.aclKpi,
      queryObj,
      textSearchObj
    );
  }
  getKpisByDocId(docId: string) {
    return this.database.getDocumentSnapshotById(
      this.database.allCollections.aclKpi,
      docId
    );
  }

  // Read once
  getKpisByDocIdOnce(docId: string) {
    return this.database.getDocumentById(
      this.database.allCollections.aclKpi,
      docId
    );
  }

  // check the aclKpi exists
  checkTheAclKpiExist(subscriberId) {
    this.getKpisByDocIdOnce(subscriberId).then(async (res) => {
      const isAclKpiExist = res.exists;
      console.log('checkTheAclKpiExist', res, isAclKpiExist);
      if (!isAclKpiExist) { await this.setAclKpi(subscriberId); }
      // this.initialiseKpi(session);
    });
  }

  // create new kpi object for this organisation
  setAclKpi(subscriberId, kpiObject = null) {
    this.database.setDocument(
      this.database.allCollections.aclKpi,
      subscriberId,
      kpiObject ? kpiObject : this.kpiObject,
      true
    );
  }

  // This is to increase the usage count for the object in concern
  // Pleaes note that we might have to call this multiple permission+feature combination as there may be fetchAllUsers
  // where same object may be created from different end point
  updateKpiDuringCreation(feature: string, session: any, transactionRef: any) {
    const { subscriberId } = session;
    const freeLimitRef = this.database.afs.firestore
      .collection(this.database.allCollections.aclKpi)
      .doc(subscriberId);
    const freeLimitObj = {
      [feature]: {
        usedLimit: this.database.frb.firestore.FieldValue.increment(+1),
      },
    };
    // console.log("free limit obje......", freeLimitObj, feature);
    if (transactionRef) {
      transactionRef.set(freeLimitRef, freeLimitObj, { merge: true });
    } else {
      this.database.setDocument(
        this.database.allCollections.aclKpi,
        subscriberId,
        freeLimitObj,
        true
      );
    }
  }
}
