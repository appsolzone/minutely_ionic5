// This holds the default kpi acl limits for the app
// This can be linked to the free plan kpi
import { Acl, Permissions, Features } from "src/app/interface/acl";

export const appDefaultAclFeatures: Features = {
        "start-activity": {
          behaviour: "",
          freeLimit: 10,
          featureName: "",
          description: "Allowed number of activities exhausted. Please upgrade your plan to continue creating activities along with other features of FieldHour.",
          access: true,
          // uiFlag: true,
          redirectPath: "subscription",
        },
        "activity-search": {
          behaviour: "",
          freeLimit: 10,
          featureName: "",
          description: "",
          access: true,
          // uiFlag: true,
          redirectPath: "timesheet",
        },
        "add-project": {
          behaviour: "string",
          freeLimit: 10,
          featureName: "string",
          description: "Allowed number of projects exhausted. Please upgrade your plan to continue adding projects along with other features of FieldHour.",
          access: true,
          // uiFlag: true,
          redirectPath: "subscription",
        }
};

// export const appDefaultAclPermissions: Permissions = {
//
// };

// export const appDefaultAclAcl: Acl = {
//
// };

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
