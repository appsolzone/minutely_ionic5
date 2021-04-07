export interface Notification {
  createdAt: any, //this.db.frb.firestore.FieldValue.serverTimestamp(),
  msgBody: string,
  msgTitle: string,
  origin: {label: string, icon: string, color?: string},
  actions: any[], //{Clear:{text: 'clear', color:, href}},
  refData: any, // data required for any action or oter purpose
  subscriberId: string,
  user: {uid: string, email: string, name: string}
}
