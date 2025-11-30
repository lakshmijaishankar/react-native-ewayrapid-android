import { memo, useEffect, useMemo, useRef } from 'react';
import {
  Image,
  type ImageStyle,
  type StyleProp,
  StyleSheet,
  TextInput,
  type TextInputProps,
  View,
  type ViewStyle,
} from 'react-native';
import { number } from 'card-validator';
import { formatCardNumber } from '../utils';

interface CardNumberProps extends TextInputProps {
  customValueFormat?: boolean;
  getCardType?: (type: string) => void;
  cardNumContainerStyle?: StyleProp<ViewStyle>;
  showIcon?: boolean;
  iconImageStyle?: StyleProp<ImageStyle>;
}

export const ICONS: Record<string, any> = {
  visa: require('../icons/visa.png'),
  mastercard: require('../icons/mastercard.png'),
  amex: require('../icons/amex.png'),
  discover: require('../icons/discover.png'),
  jcb: require('../icons/jcb.png'),
  dinersclub: require('../icons/dinersclub.png'),
  maestro: require('../icons/maestro.png'),
};

const CardNumber = (props: CardNumberProps) => {
  const {
    placeholder = 'Card Number',
    inputMode = 'numeric',
    placeholderTextColor = '#000000',
    style,
    customValueFormat = false,
    getCardType,
    cardNumContainerStyle,
    showIcon = true,
    maxLength = 20,
    iconImageStyle,
    ...restProps
  } = props;
  const value = restProps.value ?? '';

  const getCardTypeRef = useRef(getCardType);

  const { cardNumVerification, formattedValue } = useMemo(() => {
    const verification = customValueFormat ? null : { ...number(value), value };

    const formatted = !verification
      ? value
      : formatCardNumber(verification.value, verification.card?.gaps ?? []);

    return { cardNumVerification: verification, formattedValue: formatted };
  }, [value, customValueFormat]);

  useEffect(() => {
    if (!cardNumVerification) {
      getCardTypeRef.current?.('');
    }
    getCardTypeRef.current?.(cardNumVerification?.card?.type ?? '');
  }, [cardNumVerification, customValueFormat]);

  if (__DEV__) {
    console.log(
      '%ccardNumVerification',
      'background-color: #0573FF; color:#fff; padding: 6px; border-radius: 4px',
      cardNumVerification
    );
  }

  return (
    <View
      style={[cardNumStyleSheet.cardNumberContainer, cardNumContainerStyle]}
    >
      <TextInput
        placeholder={placeholder}
        inputMode={inputMode}
        placeholderTextColor={placeholderTextColor}
        style={[cardNumStyleSheet.cardNumber, style]}
        maxLength={maxLength}
        {...restProps}
        {...(value && { value: formattedValue })}
      />
      {showIcon && !customValueFormat ? (
        <View style={cardNumStyleSheet.iconContainer}>
          {cardNumVerification?.card?.type ? (
            <Image
              source={ICONS[cardNumVerification.card.type]}
              style={[cardNumStyleSheet.iconImage, iconImageStyle]}
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

const cardNumStyleSheet = StyleSheet.create({
  cardNumber: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    padding: 8,
    minHeight: 48,
    fontWeight: '500',
    fontSize: 16,
    color: '#000000',
  },
  cardNumberContainer: {
    position: 'relative',
  },
  iconContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    borderRadius: 8,
    padding: 10,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
});

export default memo(CardNumber);
