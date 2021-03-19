import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  public allTexts = [
    {text: 'Notified for activities being closed'},
    {text: 'Alerted on Project baseline data update'},
    {text: 'Seemlessly Communicate with your team, be it assiging an activity or getting an update on an activity'},
    {text: 'Informed regarding New project or activity launch'}
  ];
  constructor() { }

  ngOnInit() {}


}
