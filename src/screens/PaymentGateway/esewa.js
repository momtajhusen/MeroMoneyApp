import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import CryptoJS from 'crypto-js';

const EsewaPayment = () => {
  const [totalAmount, setTotalAmount] = useState('100');
  const [taxAmount, setTaxAmount] = useState('0');
  const [transactionUUID, setTransactionUUID] = useState('');
  const [productCode, setProductCode] = useState('EPAYTEST');
  const [productServiceCharge, setProductServiceCharge] = useState('0');
  const [productDeliveryCharge, setProductDeliveryCharge] = useState('0');
  const [successUrl, setSuccessUrl] = useState('https://google.com');
  const [failureUrl, setFailureUrl] = useState('https://facebook.com');
  const [signature, setSignature] = useState('');
  const [secretKey, setSecretKey] = useState('8gBm/:&EnhH.1/q');

  // Auto-generate the signature whenever the relevant fields change
  useEffect(() => {
    generateSignature();
  }, [totalAmount, transactionUUID, productCode, secretKey]);

  const generateSignature = () => {
    const currentTime = new Date();
    const formattedTime =
      currentTime.toISOString().slice(2, 10).replace(/-/g, '') +
      '-' +
      currentTime.getHours() +
      currentTime.getMinutes() +
      currentTime.getSeconds();
    setTransactionUUID(formattedTime);

    const secret = secretKey;
    const stringToSign = `total_amount=${totalAmount},transaction_uuid=${formattedTime},product_code=${productCode}`;
    const hash = CryptoJS.HmacSHA256(stringToSign, secret);
    const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
    setSignature(hashInBase64);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('amount', totalAmount);
      formData.append('tax_amount', taxAmount);
      formData.append('total_amount', totalAmount);
      formData.append('transaction_uuid', transactionUUID);
      formData.append('product_code', productCode);
      formData.append('product_service_charge', productServiceCharge);
      formData.append('product_delivery_charge', productDeliveryCharge);
      formData.append('success_url', successUrl);
      formData.append('failure_url', failureUrl);
      formData.append('signed_field_names', 'total_amount,transaction_uuid,product_code');
      formData.append('signature', signature);

      // POST request to eSewa API
      const response = await fetch('https://rc-epay.esewa.com.np/api/epay/main/v2/form', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        Alert.alert('Success', 'Payment initiated successfully!');
      } else {
        Alert.alert('Error', 'Failed to initiate payment');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during payment: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Total Amount"
        value={totalAmount}
        onChangeText={setTotalAmount}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Tax Amount"
        value={taxAmount}
        onChangeText={setTaxAmount}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Product Code"
        value={productCode}
        onChangeText={setProductCode}
        style={styles.input}
      />
      <TextInput
        placeholder="Secret Key"
        value={secretKey}
        onChangeText={setSecretKey}
        style={styles.input}
        secureTextEntry
      />
      <Button title="Pay with eSewa" onPress={handleSubmit} color="#60bb46" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
});

export default EsewaPayment;
