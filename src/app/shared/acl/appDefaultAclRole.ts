// This holds the default kpi acl limits for the app
// This can be linked to the free plan kpi
import { Acl, Permissions, Features } from "src/app/interface/acl";

export const appDefaultAclFeatures: Features = {
    'create-meeting': {
      behaviour: '',
      freeLimit: 60,
      featureName: '',
      description: 'Allowed number of meetings exhausted. Please upgrade your plan to continue creating meetings along with other features of Minutely.',
      access: true,
      // uiFlag: true,
      redirectPath: 'subscription',
    },
    'share-meeting': {
      behaviour: '',
      freeLimit: 60,
      featureName: '',
      description: 'Allowed number of emails to share meeting minutes exhausted. Please upgrade your plan to continue sharing meeting minutes along with other features of Minutely.',
      access: true,
      // uiFlag: true,
      redirectPath: 'subscription',
    },
    'create-project-item': {
      behaviour: '',
      freeLimit: 150,
      featureName: '',
      description: 'Allowed number of project items (Tasks, Issues, Risks combined) exhausted. Please upgrade your plan to continue tracking new project items along with other features of Minutely.',
      access: true,
      // uiFlag: true,
      redirectPath: 'subscription',
    },
    'share-project-item': {
      behaviour: '',
      freeLimit: 0,
      featureName: '',
      description: 'Current plan does not allow sharing project items throuh email. Please upgrade your plan to seemlessly share project items through email along with other features of Minutely.',
      access: true,
      // uiFlag: true,
      redirectPath: 'subscription',
    },
    'link-project-item': {
      behaviour: '',
      freeLimit: 30,
      featureName: '',
      description: 'Allowed number of linked project items (Tasks, Issues, Risks combined) exhausted. Please upgrade your plan to continue tracking and linking new project items along with other features of Minutely.',
      access: true,
      // uiFlag: true,
      redirectPath: 'subscription',
    },
    'comments-log': {
      behaviour: '',
      freeLimit: 200,
      featureName: '',
      description: 'Allowed number of discussion logs, comments exhausted. Please upgrade your plan to continue utilizing discussions, comment logs along with other features of Minutely.',
      access: true,
      // uiFlag: true,
      redirectPath: 'subscription',
    },
    'clone-meeting': {
      behaviour: '',
      freeLimit: 0,
      featureName: '',
      description: 'Your present subscription plan does not include clone meeting feature, please upgrade your subscription to activate clone meetings feature along with other features of Minutely',
      access: true,
      // uiFlag: true,
      redirectPath: 'subscription',
    },
    'broadcast-message': {
      behaviour: '',
      freeLimit: 0,
      featureName: '',
      description: 'Your present subscription plan does not include broadcast message feature, please upgrade your subscription to activate broadcast message feature along with other features of Minutely',
      access: true,
      // uiFlag: true,
      redirectPath: 'subscription',
    },
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
