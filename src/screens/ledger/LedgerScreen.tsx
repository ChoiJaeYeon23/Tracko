import React, { useState, useCallback } from 'react'
import {
    View,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    RefreshControl,
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import ExpenseSummary from './ExpenseSummary'
import CategoryList from './CategoryList'
import AddExpenseButton from './AddExpenseButton'
import AddExpenseModal from './AddExpenseModal'
import CustomCategoriesSection from './CustomCategoriesSection'
import { Header } from '../../components'
import { useLedger } from '../../hooks/useLedger'
import { CREAM, INK } from '../../constants/appColors'

const LedgerScreen = () => {
    const {
        monthLabel,
        budget,
        totalSpent,
        spentPercent,
        displayPercent,
        categoryAggregates,
        allCategories,
        customCategories,
        updateBudget,
        appendExpense,
        removeExpense,
        appendCustomCategory,
        removeCustomCategory,
        refresh,
    } = useLedger()

    const [modalOpen, setModalOpen] = useState(false)
    const [refreshing, setRefreshing] = useState(false)

    useFocusEffect(
        useCallback(() => {
            refresh()
        }, [refresh])
    )

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        refresh()
        setTimeout(() => setRefreshing(false), 300)
    }, [refresh])

    return (
        <View style={styles.container}>
            <Header title="가계부" showBackButton={false} />
            <SafeAreaView style={styles.content}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={INK}
                        />
                    }
                >
                    <ExpenseSummary
                        monthLabel={monthLabel}
                        budget={budget}
                        totalSpent={totalSpent}
                        spentPercent={spentPercent}
                        displayPercent={displayPercent}
                        onSaveBudget={updateBudget}
                    />
                    <CustomCategoriesSection
                        items={customCategories}
                        onRemove={removeCustomCategory}
                    />
                    <CategoryList
                        aggregates={categoryAggregates}
                        totalSpent={totalSpent}
                        onDeleteExpense={removeExpense}
                    />
                </ScrollView>
                <AddExpenseButton onPress={() => setModalOpen(true)} />
                <AddExpenseModal
                    visible={modalOpen}
                    onClose={() => setModalOpen(false)}
                    categories={allCategories}
                    onSubmit={appendExpense}
                    onAddCategory={appendCustomCategory}
                />
            </SafeAreaView>
        </View>
    )
}

export default LedgerScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CREAM,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 24,
    },
})