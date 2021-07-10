import { Injectable } from '@angular/core';
import { DatabaseService } from '../database/database.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(
    public db: DatabaseService,
  ) { }

  updateSettings(parameter: any, value: any, subscriberId: any){
    return this.db.setDocument(
      this.db.allCollections.subscribers,
      subscriberId,
      { settings : {[parameter] : value} },
      true
    );
  }

}
