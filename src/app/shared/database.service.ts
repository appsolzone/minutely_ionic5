import { Injectable } from '@angular/core';
// firebase
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from "firebase/app";

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
  // Read
  getDocumentById(collection:string, id:string){
    return this.afs.collection(collection).doc(id).snapshotChanges();
  }
  getAllDocuments(collection:string){
    return this.afs.collection(collection).snapshotChanges();
  }
  getAllDocumentsByQuery(collection:string, queryObj:any[]=[]){
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
  updateDocument(collection:string, id:string, docObject:any, merge:boolean=false){
    return this.afs.collection(collection).doc(id).update(docObject);
  }
  // Delete
}
