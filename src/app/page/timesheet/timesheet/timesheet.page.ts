import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.page.html',
  styleUrls: ['./timesheet.page.scss'],
})
export class TimesheetPage implements OnInit {

  constructor(
    private router:Router,
  ) { }

  ngOnInit() {
  }

  gotoTimeSheet(){
    this.router.navigate(['/timesheet/fill-timesheet']);
  }

}
