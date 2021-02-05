import { Injectable } from '@angular/core';
// firebase
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from "firebase/app";
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  public frb: any = firebase;
  public allCollections = {
    users: 'users',
    subscribers: 'subscribers',
    plans: 'subscriptionOptions',
    notifications: 'notifications',
    useruids:'useruids'
  };

  constructor(
    public afs: AngularFirestore,
  ) {
    // TBA
  }
  // create
  addDocument(collection:string, docObject:any){
    return this.afs.collection(collection).add(docObject);
  }
  generateDocuemnetRef(collection:string){
    return this.afs.collection(collection).doc();
  }
  // Read
  getDocumentById(collection:string, id:string){
    return this.afs.collection(collection).doc(id).ref.get();
  }
  getAllDocuments(collection:string){
    return this.afs.collection(collection).ref.get();
  }
  getAllDocumentsByQuery(collection:string, queryObj:any[]=[]){
    return this.afs.collection(collection,
                               ref=>this.buildQuery(ref,queryObj)
                             )
                    .get()
                    .toPromise();
  }
  // read and watch
  getDocumentSnapshotById(collection:string, id:string){
    return this.afs.collection(collection).doc(id).snapshotChanges();
  }
  getAllDocumentsSnapshot(collection:string){
    return this.afs.collection(collection).snapshotChanges();
  }
  getAllDocumentsSnapshotByQuery(collection:string, queryObj:any[]=[]){
    return this.afs.collection(collection,
                               ref=>this.buildQuery(ref,queryObj)
                             )
                    .snapshotChanges();
  }
  buildQuery(ref,queryObj:any[]=[]){
    queryObj.forEach(q=>{ref=ref.where(q.field,q.operator,q.value);});
    return ref;
  }
  // Update
  setDocument(collection:string, id:string, docObject:any, merge:boolean=false){
    return this.afs.collection(collection).doc(id).set(docObject,{merge: merge});
  }
  updateDocument(collection:string, id:string, docObject:any){
    return this.afs.collection(collection).doc(id).update(docObject);
  }
  // Delete
  deleteDocument(collection:string, id:string){
    return this.afs.collection(collection).doc(id).delete();
  }
  // transaction and batch
  setTransactDocument(transRef:any, docRef: any, docObject:any, merge:boolean=false){
    return transRef.set(docRef, docObject,{merge: merge});
  }
  updateTransactDocument(transRef:any, docRef: any, docObject:any){
    return transRef.update(docRef, docObject);
  }
  deleteTransactDocument(transRef:any, docRef: any){
    return transRef.delete(docRef);
  }

}
