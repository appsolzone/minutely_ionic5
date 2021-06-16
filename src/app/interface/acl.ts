export interface Feature {
  behaviour: string; // directive id to associate the behaviour directive
  freeLimit: number; // no of object instance for Free plan path
  usedLimit?: number; // no of object instance used, this is optional as it'll not be available from template, but to be populated by the update kpi
  featureName: string; // feature name for user reference
  description: string; // description of the feature, this is to be used as message prompt, if any
  access: boolean; // true=> no behaviour to be attached, false => attach behaviour
  // uiFlag: boolean, // what is it used for ???
  redirectPath: string; // redirecd to the path if access is false
}

export interface Features {
    [key: string]: Feature;
}

export interface Permission {
  moduleName: string; // module name for end user reference
  path: string; // app routing path
  redirectPath: string; // app routing path on dismiss of no access message/page
  pathName: string; // end point name
  description: string; // description of the end point, this is to be used as message for access denied prompt
  access: boolean; // true => view access, false=> no access
  features: Features;
}

export interface Permissions {
    [key: string]: Permission;
}

export interface Acl {
  roleName: string;
  description: string;
  permissions: Permissions;
}
