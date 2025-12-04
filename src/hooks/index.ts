import { useCallback, useRef } from 'react';
import {
  buildCustomerTokenData,
  buildEwayBasicAuthHeaders as buildEwayHeaders,
  buildEwayUrl,
  getData,
  postData,
} from '../utils';
import type {
  GenerateCustomerTokenResponse,
  GenerateCustomerToken,
} from '../types';
import {
  getEwayCredentials,
  getAuthHeader,
  prepareTransaction,
  makePayment,
  encryptCardDetails,
} from 'react-native-ewayrapid-android';

export function useEwayRapidPayment() {
  const ewayCredentials = useRef(getEwayCredentials());
  const authHeader = useRef<string>(getAuthHeader()).current;

  const handlePrepareTransaction = useCallback(prepareTransaction, []);

  const makeEwayPayment = useCallback(makePayment, []);

  /**
   * Encrypt the card details.
   * @param cardDetails - The card details to be encrypted.
   * @returns The encrypted card details as a Promise.
   * @throws An error if the card details cannot be encrypted.
   * @see https://eway.io/api-v3/?shell#encryption-service
   */
  const handleEncryptCardDetails = useCallback(encryptCardDetails, []);

  /**
   * Get the transaction record by access code.
   * @param accessCode - The access code of the transaction.
   * @returns The transaction record as a Promise.
   * @throws An error if the transaction record cannot be fetched.
   * @see https://eway.io/api-v3/#transaction-query
   */
  const getTransactionRecord = useCallback(async function <T>(
    accessCode: string
  ): Promise<{ data: T | null; error: Error | null }> {
    const url = buildEwayUrl('transaction');
    const header = buildEwayHeaders();
    try {
      const response = await getData(`${url}/${accessCode}`, header);
      if (!response.ok) {
        throw new Error('Failed to fetch transaction record');
      }
      return {
        data: (await response.json()) as T,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: error as Error,
      };
    }
  },
  []);

  /**
   * Generate a customer token.
   * @param customer - The customer object containing card details and other information.
   * @returns The generated customer token as a Promise.
   * @throws An error if the customer token cannot be generated.
   * @note It is important to store the TokenCustomerID in the DB, as it will be used for future transactions.
   * @see https://eway.io/api-v3/?shell#tokens
   */
  const generateCustomerToken = useCallback(
    async ({
      customer,
    }: GenerateCustomerToken): Promise<{
      data: GenerateCustomerTokenResponse | null;
      error: Error | null;
    }> => {
      const url = buildEwayUrl('transaction');
      const header = buildEwayHeaders();
      try {
        const encryptedCardDetails = await handleEncryptCardDetails({
          Number: customer.cardDetails.Number,
          CVN: customer.cardDetails.CVN,
        });
        const { encrypt, error } = encryptedCardDetails ?? {};
        if (error?.message) {
          return {
            data: null,
            error,
          };
        }
        const body = buildCustomerTokenData({
          customer: {
            ...customer,
            cardDetails: {
              ...customer.cardDetails,
              // we are using the encryted card number and cvv from the eway rapid encryt function not passing the actual card number and cvv
              Number: encrypt?.Number ?? '',
              CVN: encrypt?.CVN ?? '',
            },
          },
        });
        const response = await postData(url, body, header);
        if (!response.ok) throw new Error('Failed to generate customer token');
        const fullfilledValue = await response.json();
        return {
          data: fullfilledValue as GenerateCustomerTokenResponse,
          error: null,
        };
      } catch (e) {
        return {
          data: null,
          error: e as Omit<Required<Error>, 'cause'>,
        };
      }
    },
    [handleEncryptCardDetails]
  );

  return {
    ewayCredentials: ewayCredentials.current,
    authHeader,
    handlePrepareTransaction,
    makeEwayPayment,
    getTransactionRecord,
    handleEncryptCardDetails,
    generateCustomerToken,
  };
}
