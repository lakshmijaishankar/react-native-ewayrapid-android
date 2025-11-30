import {
  getAuthHeader,
  getEwayCredentials,
} from 'react-native-ewayrapid-android';
import type { GenerateCustomerToken, Path } from '../types';
import messages from '../../locale/en.json';
import type { Title } from '../NativeEwayrapidAndroid';

export const buildEwayUrl = (path: Path) =>
  getEwayCredentials().EWAY_END_POINT + '/' + path;

export const formatCardNumber = (raw: string, gaps: number[] = []) => {
  const digits = raw.replace(/\D/g, '');
  let result = '';
  for (let i = 0; i < digits.length; i++) {
    result += digits[i];
    if (gaps.includes(i + 1)) {
      result += ' ';
    }
  }
  return result.trim();
};

export const buildEwayBasicAuthHeaders = (headers: HeadersInit_ = {}) => {
  const authHeader = getAuthHeader();
  if (!authHeader) {
    return headers;
  }
  const header: HeadersInit_ = {
    Authorization: authHeader,
    ...headers,
  };
  return header;
};

export const postData = <B extends Record<string, unknown>>(
  url: string,
  body: B,
  header: HeadersInit_ = {}
) =>
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...header,
    },
    body: JSON.stringify(body),
  });

export const getData = (url: string, header: HeadersInit_ = {}) =>
  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...header,
    },
  });

type CustomerTokenData = {
  Customer: {
    Title: Title;
    FirstName: string;
    LastName: string;
    CardDetails: {
      Number: string;
      CVN: string;
      ExpiryMonth: string;
      ExpiryYear: string;
      Name: string;
    };
    Country: string;
  };
  Payment: {
    TotalAmount: 0;
  };
  Method: 'CreateTokenCustomer';
  TransactionType: 'Purchase';
};

export const buildCustomerTokenData = ({
  customer,
}: GenerateCustomerToken): CustomerTokenData => ({
  Customer: {
    Title: customer.title,
    FirstName: customer.firstName,
    LastName: customer.lastName,
    CardDetails: {
      Number: customer.cardDetails.Number,
      CVN: customer.cardDetails.CVN,
      ExpiryMonth: customer.cardDetails.ExpiryMonth,
      ExpiryYear: customer.cardDetails.ExpiryYear,
      Name: customer.cardDetails.Name,
    },
    Country: customer.country,
  },
  Method: 'CreateTokenCustomer',
  TransactionType: 'Purchase',
  Payment: {
    TotalAmount: 0,
  },
});

type ErrorCodes = keyof typeof messages;

/**
 * Retrieves the error messages corresponding to the given error codes.
 *
 * @param {string} errorCodes - A comma-separated string of error codes.
 * @return An array of objects containing the error code and its corresponding message.
 * @see {@link https://eway.io/api-v3/#response-amp-error-codes} for further information on the error codes.
 */
export const getMessages = (errorCodes: string) => {
  return errorCodes.split(',').map((errorCode) => ({
    errorCode,
    message: messages[errorCode as ErrorCodes],
  }));
};
