package com.ewayrapidandroid;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;

import androidx.annotation.NonNull;

@ReactModule(name = NativeEwayrapidAndroidSpec.NAME)
public class EwayRapidAndroidMoule extends NativeEwayrapidAndroidSpec {

    private final EwayRapidImpl ewayRapidImpl;

    public EwayRapidAndroidMoule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.ewayRapidImpl = new EwayRapidImpl();
    }

    @Override
    @NonNull
    public String getName() {
        return this.ewayRapidImpl.getName();
    }

    @Override
    @NonNull
    public WritableMap getEwayCredentials() {
        return this.ewayRapidImpl.getEwayCredentials();
    }

    @Override
    public void prepareTransaction(ReadableMap transaction, Promise promise) {
        this.ewayRapidImpl.prepareTransaction(transaction, promise);
    }

    @Override
    public void makePayment(Promise promise) {
        this.ewayRapidImpl.makePayment(promise);
    }

    @Override
    public void encryptCardDetails(ReadableMap cardObj, Promise promise) {
        this.ewayRapidImpl.encryptCardDetails(cardObj, promise);

    }

    @Override
    @NonNull
    public String getAuthHeader() {
        return this.ewayRapidImpl.getAuthHeader();
    }

}
