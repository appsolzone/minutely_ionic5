export interface ShepherdAction {
  type: string;
  callBack: Function | null;
  classes: string;
  text: string;
}
export interface ShepherdStep {
  title: string;
  text: string;
  className: string;
  isNext: boolean;
  // callBack: Function | null;
  buttons: ShepherdAction[];
}
export enum ShepherButton {
  Hide = "hide",
  Back = "back",
  Next = "next",
}
