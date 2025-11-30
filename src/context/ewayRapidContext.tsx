import { createContext, useContext, useMemo } from 'react';
import type {
  EwayRapidPaymentProviderProps,
  EwayRapidPaymentContextType,
} from '../types';
import { useEwayRapidPayment } from '../hooks';

const EwayRapidPaymentContext = createContext<
  | (EwayRapidPaymentContextType & {
      generateCustomerToken: ReturnType<
        typeof useEwayRapidPayment
      >['generateCustomerToken'];
    })
  | undefined
>(undefined);

const { Provider } = EwayRapidPaymentContext;

export function EwayRapidPaymentProvider({
  children,
}: EwayRapidPaymentProviderProps) {
  const ewayRapidPayment = useEwayRapidPayment();

  const value = useMemo(() => {
    return {
      ...ewayRapidPayment,
      ewayCredentials: ewayRapidPayment.ewayCredentials,
    };
  }, [ewayRapidPayment]);

  return <Provider value={value}>{children}</Provider>;
}

export function useEwayRapidPaymentContext() {
  const context = useContext(EwayRapidPaymentContext);
  if (!context) {
    throw new Error(
      'useEwayRapidPaymentContext must be used within EwayRapidPaymentProvider'
    );
  }
  return context;
}
