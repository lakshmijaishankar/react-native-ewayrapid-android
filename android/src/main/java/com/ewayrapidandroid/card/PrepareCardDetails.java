package com.ewayrapidandroid.card;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableMap;
import com.ewaypayments.sdk.android.RapidConfigurationException;
import com.ewaypayments.sdk.android.beans.CardDetails;
import com.ewaypayments.sdk.android.beans.NVPair;
import com.ewaypayments.sdk.android.entities.EncryptItemsResponse;
import com.ewayrapidandroid.exception.ExceptionUtils;

import java.io.IOException;

public class PrepareCardDetails {
    public static CardDetails createCardDetails(@NonNull ReadableMap cardObj, Promise promise) {
        CardDetails cardDetails = new CardDetails();
        try {
            ReadableMapKeySetIterator iterator = cardObj.keySetIterator();
            while (iterator.hasNextKey()) {
                String key = iterator.nextKey();
                NVPair nvPair = new NVPair(key, cardObj.getString(key));
                switch (key) {
                    case "Name":
                        cardDetails.setName(nvPair.getValue());
                        break;
                    case "ExpiryMonth":
                        cardDetails.setExpiryMonth(nvPair.getValue());
                        break;
                    case "ExpiryYear":
                        cardDetails.setExpiryYear(nvPair.getValue());
                        break;
                    default:
                        break;
                }
            }
            String cardNum = cardObj.getString("Number");
            String cvn = cardObj.getString("CVN");
            EncryptItemsResponse encryptItemsResponse = CardEncryption.encryptCard(cardNum, cvn);
            cardDetails.setNumber(encryptItemsResponse.getItems().get(0).getValue());
            cardDetails.setCVN(encryptItemsResponse.getItems().get(1).getValue());
        } catch (RapidConfigurationException | IOException e) {
            WritableMap dataMap = Arguments.createMap();
            WritableMap resultMap = Arguments.createMap();
            dataMap.putBoolean("success", false);
            WritableMap exceptionMessages = ExceptionUtils.createExceptionMessages(e);
            resultMap.putMap("data", dataMap);
            resultMap.putMap("error", exceptionMessages);
            promise.resolve(resultMap);
        }
        return cardDetails;
    }
}
