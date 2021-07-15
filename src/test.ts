// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import "zone.js/dist/zone-testing";
import { getTestBed } from "@angular/core/testing";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";

declare const require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Then we find all the tests.
// const context = require.context('./', true, /\.spec\.ts$/);

//=======  meeting =============

// ##1. create-meeting
//const context = require.context("./", true, /create-meeting.page\.spec\.ts$/);
//.....................................
//##1.a. meeting-basic-info-edit
// const context = require.context(
//   "./",
//   true,
//   /meeting-basic-info-edit.component\.spec\.ts$/
// );
//.....................................
//##1.b. meeting-attendee-edit
// const context = require.context(
//   "./",
//   true,
//   /meeting-attendee-edit.component\.spec\.ts$/
// );
//.....................................
// ##1.c. meeting-agenda-note-edit
// const context = require.context(
//   "./",
//   true,
//   /meeting-agenda-note-edit.component\.spec\.ts$/
// );
//.....................................
// ##1.d. meeting-location-edit
// const context = require.context(
//   "./",
//   true,
//   /meeting-location-edit.component\.spec\.ts$/
// );
//.....................................
// ##2. MEETING DETAILS
// const context = require.context("./", true, /meeting-details.page\.spec\.ts$/);
//.....................................
//##2.a. meeting-basic-info.component
const context = require.context(
  "./",
  true,
  /meeting-basic-info.component\.spec\.ts$/
);
//.....................................
// ##2.b. meeting-attendees.component
// const context = require.context(
//   "./",
//   true,
//   /meeting-attendees.component\.spec\.ts$/
// );
//.....................................
// ##00. datbase service
// const context = require.context("./", true, /database.service\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
