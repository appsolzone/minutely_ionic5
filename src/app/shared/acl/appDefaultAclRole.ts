// This holds the default kpi acl limits for the app
// This can be linked to the free plan kpi
import { Acl, Permissions, Features } from "src/app/interface/acl";

const appDefaultAclFeatures: Features = {
    'settings':{
      behaviour: '',
      freeLimit: null,
      featureName: 'App Settings', // module name for end user reference
      description: 'Application settings page to manage access, roles, and other permissions.', // description of the end point, this is to be used as message for access denied prompt
      access: false,
      redirectPath: null,
    },
    'admin':{
      behaviour: '',
      freeLimit: null,
      featureName: 'Manage organisation', // module name for end user reference
      description: 'Manage organisation, edit organisation info, user management, user access management', // description of the end point, this is to be used as message for access denied prompt
      access: false,
      redirectPath: null,
    },
    'subscription':{
      behaviour: '',
      freeLimit: null,
      featureName: 'Manage subscription', // module name for end user reference
      description: 'Manage application subscription', // description of the end point, this is to be used as message for access denied prompt
      access: false,
      redirectPath: null,
    },
    'broadcast-message': {
      behaviour: '',
      freeLimit: null,
      featureName: 'Message broadcast',
      description: 'Broadcast message for a target audience',
      access: false,
      // uiFlag: true,
      redirectPath: null,
    },
    'create-meeting': {
      behaviour: '',
      freeLimit: null,
      featureName: 'Create meeting',
      description: 'Create new meeting',
      access: false,
      // uiFlag: true,
      redirectPath: null,
    },
    // 'share-meeting': {
    //   behaviour: '',
    //   freeLimit: null,
    //   featureName: 'Share meeting',
    //   description: 'Share meeting minutes through mail.',
    //   access: false,
    //   // uiFlag: true,
    //   redirectPath: null,
    // },
    'create-project-item': {
      behaviour: '',
      freeLimit: null,
      featureName: 'Create project item',
      description: 'Create project items like task, issues, risks',
      access: false,
      // uiFlag: true,
      redirectPath: null,
    },
    'create-task': {
      behaviour: '',
      freeLimit: null,
      featureName: 'Create Task',
      description: 'Create new task',
      access: false,
      // uiFlag: true,
      redirectPath: null,
    },
    'create-issue': {
      behaviour: '',
      freeLimit: null,
      featureName: 'Create Issue',
      description: 'Create new issue',
      access: false,
      // uiFlag: true,
      redirectPath: null,
    },
    'create-risk': {
      behaviour: '',
      freeLimit: null,
      featureName: 'Create Risk',
      description: 'Create new risk',
      access: false,
      // uiFlag: true,
      redirectPath: null,
    },
    // 'share-project-item': {
    //   behaviour: '',
    //   freeLimit: null,
    //   featureName: 'Share project item details',
    //   description: 'Share project item details throgh mail',
    //   access: false,
    //   // uiFlag: true,
    //   redirectPath: null,
    // },
    // 'link-project-item': {
    //   behaviour: '',
    //   freeLimit: null,
    //   featureName: 'Link items',
    //   description: 'Link project items from each other',
    //   access: false,
    //   // uiFlag: true,
    //   redirectPath: null,
    // },
    'comments-log': {
      behaviour: '',
      freeLimit: null,
      featureName: 'Discussion comments',
      description: 'Post a comment in discussion board',
      access: false,
      // uiFlag: true,
      redirectPath: null,
    },
    // 'clone-meeting': {
    //   behaviour: '',
    //   freeLimit: null,
    //   featureName: 'Clone meeting',
    //   description: 'Create new meeting using another meeting as reference',
    //   access: false,
    //   // uiFlag: true,
    //   redirectPath: null,
    // },

};

