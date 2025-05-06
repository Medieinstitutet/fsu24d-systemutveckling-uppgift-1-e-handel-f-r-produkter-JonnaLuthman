export type ApiResponse = {
  id: string;
  message: string;
  result: {};
};

export type PaypalResponse = {
  billingToken: string,
  facilitatorAccessToken: string,
  orderID: string,
  payerID: string,
  paymentID: string,
  paymentSource: string
}
