package com.ewayrapid;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.Promise;

public class EwayrapidAndroidModule extends ReactContextBaseJavaModule {

    private EwayRapidImpl ewayRapidImpl;

    public EwayrapidAndroidModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.ewayRapidImpl = new EwayRapidImpl();
    }

    @Override
    @NonNull
    public String getName() {
        return this.ewayRapidImpl.getName();
    }

    @ReactMethod
    @NonNull
    public WritableMap getEwayCredentials() {
        return this.ewayRapidImpl.getEwayCredentials();
    }

    @ReactMethod
    public void prepareTransaction(@NonNull ReadableMap transaction, Promise promise) {
        this.ewayRapidImpl.prepareTransaction(transaction, promise);
    }

    @ReactMethod
    public void makePayment(Promise promise) {
        this.ewayRapidImpl.makePayment(promise);
    }

    @ReactMethod
    @NonNull
    public String getAuthHeader() {
        return this.ewayRapidImpl.getAuthHeader();
    }

    @ReactMethod
    public void encryptCardDetails(ReadableMap cardObj, Promise promise) {
        this.ewayRapidImpl.encryptCardDetails(cardObj, promise);
    }
    
}