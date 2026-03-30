import { useCallback, useState } from 'react'
import {
    SafeAreaView,
    View,
    Dimensions,
    ScrollView,
    RefreshControl,
} from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { TabView, TabBar } from 'react-native-tab-view'
import { FAB } from 'react-native-paper'
import dayjs from 'dayjs'
import {
    CalendarScreen,
    RoutineScreen,
    TodoScreen,
    EventScreen
} from '../../screens'
import { ScheduleStackParamList } from '../../navigation/ScheduleStackNavigator'
import { Header } from '../../components'
import { CREAM, WHITE, INK, INK_MUTED, BORDER } from '../../constants/appColors'
import { typography } from '../../theme/typography'

const initialLayout = { width: Dimensions.get('window').width }

type Props = StackScreenProps<ScheduleStackParamList, 'ScheduleScreen'>

const ScheduleScreen = ({ navigation }: Props) => {
    const [index, setIndex] = useState(0)
    const [routes] = useState([
        { key: 'routine', title: '루틴' },
        { key: 'todo', title: '투두' },
        { key: 'event', title: '일정' }
    ])
    const [selectedDate, setSelectedDate] = useState<string>(dayjs().format('YYYY-MM-DD'))
    const [refreshing, setRefreshing] = useState(false)
    /** 달 표시 월을 강제로 맞출 때(새로고침 등). selectedDate만으로는 월 화살표만 바꾼 상태와 어긋날 수 있음 */
    const [calendarJumpKey, setCalendarJumpKey] = useState(0)

    /** 당겨서 새로고침: 오늘 날짜·오늘이 속한 달 달력으로 이동 */
    const onScheduleRefresh = useCallback(() => {
        setRefreshing(true)
        const today = dayjs().format('YYYY-MM-DD')
        setSelectedDate(today)
        setCalendarJumpKey(k => k + 1)
        setTimeout(() => setRefreshing(false), 350)
    }, [])

    const renderScene = ({ route }: { route: { key: string } }) => {
        switch (route.key) {
            case 'routine':
                return <RoutineScreen selectedDate={selectedDate} />
            case 'todo':
                return <TodoScreen selectedDate={selectedDate} />
            case 'event':
                return <EventScreen selectedDate={selectedDate} />
            default:
                return null
        }
    }

    

    const renderTabBar = (props: any) => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: INK, height: 3 }}
            style={{
                backgroundColor: WHITE,
                borderTopWidth: 1,
                borderTopColor: BORDER,
            }}
            activeColor={INK}
            inactiveColor={INK_MUTED}
            labelStyle={typography.scheduleTabLabel}
        />
    )

    const handleFabPress = () => {
        switch (routes[index].key) {
            case 'routine':
                navigation.navigate('RoutineFormScreen')
                break
            case 'todo':
                navigation.navigate('TodoFormScreen')
                break
            case 'event':
                navigation.navigate('EventFormScreen')
                break
            default:
                break
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: CREAM }}>
            <Header 
                title="일정"
                showBackButton={false}
            />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 0.7, backgroundColor: CREAM }}>
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{ flexGrow: 1 }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onScheduleRefresh}
                                tintColor={INK}
                            />
                        }
                    >
                        <CalendarScreen
                            selectedDate={selectedDate}
                            onDateChange={setSelectedDate}
                            calendarJumpKey={calendarJumpKey}
                        />
                    </ScrollView>
                </View>
                <View style={{ flex: 0.4, backgroundColor: WHITE }}>
                    <TabView
                        key={selectedDate}
                        style={{ flex: 1 }}
                        navigationState={{ index, routes }}
                        renderScene={renderScene}
                        onIndexChange={setIndex}
                        initialLayout={initialLayout}
                        renderTabBar={renderTabBar}
                    />
                    <FAB
                        style={{
                            position: 'absolute',
                            right: 16,
                            bottom: 16,
                            backgroundColor: INK,
                        }}
                        color={WHITE}
                        icon="plus"
                        onPress={handleFabPress}
                    />
                </View>
            </SafeAreaView>
        </View>
    )
}

export default ScheduleScreen