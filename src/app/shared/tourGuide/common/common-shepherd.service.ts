import { Injectable } from "@angular/core";
import { ShepherdService } from "angular-shepherd";
import { ShepherdStep } from "src/app/interface/sheperdStep";
import { Plugins } from "@capacitor/core";

const { Storage } = Plugins;
@Injectable({
  providedIn: "root",
})
export class CommonShepherdService {
  constructor(private shepherdService: ShepherdService) {
    this.shepherdSetup();
  }

  private shepherdSetup() {
    const tour = {
      defaultStepOptions: {
        cancelIcon: {
          enabled: true,
        },
        classes: "class-1 class-2",
        scrollTo: { behavior: "smooth", block: "center" },
      },
      useModalOverlay: true,
      arrow: true,
    };
    return tour;
  }

  public shepherdStep(step) {
    const { title, text, className, isNext, buttons } = step as ShepherdStep;
    const defaultButtons: any[] = [
      {
        action() {
          return this.back();
        },
        classes: "shepherd-button-secondary",
        text: "Back",
      },
      {
        action() {
          // if(callBack != null){
          //   callBack();
          // }
          return this.next();
        },
        text: "Next",
      },
    ];
    return {
      title: title,
      text: text,
      attachTo: {
        element: className,
        on: "bottom",
      },
      canClickTarget: false,
      buttons: buttons
        ? buttons.map((b) => {
            return {
              action() {
                if (b.callBack != null) {
                  b.callBack();
                }
                switch (b.type) {
                  case "next":
                    return this.next();
                  case "back":
                    return this.back();
                  case "hide":
                    return this.hide();
                  default:
                    return this.hide();
                }
              },
              classes: b.classes,
              text: b.text,
            };
          })
        : defaultButtons,
      id: className,
      attachment: "bottom right",
      targetAttachment: "bottom left",
    };
  }

  public sheperdInit(steps: ShepherdStep[]) {
    this.shepherdService.defaultStepOptions = this.shepherdSetup();
    this.shepherdService.modal = true;
    this.shepherdService.confirmCancel = true;
    let allSteps = steps.map((step) => this.shepherdStep(step));
    this.shepherdService.addSteps(allSteps);
  }
  public shepherdStart(): void {
    this.shepherdService.start();
  }
  public shepherdHide(): void {
    this.shepherdService.hide();
  }
  public shepherdIsActive(): boolean {
    return this.shepherdService.isActive;
  }
  public shepherdRemove(): boolean {
    return true;
  }

  // set visisted for a specific type
  setVisited(tourId: string) {
    if (tourId) {
      Storage.set({
        key: tourId,
        value: "complete",
      });
    }
  }
  // get the visited value for a tourid
  async getVisited(tourId: string) {
    if (tourId) {
      const ret = await Storage.get({ key: tourId });
      const visited = ret.value && ret.value != "undefined" ? ret.value : null;
      return visited;
    }
    return null;
  }
}