// const appDefaultAclPermissions: Permissions = {
//   'settings':{
//     moduleName: 'App Settings', // module name for end user reference
//     path: 'settings', // app routing path
//     redirectPath: "/", // app routing path on dismiss of no access message/page
//     pathName: 'Settings', // end point name
//     description: 'Application settings page to manage access, roles, and other permissions.', // description of the end point, this is to be used as message for access denied prompt
//     access: false,
//   },
//   'profile':{
//     moduleName: 'User profile', // module name for end user reference
//     path: 'profile', // app routing path
//     redirectPath: "/profile", // app routing path on dismiss of no access message/page
//     pathName: 'Profile', // end point name
//     description: 'User profile page to be managed by user', // description of the end point, this is to be used as message for access denied prompt
//     access: true,
//   },
//   'admin':{
//     moduleName: 'Manage organisation', // module name for end user reference
//     path: 'admin', // app routing path
//     redirectPath: "/", // app routing path on dismiss of no access message/page
//     pathName: 'Admin', // end point name
//     description: 'Manage organisation, edit organisation info, user management, user access management', // description of the end point, this is to be used as message for access denied prompt
//     access: false,
//   },
//   'subscription':{
//     moduleName: 'Manage subscription', // module name for end user reference
//     path: 'subscription', // app routing path
//     redirectPath: "/", // app routing path on dismiss of no access message/page
//     pathName: 'Subscription', // end point name
//     description: 'Manage application subscription', // description of the end point, this is to be used as message for access denied prompt
//     access: false,
//   },
//   'notification':{
//     moduleName: 'Alerts and Notifications', // module name for end user reference
//     path: 'notification', // app routing path
//     redirectPath: "/", // app routing path on dismiss of no access message/page
//     pathName: 'Notification', // end point name
//     description: 'Alerts and notifications', // description of the end point, this is to be used as message for access denied prompt
//     access: false,
//   },
//
// };

// const appDefaultAclAclList: Acl[] = [
//   {
//     roleName: 'ADMIN',
//     description: 'Default app ADMIN Role',
//     permissions: {
//       ...appDefaultAclPermissions,
//         'settings':{...appDefaultAclPermissions.settings, access: true},
//         'admin':{...appDefaultAclPermissions.admin, access: true},
//         'subscription':{...appDefaultAclPermissions.subscription,access: true}
//     },
//     features: {
//       ['broadcast-message'] : {...appDefaultAclFeatures['broadcast-message'],access: true}
//     },
//   },
//   {
//     roleName: 'USER',
//     description: 'Default app USER Role',
//     permissions: {
//       ...appDefaultAclPermissions,
//     },
//     features: null,
//   },
// ];
const appDefaultAclAclList: Acl[] = [
  {
    subscriberId: null,
    roleName: 'ADMIN',
    description: 'Default app ADMIN Role',
    features: {
      ...appDefaultAclFeatures,
        'settings':{...appDefaultAclFeatures.settings, access: true},
        'admin':{...appDefaultAclFeatures.admin, access: true},
        'subscription':{...appDefaultAclFeatures.subscription,access: true},
        'broadcast-message': {...appDefaultAclFeatures['broadcast-message'],access: true},
        'create-meeting': {...appDefaultAclFeatures['create-meeting'],access: true},
        'create-task': {...appDefaultAclFeatures['create-task'],access: true},
        'create-issue': {...appDefaultAclFeatures['create-issue'],access: true},
        'create-risk': {...appDefaultAclFeatures['create-risk'],access: true},
        'create-project-item': {...appDefaultAclFeatures['create-project-item'],access: true},
        'comments-log': {...appDefaultAclFeatures['comments-log'],access: true},
    },
  },
  {
    subscriberId: null,
    roleName: 'USER',
    description: 'Default app USER Role',
    features: {
      ...appDefaultAclFeatures,
      'comments-log': {...appDefaultAclFeatures['comments-log'],access: true},
    },
  },
];

export {
  appDefaultAclFeatures,
  // appDefaultAclPermissions,
  appDefaultAclAclList
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
