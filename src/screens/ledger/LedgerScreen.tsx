import React, { useState, useCallback, useMemo, useEffect } from 'react'
import {
    View,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    RefreshControl,
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import dayjs from 'dayjs'
import ExpenseSummary from './ExpenseSummary'
import CategoryList from './CategoryList'
import AddExpenseButton from './AddExpenseButton'
import AddExpenseModal from './AddExpenseModal'
import LedgerSpendingCalendar from './LedgerSpendingCalendar'
import LedgerDayExpenses from './LedgerDayExpenses'
import { Header } from '../../components'
import { useLedger } from '../../hooks/useLedger'
import { CREAM, INK } from '../../constants/appColors'

const LedgerScreen = () => {
    const {
        viewMonthKey,
        setViewMonthKey,
        monthLabel,
        budget,
        totalSpent,
        spentPercent,
        displayPercent,
        dailyExpense,
        dailyIncome,
        totalIncome,
        entriesThisMonth,
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
    const [selectedDate, setSelectedDate] = useState<string | null>(null)

    useEffect(() => {
        setSelectedDate(null)
    }, [viewMonthKey])

    const selectedDayItems = useMemo(() => {
        if (!selectedDate) return []
        return entriesThisMonth.filter(
            e => dayjs(e.createdAt).format('YYYY-MM-DD') === selectedDate
        )
    }, [selectedDate, entriesThisMonth])

    useFocusEffect(
        useCallback(() => {
            refresh()
        }, [refresh])
    )

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        const thisMonth = dayjs().format('YYYY-MM')
        setViewMonthKey(thisMonth)
        setSelectedDate(null)
        refresh()
        setTimeout(() => setRefreshing(false), 300)
    }, [refresh, setViewMonthKey])

    return (
        <View style={styles.container}>
            <Header title="가계부" showBackButton={false} />
            <SafeAreaView style={styles.content}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                    nestedScrollEnabled
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={INK}
                        />
                    }
                >
                    <LedgerSpendingCalendar
                        monthKey={viewMonthKey}
                        dailyExpense={dailyExpense}
                        dailyIncome={dailyIncome}
                        selectedDate={selectedDate}
                        onSelectDate={setSelectedDate}
                        onShiftMonth={delta =>
                            setViewMonthKey(
                                dayjs(`${viewMonthKey}-01`)
                                    .add(delta, 'month')
                                    .format('YYYY-MM')
                            )
                        }
                    />
                    {selectedDate ? (
                        <LedgerDayExpenses
                            selectedDate={selectedDate}
                            items={selectedDayItems}
                            onDeleteExpense={removeExpense}
                            onClearSelection={() => setSelectedDate(null)}
                        />
                    ) : null}
                    <ExpenseSummary
                        monthLabel={monthLabel}
                        budget={budget}
                        totalSpent={totalSpent}
                        totalIncome={totalIncome}
                        spentPercent={spentPercent}
                        displayPercent={displayPercent}
                        onSaveBudget={updateBudget}
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 12,
        // 하단 FAB(플로팅 버튼)에 가리지 않도록 여유
        paddingBottom: 100,
    },
})