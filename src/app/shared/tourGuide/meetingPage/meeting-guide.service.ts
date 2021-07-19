import { Injectable } from "@angular/core";
import { Platform } from "@ionic/angular";
import { ShepherButton, ShepherdStep } from "src/app/interface/sheperdStep";
import { CommonShepherdService } from "../common/common-shepherd.service";
import { OthersGuideService } from "../others/others-guide.service";

@Injectable({
  providedIn: "root",
})
export class MeetingGuideService {
  isMobile: string = "sm";
  constructor(
    private common: CommonShepherdService,
    private navTourGuide: OthersGuideService,
    private platform: Platform
  ) {
    this.isMobile =
      // this.platform.is('mobile') && !this.platform.is('tablet') ? 'sm' : 'md';
      this.platform.width() < 768 ? "sm" : "md";
  }

  public async meetingDashboardTour(openCreateMeeting: any) {
    let steps: ShepherdStep[] = [
      // {
      //   title: "View Summary",
      //   text: `View summary data with status, click on any to go to relevant sections`,
      //   className: ".view_summery",
      //   isNext: true,
      //   buttons: [
      //     {
      //       type: ShepherButton.Hide,
      //       callBack: null,
      //       classes: "shepherd-button-secondary",
      //       text: "Hide",
      //     },
      //     {
      //       type: ShepherButton.Next,
      //       callBack: null,
      //       classes: null,
      //       text: "Next",
      //     },
      //   ],
      // },
      {
        title: "Create Meeting",
        text: `Click to create your own meeting`,
        className: ".create_meeting",
        // className: `.${
        //   this.platform.width() < 768 ? "sm" : "md"
        // }_create_meeting`,
        isNext: false,
        buttons: [
          {
            type: ShepherButton.Hide,
            callBack: null,
            classes: "shepherd-button-secondary",
            text: "Skip",
          },
          // {
          //   type: ShepherButton.Back,
          //   callBack: null,
          //   classes: "shepherd-button-secondary",
          //   text: "Back",
          // },
          {
            type: ShepherButton.Next,
            callBack: openCreateMeeting,
            classes: null,
            text: "Create Meeting",
          },
        ],
      },
    ];
    let isVisited = await this.common.getVisited("meetingDashboardGuide");
    if (!isVisited) {
      this.common.sheperdInit(steps);
      this.common.shepherdStart();
      this.common.setVisited("meetingDashboardGuide");
    } else {
      // this.navTourGuide.sheperdStart();
    }
  }

