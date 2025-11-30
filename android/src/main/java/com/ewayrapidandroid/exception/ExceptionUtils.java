package com.ewayrapidandroid.exception;

import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

public class ExceptionUtils {

    public static WritableMap createExceptionMessages(Exception e) {
        WritableMap errorMap = Arguments.createMap();
        errorMap.putString("name", e.getClass().getSimpleName());
        errorMap.putString(
            "message",
            e.getMessage() != null
                ? e.getMessage()
                : "An error occurred while preparing transaction");
        errorMap.putString("stack", Log.getStackTraceString(e));
        return errorMap;
    }
}
