
// src/features/expense/components/ExpenseSummary.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';

const ExpenseSummary = () => {
  const totalSpent = 240000;
  const budget = 300000;
  const percent = totalSpent / budget;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>이번 달 총 지출</Text>
      <Text style={styles.amount}>{totalSpent.toLocaleString()}원</Text>
      <ProgressBar progress={percent} color="#4caf50" style={styles.progress} />
      <Text style={styles.percent}>{Math.round(percent * 100)}% 사용 중</Text>
    </View>
  );
};

export default ExpenseSummary;

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 16, color: '#888' },
  amount: { fontSize: 28, fontWeight: 'bold', marginVertical: 4 },
  progress: { height: 8, borderRadius: 4, marginTop: 8 },
  percent: { fontSize: 14, color: '#555', marginTop: 4 },
});
