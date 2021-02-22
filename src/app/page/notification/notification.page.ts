import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  public graphX = {};
  public graphY = {};
  constructor() { }

  ngOnInit() {
    this.graphX = {
     icon: 'cube',
     title: 'Test Cube graph',
     maxValue: 10, //for graphY
     data: [
        {icon: 'restaurant', label: 'Label 1', labelValue: 50, stack: [{cssClass: 'secondary', width: 20, height: 0},{cssClass: 'warning', width: 50, height: 0},{cssClass: 'danger', width: 20, height: 0}]},
        {icon: 'person', label: 'Label 2', labelValue: 30, stack: [{cssClass: 'secondary', width: 30, height: 0}]}
      ],
    };
    this.graphY = {
     icon: 'card',
     title: 'Test Y Cube graph',
     maxValue: 10, //for graphY
     data: [
        {label: 'Label 1', labelValue: 50, stack: [{cssClass: 'primary', width: 0, height: 20},{cssClass: 'secondary', width: 0, height: 50},{cssClass: 'warning', width: 0, height: 70}]},
        {label: 'Label 2', labelValue: 30, stack: [{cssClass: 'tertiary', width: 0, height: 80}]},
        {label: 'Label 2', labelValue: 30, stack: [{cssClass: 'green', width: 0, height: 40},{cssClass: 'warning', width: 0, height: 90}]}
      ],
    };
  }

}
