
import React from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import ExpenseSummary from './ExpenseSummary'
import CategoryList from './CategoryList'
import AddExpenseButton from './AddExpenseButton';
import { Header } from '../../components';

const LedgerScreen = () => {
  return (
    <View style={styles.container}>
      <Header 
        title="가계부"
        showBackButton={false}
      />
      <SafeAreaView style={styles.content}>
        <ScrollView>
          <View style={styles.scrollContent}>
            <ExpenseSummary />
            <CategoryList />
          </View>
        </ScrollView>
        <AddExpenseButton />
      </SafeAreaView>
    </View>
  );
};

export default LedgerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBF0',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
});
