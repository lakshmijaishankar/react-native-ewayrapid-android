import { TurboModuleRegistry, type TurboModule } from 'react-native';

export type Country = 'AU' | 'NZ';

export type EwayCredentials = {
  readonly EWAY_API_KEY: string;
  readonly EWAY_END_POINT: string;
  readonly EWAY_API_PASSWORD: string;
  readonly EWAY_PUBLIC_KEY: string;
};

export enum TransactionType {
  PURCHASE = 'Purchase',
  MOTO = 'MOTO',
  RECURRING = 'Recurring',
}

export type Phone = string;

export type Payment = {
  totalAmount: number;
  currencyCode: 'AUD';
  invoiceReference?: string;
  invoiceDescription?: string;
  invoiceNumber?: string;
};

export type LineItem = {
  sku: string;
  description: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  totalAmount: number;
};

export type ShippingMethod =
  | 'Unknown'
  | 'LowCost'
  | 'DesignatedByCustomer'
  | 'International'
  | 'Military'
  | 'NextDay'
  | 'StorePickup'
  | 'TwoDayService'
  | 'ThreeDayService'
  | 'Other';

export type Address = {
  street1?: string;
  street2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
};

export type Title = 'Mr' | 'Ms' | 'Mrs' | 'Miss' | 'Dr' | 'Sir' | 'Prof';

export type Customer = {
  reference?: string;
  title?: Title;
  firstName: string;
  lastName: string;
  companyName?: string;
  jobDescription?: string;
  email: string;
  phone: Phone;
  mobile?: string;
  comments?: string;
  fax?: string;
  url?: string;
  address?: Address;
  cardDetails: Card;
};

export type ShippingAddress = {
  shippingMethod?: ShippingMethod;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: Phone;
  fax?: string;
  address?: Address;
};

export type Card = {
  Name: string;
  Number: string;
  ExpiryMonth: string;
  ExpiryYear: string;
  CVN: string;
};

export type Transaction = {
  transactionType: TransactionType;
  customer: Customer;
  shippingAddress: ShippingAddress;
  payment: Payment;
  lineItems: LineItem[];
  options?: string[];
  partnerId?: string;
};

export type PrepareTransactionErr = {
  name: string;
  message: string;
  stack: string;
};

export type EwayPaymentSuccess = {
  status: string;
  accessCode: string;
};

export type EwayPaymentError = {
  errors: string;
  errorMessages: string[];
};

export interface Verification {
  CVN: number;
  Address: number;
  Email: number;
  Mobile: number;
  Phone: number;
}

export type BeagleVerification = {
  Email: number;
  Phone: number;
};

export type TransactionRecord = {
  Transactions: Array<{
    AuthorisationCode: string | null;
    ResponseCode: string | null;
    ResponseMessage: string | null;
    InvoiceNumber: string;
    InvoiceReference: string;
    TotalAmount: number;
    TransactionID: number;
    TransactionStatus: boolean;
    TokenCustomerID: string | null;
    BeagleScore: string | null;
    Options: unknown[];
    Verification: Verification;
    BeagleVerification: BeagleVerification;
    Customer: {
      TokenCustomerID: string | null;
      Reference: string | null;
      Title: string;
      FirstName: string;
      LastName: string;
      CompanyName: string | null;
      JobDescription: string | null;
      Street1: string;
      Street2: string | null;
      City: string;
      State: string;
      PostalCode: string;
      Country: Country;
      Email: string;
      Phone: string;
      Mobile: string | null;
      Comments: string | null;
      Fax: string | null;
      Url: string | null;
    };
    CustomerNote: string | null;
    ShippingAddress: {
      ShippingMethod: string | null;
      FirstName: string;
      LastName: string;
      Street1: string;
      Street2: string | null;
      City: string;
      State: string;
      Country: string;
      PostalCode: string;
      Email: string | null;
      Phone: string;
      Fax: string | null;
    };
  }>;
};

export interface Spec extends TurboModule {
  getEwayCredentials(): EwayCredentials;
  prepareTransaction(transaction: Transaction): Promise<{
    data: { success: boolean };
    error: Partial<PrepareTransactionErr> | null;
  }>;
  makePayment(): Promise<{
    success?: EwayPaymentSuccess;
    rejected?: EwayPaymentError;
  }>;
  getAuthHeader(): string;
  encryptCardDetails(cardDetails: { Number: string; CVN: string }): Promise<{
    encrypt: { Number: string; CVN: string } | null;
    error: {
      name: string;
      message: string;
      stack: string;
    } | null;
  }>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('EwayrapidAndroid');
