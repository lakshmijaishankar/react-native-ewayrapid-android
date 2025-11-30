package com.ewayrapidandroid.address;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.ewaypayments.sdk.android.beans.Address;

public class PrepareAddress {

    public static Address createAddress(ReadableMap addressMap) {
        Address address = new Address();
        ReadableMapKeySetIterator iterator = addressMap.keySetIterator();
        while (iterator.hasNextKey()) {
            String key = iterator.nextKey();
            switch (key) {
                case "street1":
                    address.setStreet1(String.valueOf(addressMap.getString(key)));
                    break;
                case "street2":
                    address.setStreet2(String.valueOf(addressMap.getString(key)));
                    break;
                case "city":
                    address.setCity(String.valueOf(addressMap.getString(key)));
                    break;
                case "state":
                    address.setState(String.valueOf(addressMap.getString(key)));
                    break;
                case "country":
                    address.setCountry(String.valueOf(addressMap.getString(key)));
                    break;
                case "postalCode":
                    address.setPostalCode(String.valueOf(addressMap.getString(key)));
                    break;
                default:
                    break;
            }
        }
        return address;
    }

}
