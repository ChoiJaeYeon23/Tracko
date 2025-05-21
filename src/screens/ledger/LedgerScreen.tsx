
import React from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import ExpenseSummary from './ExpenseSummary'
import CategoryList from './CategoryList'
import AddExpenseButton from './AddExpenseButton';

const LedgerScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.container}>
          <ExpenseSummary />
          <CategoryList />
        </View>
      </ScrollView>
      <AddExpenseButton />
    </SafeAreaView>
  );
};

export default LedgerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
