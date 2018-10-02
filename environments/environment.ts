// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  // apiUrl: "http://192.168.1.147:8000/api",
  // Rerwite api url to be port 8000 on current connection.
  // This should work with localhost, 127.0.0.1, 0.0.0.0, server ip or any host alias
  // apiUrl: `${document.location.origin}:8000/api`,
  apiUrl: `${document.location.protocol}//${document.location.hostname}:8000/api`,
  paymentReturnUrl:`${document.location.origin}/confirmation?cid={0}`,
  brochure:`${document.location.protocol}//stg.petprotect.co.uk`,
  ccPaymentUrl:`payment/collectpayment`
};
