package com.ewayrapidandroid.lineitem;

import java.util.ArrayList;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.ewaypayments.sdk.android.beans.LineItem;

public class PrepareLineItems {

    public static ArrayList<LineItem> createLineItems(ReadableArray lineItemsArray) {
        ArrayList<LineItem> lineItems = new ArrayList<>();
        for (int i = 0; i <= lineItemsArray.size() - 1; i++) {
            ReadableMap lineItemMap = lineItemsArray.getMap(i);
            LineItem lineItem = new LineItem();
            lineItemMap.getEntryIterator().forEachRemaining(item -> {
                switch (item.getKey()) {
                    case "sku":
                        lineItem.setSKU(String.valueOf(item.getValue()));
                        break;
                    case "description":
                        lineItem.setDescription(String.valueOf(item.getValue()));
                        break;
                    case "quantity":
                        lineItem.setQuantity(Double.valueOf(item.getValue().toString()).intValue());
                        break;
                    case "unitPrice":
                        lineItem.setUnitCost(Double.valueOf(item.getValue().toString()).intValue());
                        break;
                    case "tax":
                        lineItem.setTax(Double.valueOf(item.getValue().toString()).intValue());
                        break;
                    case "totalAmount":
                        lineItem.setTotal(Double.valueOf(item.getValue().toString()).intValue());
                        break;
                    default:
                        break;
                }
            });
            lineItems.add(lineItem);
        }
        return lineItems;
    }
}
