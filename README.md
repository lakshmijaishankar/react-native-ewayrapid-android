# `react-native-ewayrapid-android`

[![npm version](https://badge.fury.io/js/react-native-ewayrapid-android.svg)](https://www.npmjs.com/package/react-native-ewayrapid-android)

React Native module that integrates the **eWAY Rapid Android SDK** to enable secure, PCI-compliant payment processing in Android applications.

This library provides:

- **Native helpers** to prepare transactions, encrypt card details, and trigger the eWAY payment UI.
- A **React hook** to work with eWAY Rapid from functional components.
- A **Context Provider** to share eWAY configuration and helpers across your app.

> **Note**
> This package currently targets **Android**. iOS support is not included in this module.

---

## Contents

- **[Installation](#installation)**
- **[Basic usage](#basic-usage)**
- **[API](#api)**
  - [Native methods](#native-methods)
  - [`useEwayRapidPayment` hook](#useewayrapidpayment-hook)
  - [`EwayRapidPaymentProvider` & context](#ewayrapidpaymentprovider--context)
- **[Generating a customer token](#generating-a-customer-token)**
- **[Handling eWAY error codes](#handling-eway-error-codes)**
- **[Example: full payment flow](#example-full-payment-flow)**
- **[Example app](#example-app)**
- **[Development & contributing](#development--contributing)**
- **[License](#license)**

---

## Installation

Using **npm**:

```bash
npm install react-native-ewayrapid-android
```

or **Yarn**:

```bash
yarn add react-native-ewayrapid-android
```

### Android setup

This package is built as a modern React Native TurboModule. With autolinking enabled (RN 0.60+), no extra manual linking is required in most setups.

Ensure you have:

- React Native **0.76+** (as used in this repo).
- Android SDK configuration as per standard React Native requirements.
- Valid **eWAY Rapid API credentials** (API key/password) from your eWAY account.

If you face Android build errors related to AndroidX / support libraries, enable **Jetifier** in your android root directory `gradle.properties`:

```properties
android.enableJetifier=true
```

Jetifier helps in making third‑party libraries compatible with your AndroidX project.

For any custom native integration details, refer to the `android` directory of this repository.

---

> **Important (Android)**
> Create an `apikey.properties` file in the root of your Android app directory (for example: `android/app/apikey.properties`) to store your eWAY Rapid API credentials. Make sure this file is loaded from your Gradle configuration and **not** committed to version control.
>
> Example `apikey.properties`:
>
> ```properties
> EWAY_API_KEY="YOUR_EWAY_API_KEY"
> EWAY_END_POINT="EWAY_END_POINT"
> EWAY_API_PASSWORD="YOUR_EWAY_PASSWORD"
> EWAY_PUBLIC_KEY="YOUR_EWAY_PUBLIC_KEY"
> ```

---

## Basic usage

The simplest way to use this library is via the `useEwayRapidPayment` hook or the `EwayRapidPaymentProvider` context.

```tsx
import React from 'react';
import { Button, View } from 'react-native';
import {
  useEwayRapidPayment,
  EwayRapidPaymentProvider,
} from 'react-native-ewayrapid-android';
//demmy transaction object for reference
import { transaction } from 'react-native-ewayrapid-android/lib/typescript/src/types';

function CheckoutScreen() {
  const {
    ewayCredentials,
    authHeader,
    handlePrepareTransaction,
    makeEwayPayment,
    getTransactionRecord,
    handleEncryptCardDetails,
    generateCustomerToken,
  } = useEwayRapidPayment();

  const onPay = async () => {
    // 1. Prepare an eWAY Rapid transaction (see `transaction` shape in `types.ts`)
    //pass actual customer transaction details handlePrepareTransaction
    const response = await handlePrepareTransaction(transaction);
    if (response.data.success) {
      // 2. Trigger native payment UI / flow
      const paymentResponse = await makeEwayPayment();
      if (paymentResponse.success?.status.toLowerCase() === 'accepted') {
        const transactionRecord = await getTransactionRecord<TransactionRecord>(
          paymentResponse.success.accessCode
        );
        console.log('transactionRecord-->', transactionRecord);
      } else {
        console.log(
          'paymentResponse-->',
          paymentResponse.rejected?.errorMessages
        );
      }
    }

    // 3. Optionally: query the transaction record using access code
    // const { data, error } = await getTransactionRecord<MyTransactionResponse>(accessCode);
  };

  return (
    <View>
      <Button title="Pay with eWAY" onPress={onPay} />
    </View>
  );
}

export default function App() {
  return (
    <EwayRapidPaymentProvider>
      <CheckoutScreen />
    </EwayRapidPaymentProvider>
  );
}
```

---

## API

### Native methods

From `src/index.tsx`, the following native methods are exported from the underlying TurboModule `NativeEwayrapidAndroid`:

```ts
import {
  getEwayCredentials,
  prepareTransaction,
  makePayment,
  getAuthHeader,
  encryptCardDetails,
} from 'react-native-ewayrapid-android';
```

- **`getEwayCredentials()`** → `EwayCredentials`

  - Returns the configured eWAY Rapid credentials used by the module.

- **`getAuthHeader()`** → `string`

  - Returns a Basic Auth header string built from the eWAY Rapid credentials.

- **`prepareTransaction(transaction)`**

  - Prepares a Rapid transaction using eWAY's Android SDK.
  - The `transaction` shape is defined in `src/types.ts` (`Transaction` type).

- **`makePayment()`**

  - Triggers the actual payment using the previously prepared transaction.

- **`encryptCardDetails(cardDetails)`**
  - Encrypts card data using eWAY's encryption service.
  - Expects an object containing at least `Number` and `CVN` (card number & CVV).
  - Returns an object with an `encrypt` payload on success or an `error` field when encryption fails.

> For more details on eWAY Rapid endpoints and payloads, see the official docs:
> https://eway.io/api-v3/

---

### `useEwayRapidPayment` hook

```ts
import { useEwayRapidPayment } from 'react-native-ewayrapid-android';
```

The hook centralizes common eWAY Rapid operations and returns:

- **`ewayCredentials`**: `EwayCredentials`
- **`authHeader`**: `string` – Basic Auth header for REST calls.
- **`handlePrepareTransaction(transaction)`**

  - Thin wrapper around `prepareTransaction`.

- **`makeEwayPayment()`**

  - Thin wrapper around `makePayment`.

- **`getTransactionRecord<T>(accessCode: string)`** → `Promise<{ data: T | null; error: Error | null }>`

  - Calls eWAY's Transaction Query endpoint with the given `accessCode`.
  - Returns either parsed `data` or an `error`.

- **`handleEncryptCardDetails(cardDetails)`**

  - Thin wrapper around `encryptCardDetails`.

- **`generateCustomerToken({ customer })`** → `Promise<{ data: GenerateCustomerTokenResponse | null; error: Error | null }>`
  - Encrypts the provided card details and calls eWAY's **Tokens** endpoint.
  - Returns a `TokenCustomerID` on success, which you should persist for future token-based transactions.

Types for these values are available in `src/types.ts`.

---

### `EwayRapidPaymentProvider` & context

````ts
import {
  EwayRapidPaymentProvider,
  useEwayRapidPaymentContext,
} from 'react-native-ewayrapid-android';
``;

- **`EwayRapidPaymentProvider`**
  - Wraps your component tree and provides the same values returned by `useEwayRapidPayment` through React Context.

- **`useEwayRapidPaymentContext()`**
  - Access the context anywhere under the provider.
  - Throws if used outside of `EwayRapidPaymentProvider`.

Example:

```tsx
function PaymentButton() {
  const { makeEwayPayment } = useEwayRapidPaymentContext();

  return <Button title="Pay" onPress={() => makeEwayPayment()} />;
}
````

---

## Generating a customer token

`generateCustomerToken` in the hook/context helps you create a reusable **TokenCustomerID**.

Shape of the input (see `GenerateCustomerToken` in `src/types.ts`):

```ts
type GenerateCustomerToken = {
  customer: {
    firstName: string;
    lastName: string;
    title: string;
    cardDetails: {
      Name: string;
      Number: string; // PAN to be encrypted
      ExpiryMonth: string;
      ExpiryYear: string;
      CVN: string;
    };
    country: string;
  };
};
```

Usage example:

```tsx
const { generateCustomerToken } = useEwayRapidPayment();

const onSaveCard = async () => {
  const { data, error } = await generateCustomerToken({
    customer: {
      firstName: 'John',
      lastName: 'Doe',
      title: 'Mr',
      country: 'AU',
      cardDetails: {
        Name: 'John Doe',
        Number: '5105105105105100',
        ExpiryMonth: '02',
        ExpiryYear: '26',
        CVN: '123',
      },
    },
  });

  if (error) {
    // handle error (e.g. show message)
    return;
  }

  const tokenCustomerId = data?.Customer.TokenCustomerID;
  // Persist tokenCustomerId in your backend for future payments
};
```

---

## Handling eWAY error codes

The eWAY Rapid API returns **error codes** (e.g. `V6048,V6033`) that map to human‑readable messages. This library exposes a small helper `getMessages` to translate those codes.

```ts
import { getMessages } from 'react-native-ewayrapid-android/utils';
```

### Using `getMessages` with `generateCustomerToken`

When `generateCustomerToken` fails, the `Errors` field in the response contains a comma‑separated list of eWAY error codes. You can pass this string to `getMessages` to obtain messages you can show in the UI or logs.

```tsx
const { generateCustomerToken } = useEwayRapidPayment();

const onSaveCard = async () => {
  const { data, error } = await generateCustomerToken({
    customer: {
      firstName: 'John',
      lastName: 'Doe',
      title: 'Mr',
      country: 'AU',
      cardDetails: {
        Name: 'John Doe',
        Number: '5105105105105100',
        ExpiryMonth: '02',
        ExpiryYear: '26',
        CVN: '123',
      },
    },
  });

  if (error || !data || data.Errors) {
    // eWAY returns error codes like "V6048,V6033"
    const errorCodes = data?.Errors ?? '';
    const messages = getMessages(errorCodes);

    messages.forEach(({ errorCode, message }) => {
      console.log(`${errorCode}: ${message}`);
      // or show in UI / toast
    });

    return;
  }

  const tokenCustomerId = data.Customer.TokenCustomerID;
  // Persist tokenCustomerId in your backend for future payments
};
```

For the complete list of eWAY error codes, refer to the official docs:
https://eway.io/api-v3/#response-amp-error-codes

---

## Example: full payment flow

Below is a high-level flow combining most of the helpers:

1. **Prepare a transaction** object that matches `Transaction` type.
2. **Encrypt card details** (optional if you rely fully on native UI input).
3. **Call `prepareTransaction` / `handlePrepareTransaction`.**
4. **Trigger `makePayment`.**
5. **Optionally query** the transaction status with `getTransactionRecord`.
6. **Optionally create a token** with `generateCustomerToken` for future charges.

Refer to `src/types.ts` for a sample `transaction` object and type information.

---

## Example app

This repository includes an example React Native app under the `example` workspace.

Clone the repository:

```bash
git clone https://github.com/lakshmijaishankar/react-native-ewayrapid-android.git
cd react-native-ewayrapid-android
```

Install dependencies:

```bash
yarn
```

Run the example app on Android:

```bash
yarn example android
```

---

## Development & contributing

- **Development workflow** – see [`CONTRIBUTING.md#development-workflow`](CONTRIBUTING.md#development-workflow)
- **Sending a pull request** – see [`CONTRIBUTING.md#sending-a-pull-request`](CONTRIBUTING.md#sending-a-pull-request)
- **Code of conduct** – see [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md)

---

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
