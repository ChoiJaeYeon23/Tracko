import {
    SafeAreaView,
    View,
    Text,
    Button
} from 'react-native'
import {
    eventStorage, routineStorage, todoStorage,
    getAllEvents, getAllRoutines, getAllTodos, getRoutineCompletionMap
} from '../../database'

// 저장소 초기화 및 출력용 임시 버튼이 추가돼있습니다. 
const HomeScreen = () => {

    const printAllStorageData = () => {
        const routines = getAllRoutines()
        const routineMap = getRoutineCompletionMap()
        const todos = getAllTodos()
        const events = getAllEvents()

        console.log('🔁 [Routines]:', routines)
        console.log('🗺️ [RoutineCompletionMap]:', routineMap)
        console.log('✅ [Todos]:', todos)
        console.log('📅 [Events]:', events)
    }

    const deleteAllStorage = () => {
        routineStorage.clearAll()
        todoStorage.clearAll()
        eventStorage.clearAll()
    }

    const deleteRoutineStorage = () => {
        routineStorage.clearAll()
    }

    const deleteTodoStorage = () => {
        todoStorage.clearAll()
    }

    const deleteEventStorage = () => {
        eventStorage.clearAll()
    }

    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
            <View style={{ flex: 1, alignItems: 'center' }}>
                <Text>HomeScreen Hi ~</Text>
            </View>

            <View style={{ flex: 1, alignItems: 'center' }}>
                <Text>Schedule 관련 버튼입니다</Text>
                <Button
                    title='전체출력'
                    onPress={printAllStorageData}
                />
                <Button
                    title='전체삭제'
                    onPress={deleteAllStorage}
                />
                <Button
                    title='루틴삭제'
                    onPress={deleteRoutineStorage}
                />
                <Button
                    title='투두삭제'
                    onPress={deleteTodoStorage}
                />
                <Button
                    title='일정삭제'
                    onPress={deleteEventStorage}
                />
            </View>
        </SafeAreaView>
    )
}

export default HomeScreen