import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccesscontrolService {

  constructor() { }

  canEditProject(session, selectedProject){
    // if the user is the owner of the project return tru
    let {uid} = session;
    if(uid==selectedProject.data.createdBy.uid){
      return {canEdit: true, title: 'Success', body: 'User can edit the project'};
    } else {
      return {canEdit: false, title: 'Warning',
              body: 'Please note that you do not have permission to edit project details. Please contact ' +
                    selectedProject.data.createdBy.name + ' with email ' + selectedProject.data.createdBy.email +' to update project details.'
            };
    }
  }
}
