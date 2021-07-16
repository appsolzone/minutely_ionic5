import { Injectable } from "@angular/core";
import { Platform } from "@ionic/angular";
import { ShepherdStep, ShepherButton } from "src/app/interface/sheperdStep";
import { CommonShepherdService } from "../common/common-shepherd.service";

@Injectable({
  providedIn: "root",
})
export class OthersGuideService {
  isMobile: string = "sm";
  constructor(
    private common: CommonShepherdService,
    private platform: Platform
  ) {
    this.isMobile =
      // this.platform.is('mobile') && !this.platform.is('tablet') ? 'sm' : 'md';
      this.platform.width() < 768 ? "sm" : "md";
  }

  steps: ShepherdStep[] = [
    {
      title: "Manage complete lifecycle",
      text: `Manage complete lifecycle of tasks, issues and risks. Collaborate on them with team members`,
      className: ".taskIssueRiskNav",
      isNext: true,
      buttons: [
        {
          type: ShepherButton.Hide,
          callBack: null,
          classes: "shepherd-button-secondary",
          text: "Hide",
        },
        {
          type: ShepherButton.Next,
          callBack: null,
          classes: "null",
          text: "Next",
        },
      ],
    },
    {
      title: "Check Notification",
      text: `Get notified on the upcoming meetings, tasks , risks etc assigned to you.`,
      className: ".notificationNav",
      isNext: false,
      buttons: [
        {
          type: ShepherButton.Hide,
          callBack: null,
          classes: "shepherd-button-secondary",
          text: "Skip",
        },
        {
          type: ShepherButton.Back,
          callBack: null,
          classes: "shepherd-button-secondary",
          text: "Back",
        },
        {
          type: ShepherButton.Next,
          callBack: null,
          classes: "null",
          text: "Next",
        },
      ],
    },
  ];

  public async sheperdStart() {
    // let isVisited = await this.common.getVisited("createMeetingGuide");
    // if (isVisited && this.isMobile == "sm") {
    this.common.sheperdInit(this.steps);
    this.common.shepherdStart();
    this.common.setVisited("taskIssueRiskPageVisit");
    // }
  }
}
