
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const AddExpenseButton = () => {
  return (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.plus}>＋</Text>
    </TouchableOpacity>
  );
};

export default AddExpenseButton;

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#4caf50',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  plus: {
    fontSize: 30,
    color: 'white',
  },
});
