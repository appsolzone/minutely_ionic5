import { Injectable } from '@angular/core';
import { DatabaseService } from '../database/database.service';

@Injectable({
  providedIn: 'root'
})
export class LinkageService {

  public linkAttributes: any ={
    meetings: ['ownerId','meetingStart','meetingEnd','meetingTitle'],
    issues: ['issueInitiator','issueOwner','issueTitle','issueStatus','issueInitiationDate','targetCompletionDate'],
    risks: ['riskInitiator','riskOwner','riskTitle','riskStatus','riskInitiationDate','targetCompletionDate','riskImpact','riskProbability'],
    tasks: ['taskInitiator','taskOwner','taskTitle','taskStatus','taskInitiationDate','targetCompletionDate'],
  };

  constructor(
    private db: DatabaseService,
  )
  {
    // To be used if required
  }

  // Read once
  getLinkagesOnce(id: string, linkType: string){
    let collection = this.db.allCollections.meeting + '/' +
                      id + '/' + linkType;
    return this.db.getAllDocuments(collection);
  }

  // Read and watch
  getLinkages(id: string, linkType: string){
    let collection = this.db.allCollections.meeting + '/' +
                      id + '/' + linkType;
    return this.db.getAllDocumentsSnapshot(collection);
  }

  getLinkData(linkType: string,refData: any){
    let linkData = {};
    this.linkAttributes[linkType.toLowerCase()].forEach((attr)=>{
      linkData[attr] = refData[attr];
    });
    return {...linkData};

  }

  saveDocumentData(collectionName: string, documentId: any, data: any, linkage: any, selfLinkData: any, tranRef:any = null, type: string ='update') {
    return new Promise((resolve: any, reject: any)=>{
      let linkageSubCollections=['meetings','tasks','issues','risks'];
      // initiate a btach
      let batch = tranRef ? tranRef : this.db.afs.firestore.batch(); // initiate batch
      // update ITEM in concern
      //   step 1: update document elements
      let itemRef = this.db.afs.collection(collectionName).doc(documentId).ref;
      if(data){
        // batch.set(itemRef,data,{ merge: true });

        if(data.status=='CANCEL'){
          // If cancel the meeting, no need to update any of the fields, just set the status as cencel
          batch.update(itemRef,{status: 'CANCEL'}, {merge: true});
        } else {
          // Purposely updateed data instead of set with merge true to replace the searchMap
          // with the latestest updated text search values!
          // if(type=='update'){
          //   try{
          //     batch.update(itemRef,data);
          //   } catch(error){
          //     console.log("error", error);
          //     if(error.match(/(No document to update)/ig)){
          //       batch.set(itemRef,data);
          //     } else {
          //       throw error;
          //     }
          //
          //   }
          // } else {
            batch.set(itemRef,data);
          // }

          //   step 2: add newly included linkages
          //   step 3: remove linkages marked as delete
          //   step 4: if any element from step 1 is modified
          //           update reference data of the ITEM for the existing linked objects
          linkageSubCollections.forEach((sub)=>{
            // loop through each of the linkage item
            linkage[sub].forEach((link)=>{
              let linkRef = this.db.afs.collection(collectionName).doc(documentId).collection(sub).doc(link.id).ref;
              let conlinkRef = this.db.afs.collection(sub).doc(link.id).collection(collectionName).doc(documentId).ref;
              let state = link.state;
              // Now remove the following additional elements/properties we added for processing
              // delete link.id;
              // delete link.state;

              switch(state){
                case 'pending':
                  // add the linkage to the item for both current document as well as corresponding document
                  let linkData = this.getLinkData(sub,link.data);
                  batch.set(linkRef,linkData);
                  batch.set(conlinkRef,selfLinkData);
                  break;
                case 'delete':
                  // add the linkage to the item for both current document as well as corresponding document

                  batch.delete(linkRef);
                  batch.delete(conlinkRef);
                  break;
                default:
                  // so this is an existing linkage, update the references if data is modified

                  batch.set(conlinkRef,selfLinkData);
                  break;
              }
            });

          });
        }

      }


      if(tranRef){
        resolve(true);
      } else {
        batch.commit().then(()=>{

          resolve(true);
        }).catch(err =>{

          reject(err);
        });
      }
    });
  }
}
