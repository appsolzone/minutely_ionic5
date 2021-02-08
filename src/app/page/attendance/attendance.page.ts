import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../shared/session/session.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.page.html',
  styleUrls: ['./attendance.page.scss'],
})
export class AttendancePage implements OnInit {
  // session
  sessionInfo: any;

  constructor(
    private session: SessionService,
  ) {
    this.session.watch().subscribe(value=>{
      this.sessionInfo = value;
      console.log("Subscription got AttendancePage", this.sessionInfo);
    })
  }

  ngOnInit() {
  }

}
