export interface Notification {
  createdAt: any, //this.db.frb.firestore.FieldValue.serverTimestamp(),
  msgBody: string,
  msgTitle: string,
  origin: {label: string, icon: string},
  actions: any, //{Action1:'Dismiss',},
  refData: any, // data required for any action or oter purpose
  subscriberId: string,
  user: {uid: string, email: string, name: string}
}
