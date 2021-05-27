// This holds the default kpi acl limits for the app
// This can be linked to the free plan kpi
import { Acl, Permission, Features } from 'src/app/interface/acl';

export const appDefaultAclKpi: Features = {
        'start-activity': {
          behaviour: '',
          freeLimit: 20,
          featureName: '',
          description: 'Allowed number of activities exhausted. Please upgrade your plan to continue creating activities along with other features of FieldHour.',
          access: true,
          // uiFlag: true,
          redirectPath: 'subscription',
        },
        'resume-activity': {
          behaviour: '',
          freeLimit: 500,
          featureName: '',
          description: 'Allowed number of activities exhausted. Please upgrade your plan to continue creating activities along with other features of FieldHour.',
          access: true,
          // uiFlag: true,
          redirectPath: 'subscription',
        },
        'activity-search': {
          behaviour: '',
          freeLimit: 10,
          featureName: '',
          description: '',
          access: true,
          // uiFlag: true,
          redirectPath: 'subscription',
        },
        'add-project': {
          behaviour: 'string',
          freeLimit: 10,
          featureName: 'string',
          description: 'Allowed number of projects exhausted. Please upgrade your plan to continue adding projects along with other features of FieldHour.',
          access: true,
          // uiFlag: true,
          redirectPath: 'subscription',
        }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
