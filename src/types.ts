import type {
  encryptCardDetails,
  makePayment,
  prepareTransaction,
} from 'react-native-ewayrapid-android';
import {
  TransactionType,
  type EwayCredentials,
  type Transaction,
} from './NativeEwayrapidAndroid';

export type Country = 'AU' | 'NZ';

export type Path =
  | 'transaction'
  | 'accesscodes'
  | 'encrypt'
  | 'customer'
  | 'accesscode';

export const transaction: Transaction = {
  transactionType: TransactionType.PURCHASE,
  payment: {
    totalAmount: 200,
    currencyCode: 'AUD',
  },
  customer: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '1234567890',
    address: {
      country: 'AU',
      postalCode: '12345',
      street1: '123 Main St',
      street2: 'Apt 1',
      city: 'Anytown',
      state: 'NSW',
    },
    cardDetails: {
      Name: 'Eway test',
      Number: '5105105105105100',
      ExpiryMonth: '02',
      ExpiryYear: '26',
      CVN: '123',
    },
  },
  shippingAddress: {
    address: {
      country: 'au',
      postalCode: '5042',
      street1: '10 Selgar Avenue',
      street2: '',
      city: 'TONSLEY',
      state: 'SA',
    },
    firstName: 'Frontend',
    lastName: 'Developer',
    email: 'frontenddeveloper@example.com',
    phone: '1234567890',
  },
  lineItems: [
    {
      sku: '123456',
      description: 'Test Item',
      quantity: 1,
      unitPrice: 200,
      tax: 0,
      totalAmount: 200,
    },
  ],
};

export type GenerateCustomerTokenResponse = {
  Customer: { TokenCustomerID: number | null };
  Errors: string | null;
};

export type GenerateCustomerToken = {
  customer: Pick<
    Required<Transaction['customer']>,
    'firstName' | 'lastName' | 'title' | 'cardDetails'
  > & {
    country: string;
  };
};

export type EwayRapidPaymentProviderProps = {
  children: React.ReactNode;
};

export type EwayRapidPaymentContextType = {
  ewayCredentials: EwayCredentials;
  authHeader: string;
  handlePrepareTransaction: (
    transction: Transaction
  ) => ReturnType<typeof prepareTransaction>;
  makeEwayPayment: () => ReturnType<typeof makePayment>;
  getTransactionRecord: <T>(
    accessCode: string
  ) => Promise<{ data: T | null; error: Error | null }>;
  handleEncryptCardDetails: (
    cardDetails: Parameters<typeof encryptCardDetails>[0]
  ) => ReturnType<typeof encryptCardDetails>;
};
