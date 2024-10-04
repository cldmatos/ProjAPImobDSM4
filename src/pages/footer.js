// Footer.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Footer = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Developed by Claudio Matos and Felipe Ferreira &copy;</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: '#3498db',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 14,
  },
});

export default Footer;
