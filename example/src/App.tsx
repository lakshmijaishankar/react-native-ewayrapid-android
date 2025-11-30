/* eslint-disable react-native/no-inline-styles */
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  getEwayCredentials,
  EwayRapidPaymentProvider,
  useEwayRapidPaymentContext,
  CardNumber,
  CardMonth,
  CardYear,
  CardCvn,
} from 'react-native-ewayrapid-android';
import { useForm, useWatch } from 'react-hook-form';
import { useState } from 'react';
import { transaction } from '../../src/types';
import type { TransactionRecord } from '../../src/NativeEwayrapidAndroid';

const credentials = getEwayCredentials();

export default function App() {
  return (
    <View style={styles.container}>
      <Text>EWAY_API_KEY: {credentials?.EWAY_API_KEY}</Text>
      <EwayRapidPaymentProvider>
        <MakePayment />
      </EwayRapidPaymentProvider>
    </View>
  );
}

type CardDetailsForm = {
  Number: string;
  CVN: string;
  ExpiryMonth: string;
  ExpiryYear: string;
};

function MakePayment() {
  const [cardType, setCardType] = useState<string>('');
  const { control, /* handleSubmit, */ setValue, formState } =
    useForm<CardDetailsForm>({
      defaultValues: {
        Number: '',
        CVN: '',
        ExpiryMonth: '',
        ExpiryYear: '',
      },
    });
  const watchValues = useWatch({ control });

  const { handlePrepareTransaction, makeEwayPayment, getTransactionRecord } =
    useEwayRapidPaymentContext();

  const handleTextChange = (text: string, name: keyof CardDetailsForm) => {
    setValue(name, text);
  };

  /* const onSubmit = (formData: CardDetailsForm) => {
    console.log('formData-->', formData);
  }; */

  return (
    <>
      <View style={{ width: '100%', rowGap: '16' }}>
        <CardNumber
          value={watchValues.Number}
          onChangeText={(text) =>
            handleTextChange(text.replace(/\D/g, ''), 'Number')
          }
          getCardType={(type) => setCardType(type)}
        />
        <View style={{ flexDirection: 'row', columnGap: '16' }}>
          <CardMonth
            style={{ flex: 1 }}
            value={watchValues.ExpiryMonth}
            onChangeText={(text) => handleTextChange(text, 'ExpiryMonth')}
          />
          <CardYear
            style={{ flex: 1 }}
            value={watchValues.ExpiryYear}
            onChangeText={(text) => handleTextChange(text, 'ExpiryYear')}
          />
        </View>
        <CardCvn
          value={watchValues.CVN}
          onChangeText={(text) => handleTextChange(text, 'CVN')}
          cardType={cardType}
        />
        <TouchableOpacity
          style={{
            backgroundColor: '#b9b9e2ff',
            padding: '16',
            borderRadius: 8,
          }}
          activeOpacity={1}
          // onPress={() => handleSubmit(onSubmit)()}
          disabled={!formState.isValid}
        >
          <Text
            style={{ color: '#000', fontWeight: 'bold', textAlign: 'center' }}
            onPress={async () => {
              const response = await handlePrepareTransaction({
                ...transaction,
              });
              console.log('result-->', response);
              if (response.data.success) {
                const paymentResponse = await makeEwayPayment();
                if (
                  paymentResponse.success?.status.toLowerCase() === 'accepted'
                ) {
                  const transactionRecord =
                    await getTransactionRecord<TransactionRecord>(
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
            }}
          >
            Place Order
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingInline: '20',
  },
});
