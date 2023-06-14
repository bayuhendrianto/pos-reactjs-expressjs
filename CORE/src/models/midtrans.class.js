// https://docs.midtrans.com/en/after-payment/http-notification?id=sample-for-various-payment-methods

import List from './list.class'

class MidtranNotificationModel {
  constructor(model) {
    model = model || {};
    this.id = model.id || null;
    this.bookingId = model.bookingId || null;
    this.transaction_time = model.transaction_time || null;
    this.transaction_status = model.transaction_status || null;
    this.transaction_id = model.transaction_id || null;
    this.status_message = model.status_message || null;
    this.status_code = model.status_code || null;
    this.signature_key = model.signature_key || null;
    this.payment_type = model.payment_type || null;
    this.order_id = model.order_id || null;
    this.merchant_id = model.merchant_id || null;
    this.masked_card = model.masked_card || null;
    this.gross_amount = model.gross_amount || null;
    this.fraud_status = model.fraud_status || null;
    this.eci = model.eci || null;
    this.currency = model.currency || null;
    this.channel_response_message = model.channel_response_message || null;
    this.channel_response_code = model.channel_response_code || null;
    this.card_type = model.card_type || null;
    this.bank = model.bank || null;
    this.approval_code = model.approval_code || null;
    this.settlement_time = model.settlement_time || null;
    this.transaction_type = model.transaction_type || null;
    this.issuer = model.issuer || null;
    this.acquirer = model.acquirer || null;
    this.permata_va_number = model.permata_va_number || null;
    this.va_numbers = model.va_numbers || [
      {
        va_number: "",
        bank: "",
      },
    ];
    this.payment_amounts = model.payment_amounts || [
      {
        paid_at: "",
        amount: "",
      },
    ];
    this.biller_code = model.biller_code || null;
    this.bill_key = model.bill_key || null;
    this.store = model.store || null;
  }
}

class MidtranNotificationModelList extends List {
  get model() {
    return MidtranNotificationModel;
  }
}

export { MidtranNotificationModel, MidtranNotificationModelList };