  async createMeeting() {
    let featureSteps: ShepherdStep[] = [
      // {
      //   title: "Create Meeting",
      //   text: `Provide the meeting Title, schedule etc`,
      //   className: ".meetingSchedule",
      //   isNext: false,
      //   buttons: [
      //     {
      //       type: ShepherButton.Hide,
      //       callBack: null,
      //       classes: "shepherd-button-secondary",
      //       text: "Skip",
      //     },
      //     {
      //       type: ShepherButton.Next,
      //       callBack: null,
      //       classes: "null",
      //       text: "Next",
      //     },
      //   ],
      // },
      {
        title: "Meeting Title",
        text: `Provide the meeting Title`,
        className: ".meetingTitle",
        isNext: false,
        buttons: [
          {
            type: ShepherButton.Hide,
            callBack: null,
            classes: "shepherd-button-secondary",
            text: "Skip",
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
        title: "Speech Recognition",
        text: `Tap on the mic and speak to record meeting title`,
        className: ".titleSpeech",
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
      {
        title: "Recurrence Meeting",
        text: `Toggle On-off to setup recurring meeting. You can setup Daily, Weekly, Monthly recurrence`,
        className: ".recurrenceMeeting",
        isNext: false,
        buttons: [
          // {
          //   type: ShepherButton.Hide,
          //   callBack: null,
          //   classes: "shepherd-button-secondary",
          //   text: "Skip",
          // },
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
            text: "Hide",
          },
        ],
      },
      // {
      //   title: "Add Attendee",
      //   text: `Invite the members by selecting the members or add them/importing them from csv`,
      //   className: ".attendee",
      //   isNext: false,
      //   buttons: [
      //     {
      //       type: ShepherButton.Hide,
      //       callBack: null,
      //       classes: "shepherd-button-secondary",
      //       text: "Skip",
      //     },
      //     {
      //       type: ShepherButton.Back,
      //       callBack: null,
      //       classes: "shepherd-button-secondary",
      //       text: "Back",
      //     },
      //     {
      //       type: ShepherButton.Next,
      //       callBack: null,
      //       classes: "null",
      //       text: "Next",
      //     },
      //   ],
      // },
      // {
      //   title: "Set Agenda And Notes",
      //   text: `Setup Agenda and Notes of meeting in advance. You can edit them later during the meeting also.`,
      //   className: ".agendaNotes",
      //   isNext: false,
      //   buttons: [
      //     {
      //       type: ShepherButton.Back,
      //       callBack: null,
      //       classes: "shepherd-button-secondary",
      //       text: "Back",
      //     },
      //     {
      //       type: ShepherButton.Next,
      //       callBack: null,
      //       classes: "null",
      //       text: "Done",
      //     },
      //   ],
      // },
    ];
    let isVisited = await this.common.getVisited("createMeetingGuide");
    if (!isVisited) {
      this.common.sheperdInit(featureSteps);
      this.common.shepherdStart();
      this.common.setVisited("createMeetingGuide");
    }
  }
  public async meetingLocation() {
    // let featureSteps: ShepherdStep[] = [
    //   {
    //     title: "Meeting Location",
    //     text: `Provide Zoom, Meet, Skype link etc and login to that platform from here.`,
    //     className: ".meetingLocation",
    //     isNext: false,
    //     buttons: [
    //       {
    //         type: ShepherButton.Hide,
    //         callBack: null,
    //         classes: "shepherd-button-secondary",
    //         text: "Skip",
    //       },
    //       {
    //         type: ShepherButton.Next,
    //         callBack: null,
    //         classes: "null",
    //         text: "Done",
    //       },
    //     ],
    //   },
    // ];
    // let isVisited = await this.common.getVisited("meetingLocationGuide");
    // if (!isVisited) {
    //   this.common.sheperdInit(featureSteps);
    //   this.common.shepherdStart();
    //   this.common.setVisited("meetingLocationGuide");
    // }
  }

  public async meetingAgendaNotesSpeechGuide() {
    // let featureSteps: ShepherdStep[] = [
    //   {
    //     title: "Add Agenda with voice",
    //     text: `Easily add meeting agenda with voice record tool`,
    //     className: ".agendaSpeech",
    //     isNext: true,
    //     buttons: [
    //       {
    //         type: ShepherButton.Hide,
    //         callBack: null,
    //         classes: "shepherd-button-secondary",
    //         text: "Skip",
    //       },
    //       {
    //         type: ShepherButton.Next,
    //         callBack: null,
    //         classes: "null",
    //         text: "Next",
    //       },
    //     ],
    //   },
    //   {
    //     title: "Add notes using voice",
    //     text: `Easily add meeting notes with voice record tool`,
    //     className: ".notesSpeech",
    //     isNext: true,
    //     buttons: [
    //       {
    //         type: ShepherButton.Hide,
    //         callBack: null,
    //         classes: "shepherd-button-secondary",
    //         text: "Skip",
    //       },
    //       {
    //         type: ShepherButton.Next,
    //         callBack: null,
    //         classes: "null",
    //         text: "Done",
    //       },
    //     ],
    //   },
    // ];
    // let isVisited = await this.common.getVisited(
    //   "meetingAgendaNotesSpeechGuide"
    // );
    // if (!isVisited) {
    //   this.common.sheperdInit(featureSteps);
    //   this.common.shepherdStart();
    //   this.common.setVisited("meetingAgendaNotesSpeechGuide");
    // }
  }
}
