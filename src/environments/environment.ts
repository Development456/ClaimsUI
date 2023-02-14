// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


export const environment = {
  production: false,
  URL:'http://172.174.113.233:8080',
  // CLAIM:'http://20.62.171.46:9000',
// FACILITY:'http://20.62.171.46:9001',
// CUSTOMER:'http://20.62.171.46:9002',
// LOGIN:'http://20.62.171.46:9003',
// API:'http://20.62.171.46:9090',
  CLAIM: 'http://localhost:8100',
  FACILITY: 'http://localhost:8200',
  CUSTOMER: 'http://localhost:8400',
  LOGIN: 'http://localhost:8300',
  AUTH_URL: 'http://172.174.113.233:9002',
  API: 'http://localhost:8500'

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
