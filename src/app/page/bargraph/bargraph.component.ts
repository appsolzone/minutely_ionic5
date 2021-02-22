import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-bargraph',
  templateUrl: './bargraph.component.html',
  styleUrls: ['./bargraph.component.scss'],
})
export class BargraphComponent implements OnInit {

  @Input() graphX: any;
  @Input() graphY: any;
  public graphYLabelMark: number; //= Math.floor(this.graphY ? this.graphY.data.length/4 : 1);
  // structure of graphX and graphY
  // {
  //  icon: ,
  //  title:,
  //  maxValue: , for graphY
  //  data: [
  //     {icon: form graph X, label:, labelValue, stack: [{cssClass, width: for x graph, height: y graph}]}
  //   ],
  // }
  // cssClass in built are primary, secondary, tertiary, warning, success, danger, pink, green

  constructor() { }

  ngOnInit() {}

}
