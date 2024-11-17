import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../themes/ThemeContext';
import SaveButton from '../../../components/SaveButton';
import apiClient from '../../../../apiClient';
import { rw, rh, rf } from '../../../themes/responsive';

const { width, height } = Dimensions.get('window');

const VerifyCode = ({ route }) => {
  const [code, setCode] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [timer, setTimer] = useState(10);

  const { email } = route.params;

  const { theme } = useTheme();
  const navigation = useNavigation();
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    inputRefs[0].current.focus();
    startTimer();
  }, []);

  const startTimer = () => {
    setIsResendDisabled(true);
    setTimer(30);
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleChange = (text, index) => {
    if (text.length > 1) text = text.slice(-1);
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 3) {
      inputRefs[index + 1].current.focus();
    }

    setError('');
  };

  const handleBackspace = (index) => {
    if (index > 0 && !code[index]) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleVerify = () => {
    if (code.join('').length === 4) {
      setIsLoading(true);
      const otpCode = code.join('');
      
      apiClient.post('/otp-verify', { email, otp: otpCode })
        .then(response => {
          setIsLoading(false);

          if (response.data.message === "OTP verified successfully") {
            navigation.replace('EnterNewPassword', { email });
          } else {
            setError('Invalid verification code');
          }
        })
        .catch(error => {
          setIsLoading(false);
          setError('An error occurred, please try again');
        });
    } else {
      setError('Please enter the 4-digit verification code');
    }
  };

  const handleResend = async () => {
    setIsResendDisabled(true);
    const response = await apiClient.post('/send-otp-email', { email });
    if (response.data.status === "success") {
      startTimer();
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={[styles.container, { backgroundColor: theme.primary }]}>
        <Animatable.View
          animation="bounceIn"
          duration={1000}
          delay={10}
          style={{ justifyContent: 'center', alignItems: 'center' }}
        >
          <Image source={require('../../../../assets/logo.png')} style={{ width: rw(25), height: rw(25) }} />
        </Animatable.View>

        <Text style={[styles.title, { color: theme.accent }]}>Get Your Code</Text>
        <Text style={[styles.subtitle, { color: theme.subtext }]}>
          Please enter the 4-digit code that {'\n'} was sent to your email address.
        </Text>
        <Text style={[styles.email, { color: theme.subtext }]}>
          {email}
        </Text>

        <View style={styles.inputContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={inputRefs[index]}
              style={[
                styles.input,
                {
                  borderColor: digit ? theme.accent : theme.border,
                  color: theme.text,
                },
              ]}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace') handleBackspace(index);
              }}
              keyboardType="numeric"
              maxLength={1}
              textAlign="center"
            />
          ))}
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.resendContainer}>
          <Text style={{ color: theme.text }}>If you don't receive the code </Text>
          <TouchableOpacity disabled={isResendDisabled} onPress={handleResend}>
            <Text
              style={{
                color: theme.accent,
                opacity: isResendDisabled ? 0.5 : 1,
              }}
            >
              {isResendDisabled ? `Resend in ${timer}s` : 'Resend'}
            </Text>
          </TouchableOpacity>
        </View>

        <SaveButton title="Verify and Proceed" onPress={handleVerify} loading={isLoading} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: rw(4),
    paddingTop: rh(15),
  },
  title: {
    fontSize: rf(3),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: rf(2),
    textAlign: 'center',
    marginVertical: rh(1),
  },
  email: {
    fontWeight: 'bold',
    fontSize: rf(2),
    textAlign: 'center',
    marginVertical: rh(1),
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: rh(2),
  },
  input: {
    height: rh(7),
    width: rw(14),
    borderWidth: 1,
    borderRadius: 5,
    fontSize: rf(3),
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: rw(1),
  },
  errorText: {
    color: 'red',
    fontSize: rf(2),
    textAlign: 'center',
    marginBottom: rh(2),
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: rh(0.5),
  },
});

export default VerifyCode;
