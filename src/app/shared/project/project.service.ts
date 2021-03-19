import { Injectable } from '@angular/core';
import { DatabaseService } from '../database/database.service';
import { Project } from '../../interface/project';
import { TextsearchService } from '../textsearch/textsearch.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  public projColorStack: any[]= ['secondary', 'success', 'danger', 'tertiary', 'green', 'warning','primary', 'pink'];
  public newProject: Project = {
        projectId: '',
        title: '',
        subscriberId:'',
        status: 'OPEN',
        inceptionDate: new Date(),
        closureDate: null,
        targetClosureDate: null,
        activityCount: 0,
        activities: [],
        estimatedEffort: 0,
        estimatedCost: 0,
        totalEffort: 0,
        totalBillableAmount: 0,
        members: {},
        createdBy:'',
        createdOn: this.db.frb.firestore.FieldValue.serverTimestamp(),
        updatedBy: '',
        updatedOn: this.db.frb.firestore.FieldValue.serverTimestamp(),
      };

  constructor(
    public db: DatabaseService,
    public searchMap: TextsearchService,
  ) { }

  // Read
  getProjectsOnce(queryObj:any[], textSearchObj: any = null, limit: number=null){
    return this.db.getAllDocumentsByQuery(this.db.allCollections.projects, queryObj, textSearchObj, limit);
  }

  getProjects(queryObj:any[], textSearchObj: any = null){
    return this.db.getAllDocumentsSnapshotByQuery(this.db.allCollections.projects, queryObj, textSearchObj);
  }
  getProjectSummary(queryObj:any[], textSearchObj: any = null){
    return this.db.getAllDocumentsSnapshotByQuery(this.db.allCollections.projectSummary, queryObj, textSearchObj);
  }

  // write
  createProject(projectObj, sessionInfo){
      const { uid, subscriberId, userProfile } = sessionInfo;
      let user = { uid: uid, name: userProfile.name, picUrl: userProfile.picUrl, email: userProfile.email };
      let project = {
        ...this.newProject,
        ...projectObj, // replace the default structure with any of the available fields from projObj
        subscriberId: subscriberId,
        createdBy: { ...user },
        updatedBy: { ...user }
      };

      let subRef = this.db.afs.collection(this.db.allCollections.subscribers).doc(subscriberId).ref;

      return this.db.afs.firestore.runTransaction((transaction)=>{
        // This code may get re-run multiple times if there are conflicts.
        return transaction.get(subRef).then((sfDoc)=>{
          let subs = sfDoc.data();
          let projectCount = (subs.projectCount ? (subs.projectCount + 1) : 1);
          let projectId = 'P'+ projectCount.toString();
          let projectDocId = subscriberId+projectId;
          if(project.activities.length ==1){
            let activity = project.activities[0];
            activity.activityId = projectId + 'A1';
            project.activityCount = 1;
          }
          let searchStrings = project.title + ' ' + project.status;
          let projRef = this.db.afs.collection(this.db.allCollections.projects).doc(projectDocId).ref;
          transaction.set(projRef,{...project, projectId: projectId, searchMap: this.searchMap.createSearchMap(searchStrings),});
          transaction.set(subRef,{projectCount: projectCount},{merge: true});
          return {...project, projectId: projectId,};
        });
      });

    }

    // update
    updateProject(id, projectObj, sessionInfo, setClousedate: boolean = false){
        const { uid, subscriberId, userProfile } = sessionInfo;
        let user = { uid: uid, name: userProfile.name, picUrl: userProfile.picUrl, email: userProfile.email };
        let searchStrings = projectObj.title + ' ' + projectObj.status;
        let project = {
          ...this.newProject,
          ...projectObj, // replace the default structure with any of the available fields from projObj
          updatedOn: this.db.frb.firestore.FieldValue.serverTimestamp(),
          updatedBy: { ...user },
          searchMap: this.searchMap.createSearchMap(searchStrings)
        };
        // console.log("setClousedate",setClousedate)
        if(setClousedate){
          project.closureDate = this.db.frb.firestore.FieldValue.serverTimestamp();
        } else {
          project.closureDate = null;
        }
        // console.log("setClousedate project",project)

        return this.db.setDocument(this.db.allCollections.projects, id, project, true);

      }

    createProjectActivity(activity, sessionInfo){
      // activity structure should be as follows
      // {projectId:, acitivityId: (to be created), name: , status: OPEN,}
      let {projectId} = activity;
      let { uid, subscriberId } = sessionInfo;
      let projectDocId = subscriberId+projectId;
      let projRef = this.db.afs.collection(this.db.allCollections.projects).doc(projectDocId).ref;

      return this.db.afs.firestore.runTransaction((transaction)=>{
        // This code may get re-run multiple times if there are conflicts.
        return transaction.get(projRef).then((sfDoc)=>{
          let proj = sfDoc.data();
          proj.activityCount = (proj.activityCount ? (proj.activityCount + 1) : 1);
          activity.activityId = proj.projectId + 'A' + proj.activityCount.toString();
          delete activity.projectId;
          proj.activities.push(activity)
          transaction.set(projRef,proj, {merge: true});
          return {proj, activity};
        });
      });

    }
}
