export const environment = {
  production: true,
  apiUrl: "/api",
  // apiUrl: `$document.location.origin}/api`,
  // paymentReturnUrl:"https://quote-petprotect.com/confirmation?cid={0}"
  paymentReturnUrl:`${document.location.origin}/confirmation?cid={0}`,
  brochure:`${document.location.protocol}//www.petprotect.co.uk`,
  ccPaymentUrl:`payment/collectpayment`
};
