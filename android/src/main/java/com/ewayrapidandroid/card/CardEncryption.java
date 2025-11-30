package com.ewayrapidandroid.card;

import androidx.annotation.NonNull;

import com.ewaypayments.sdk.android.RapidAPI;
import com.ewaypayments.sdk.android.RapidConfigurationException;
import com.ewaypayments.sdk.android.beans.NVPair;
import com.ewaypayments.sdk.android.entities.EncryptItemsResponse;

import java.io.IOException;
import java.util.ArrayList;

public class CardEncryption {

    public static EncryptItemsResponse encryptCard(@NonNull String cardNumber, @NonNull String cvn)
        throws RapidConfigurationException, IOException {
        ArrayList<NVPair> values = new ArrayList<>();
        values.add(new NVPair("Number", cardNumber));
        values.add(new NVPair("CVN", cvn));
        return RapidAPI.encryptValues(values);
    }
}
