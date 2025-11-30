package com.ewayrapidandroid.payment;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.ewaypayments.sdk.android.beans.Payment;

public class PreparePayment {

    public static Payment createPayment(ReadableMap prepMapObjToPayment) {
        ReadableMapKeySetIterator paymentIterator = prepMapObjToPayment.keySetIterator();
        Payment payment = new Payment();
        while (paymentIterator.hasNextKey()) {
            String key = paymentIterator.nextKey();
            switch (key) {
                case "totalAmount":
                    payment.setTotalAmount(Double.valueOf(prepMapObjToPayment.getDouble(key)).intValue());
                    break;
                case "currencyCode":
                    payment.setCurrencyCode(String.valueOf(prepMapObjToPayment.getString(key)));
                    break;
                case "invoiceReference":
                    payment.setInvoiceReference(String.valueOf(prepMapObjToPayment.getString(key)));
                    break;
                case "invoiceDescription":
                    payment.setInvoiceDescription(String.valueOf(prepMapObjToPayment.getString(key)));
                    break;
                case "invoiceNumber":
                    payment.setInvoiceNumber(String.valueOf(prepMapObjToPayment.getString(key)));
                    break;
                default:
                    break;
            }
        }
        return payment;
    }

}
