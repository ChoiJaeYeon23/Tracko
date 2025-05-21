
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const sampleData = [
  { category: '식비', amount: 120000 },
  { category: '교통', amount: 40000 },
  { category: '고정 지출', amount: 80000 },
];

const CategoryList = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>카테고리별 지출</Text>
      {sampleData.map((item, idx) => (
        <View key={idx} style={styles.row}>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.amount}>{item.amount.toLocaleString()}원</Text>
        </View>
      ))}
    </View>
  );
};

export default CategoryList;

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  category: { fontSize: 16 },
  amount: { fontSize: 16, fontWeight: 'bold' },
});
