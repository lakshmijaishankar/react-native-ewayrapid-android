package com.ewayrapidandroid.customer;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.ewaypayments.sdk.android.beans.Customer;
import com.ewayrapidandroid.address.PrepareAddress;
import com.ewayrapidandroid.card.PrepareCardDetails;

public class PrepareCustomer {

    public static Customer createCustomer(@NonNull ReadableMap customerMap, Promise promise) {
        ReadableMapKeySetIterator iterator = customerMap.keySetIterator();
        Customer customer = new Customer();
        while (iterator.hasNextKey()) {
            String key = iterator.nextKey();
            switch (key) {
                case "firstName":
                    customer.setFirstName(String.valueOf(customerMap.getString(key)));
                    break;
                case "lastName":
                    customer.setLastName(String.valueOf(customerMap.getString(key)));
                    break;
                case "companyName":
                    customer.setCompanyName(String.valueOf(customerMap.getString(key)));
                    break;
                case "jobDescription":
                    customer.setJobDescription(String.valueOf(customerMap.getString(key)));
                    break;
                case "email":
                    customer.setEmail(String.valueOf(customerMap.getString(key)));
                    break;
                case "phone":
                    customer.setPhone(String.valueOf(customerMap.getString(key)));
                    break;
                case "mobile":
                    customer.setMobile(String.valueOf(customerMap.getString(key)));
                    break;
                case "comments":
                    customer.setComments(String.valueOf(customerMap.getString(key)));
                    break;
                case "fax":
                    customer.setFax(String.valueOf(customerMap.getString(key)));
                    break;
                case "title":
                    customer.setTitle(String.valueOf(customerMap.getString(key)));
                    break;
                case "url":
                    customer.setUrl(String.valueOf(customerMap.getString(key)));
                    break;
                case "address":
                    ReadableMap addressObj = customerMap.getMap(key);
                    if (addressObj != null) {
                        customer.setAddress(PrepareAddress.createAddress(addressObj));
                    }
                    break;
                case "cardDetails":
                    ReadableMap cardDetailsObj = customerMap.getMap(key);
                    if (cardDetailsObj != null) {
                        customer.setCardDetails(PrepareCardDetails.createCardDetails(cardDetailsObj, promise));
                    }
                    break;
                default:
                    break;
            }
        }
        return customer;
    }
}
