package com.ewayrapidandroid.shipping;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.ewaypayments.sdk.android.beans.ShippingDetails;
import com.ewayrapidandroid.address.PrepareAddress;

public class PrepareShippingAddress {

    public static ShippingDetails createShippingDetails(ReadableMap shippingMap) {
        ReadableMapKeySetIterator iterator = shippingMap.keySetIterator();
        ShippingDetails shippingDetails = new ShippingDetails();
        while (iterator.hasNextKey()) {
            String key = iterator.nextKey();
            switch (key) {
                case "address":
                    ReadableMap addressObj = shippingMap.getMap(key);
                    if (addressObj != null) {
                        shippingDetails.setShippingAddress(PrepareAddress.createAddress(addressObj));
                    }
                    break;
                case "firstName":
                    shippingDetails.setFirstName(String.valueOf(shippingMap.getString(key)));
                    break;
                case "lastName":
                    shippingDetails.setLastName(String.valueOf(shippingMap.getString(key)));
                    break;
                case "email":
                    shippingDetails.setEmail(String.valueOf(shippingMap.getString(key)));
                    break;
                case "phone":
                    shippingDetails.setPhone(String.valueOf(shippingMap.getString(key)));
                    break;
                case "fax":
                    shippingDetails.setFax(String.valueOf(shippingMap.getString(key)));
                    break;
                default:
                    break;
            }
        }
        return shippingDetails;
    }
}
