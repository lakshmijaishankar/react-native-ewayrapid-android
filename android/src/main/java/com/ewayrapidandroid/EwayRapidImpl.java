package com.ewayrapidandroid;

import com.ewayrapidandroid.payment.PreparePayment;
import com.ewayrapidandroid.shipping.PrepareShippingAddress;
import com.ewayrapidandroid.lineitem.PrepareLineItems;
import com.ewayrapidandroid.customer.PrepareCustomer;
import com.ewayrapidandroid.card.CardEncryption;
import com.ewayrapidandroid.exception.ExceptionUtils;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.Promise;

import com.ewaypayments.sdk.android.RapidAPI;
import com.ewaypayments.sdk.android.beans.Transaction;
import com.ewaypayments.sdk.android.beans.TransactionType;
import com.ewaypayments.sdk.android.entities.EncryptItemsResponse;
import com.ewaypayments.sdk.android.RapidConfigurationException;
import com.ewaypayments.sdk.android.entities.SubmitPayResponse;
import com.ewaypayments.sdk.android.entities.UserMessageResponse;

import java.io.IOException;
import java.util.Locale;

import okhttp3.Credentials;

public class EwayRapidImpl {

    public static final String NAME = "EwayrapidAndroid";
    private final Transaction transaction;

    public EwayRapidImpl() {
        this.transaction = new Transaction();
        RapidAPI.RapidEndpoint = BuildConfig.EWAY_END_POINT;
        RapidAPI.PublicAPIKey = BuildConfig.EWAY_PUBLIC_KEY;
    }

    public String getName() {
        return NAME;
    }

    public WritableMap getEwayCredentials() {
        WritableMap map = Arguments.createMap();
        map.putString("EWAY_API_KEY", BuildConfig.EWAY_API_KEY);
        map.putString("EWAY_END_POINT", BuildConfig.EWAY_END_POINT);
        map.putString("EWAY_API_PASSWORD", BuildConfig.EWAY_API_PASSWORD);
        map.putString("EWAY_PUBLIC_KEY", BuildConfig.EWAY_PUBLIC_KEY);
        return map;
    }

    public void prepareTransaction(@NonNull ReadableMap transaction, Promise promise) {
        WritableMap dataMap = Arguments.createMap();
        WritableMap resultMap = Arguments.createMap();
        try {
            ReadableMapKeySetIterator iterator = transaction.keySetIterator();
            while (iterator.hasNextKey()) {
                String objectKey = iterator.nextKey();
                switch (objectKey) {
                    case "payment":
                        ReadableMap paymentObj = transaction.getMap(objectKey);
                        if (paymentObj != null) {
                            this.transaction.setPayment(PreparePayment.createPayment(paymentObj));
                        }
                        break;
                    case "customer":
                        ReadableMap customerObj = transaction.getMap(objectKey);
                        if (customerObj != null) {
                            this.transaction.setCustomer(PrepareCustomer.createCustomer(customerObj, promise));
                        }
                        break;
                    case "lineItems":
                        ReadableArray lineItemsArr = transaction.getArray(objectKey);
                        if (lineItemsArr != null) {
                            this.transaction.setLineItems(PrepareLineItems.createLineItems(lineItemsArr));
                        }
                        break;
                    case "shippingAddress":
                        ReadableMap shippingAddressObj = transaction.getMap(objectKey);
                        if (shippingAddressObj != null) {
                            this.transaction.setShippingDetails(PrepareShippingAddress.createShippingDetails(shippingAddressObj));
                        }
                        break;
                    default:
                        break;
                }
            }
            dataMap.putBoolean("success", true);
            resultMap.putMap("data", dataMap);
            resultMap.putNull("error");
            promise.resolve(resultMap);
        } catch (Exception e) {
            // Handle general exception
            dataMap.putBoolean("success", false);
            WritableMap exceptionMessages = ExceptionUtils.createExceptionMessages(e);
            resultMap.putMap("data", dataMap);
            resultMap.putMap("error", exceptionMessages);
            promise.resolve(resultMap);
        }
    }

    public void makePayment(Promise promise) {
        WritableMap dataMap = Arguments.createMap();
        WritableMap resultMap = Arguments.createMap();
        WritableArray writableArray = Arguments.createArray();
        try {
            this.transaction.setTransactionType(TransactionType.Purchase);
            SubmitPayResponse submitPayResponse = RapidAPI.submitPayment(this.transaction);
            String errors = submitPayResponse.getErrors();
            if (errors == null) {
                dataMap.putString("status", submitPayResponse.getStatus());
                dataMap.putString("accessCode", submitPayResponse.getAccessCode());
                resultMap.putMap("success", dataMap);
                promise.resolve(resultMap);
                return;
            }
            UserMessageResponse userMessageResponse = RapidAPI.userMessage(Locale.getDefault().getLanguage(), errors);
            for (String item : userMessageResponse.getErrorMessages()) {
                writableArray.pushString(item);
            }
            dataMap.putString("errors", errors);
            dataMap.putArray("errorMessages", writableArray);
            resultMap.putMap("rejected", dataMap);
            promise.resolve(resultMap);
        } catch (IOException | RapidConfigurationException e) {
            promise.reject(e);
        }
    }

    public String getAuthHeader() {
        try {
            return Credentials.basic(BuildConfig.EWAY_API_KEY, BuildConfig.EWAY_API_PASSWORD);
        } catch (Exception e) {
            return "";
        }
    }

    public void encryptCardDetails(ReadableMap cardObj, Promise promise) {
        WritableMap dataMap = Arguments.createMap();
        WritableMap resultsMap = Arguments.createMap();
        try {
            EncryptItemsResponse encryptItemsResponse = CardEncryption.encryptCard(cardObj.getString("Number"), cardObj.getString("CVN"));
            // Create nested data object with number and cvn
            if (!encryptItemsResponse.getItems().isEmpty()) {
                dataMap.putString("Number", encryptItemsResponse.getItems().get(0).getValue());
                dataMap.putString("CVN", encryptItemsResponse.getItems().get(1).getValue());
                resultsMap.putMap("encrypt", dataMap);
                resultsMap.putNull("error");
                promise.resolve(resultsMap);
                return;
            }
            dataMap.putString("message", encryptItemsResponse.getErrors());
            resultsMap.putNull("encrypt");
            resultsMap.putMap("error", dataMap);
            promise.resolve(resultsMap);
        } catch (Exception e) {
            WritableMap exceptionMessages = ExceptionUtils.createExceptionMessages(e);
            resultsMap.putMap("error", exceptionMessages);
            resultsMap.putNull("encrypt");
            promise.resolve(resultsMap);
        }
    }
}
