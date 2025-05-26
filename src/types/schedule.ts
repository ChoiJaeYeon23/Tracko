/**
 * 공통 스케줄 기본 타입: 모든 스케줄 항목의 공통 속성 정의
 *  id - 고유 아이디
 *  title - 제목
 *  description - 상세 설명 (선택)
 *  tag - 태그 목록 (선택)
 */
export interface BaseSchedule {
    id: string
    title: string
    description?: string
    tags?: string[]
}

/**
 * 루틴 타입: 특정 요일과 시간에 반복되는 주간 스케줄
 *  daysOfWeek - 반복되는 요일 배열 (0=일요일 ~ 6=토요일)
 *  time - 작업 시간 (선택, 'HH:mm' 형식)
 */
export interface Routine extends BaseSchedule {
    daysOfWeek: number[]
    time?: string
}

/**
 * 투두 타입: 특정 날짜에 해야 할 일
 *  date - 해야 하는 날짜 ('YYYY-MM-DD' 형식)
 *  isCompleted - 완료 여부
 */
export interface Todo extends BaseSchedule {
    date: string
    isCompleted: boolean
}

/**
 * 이벤트 타입: 특정 날짜와 시간에 발생하는 일회성 일정
 *  date - 일정 날짜 ('YYYY-MM-DD' 형식)
 *  startTime - 시작 시간 (선택, 'hh:mm' 형식)
 *  endTime - 종료 시간 (선택, 'hh:mm' 형식)
 *  location - 장소 (선택)
 */
export interface Event extends BaseSchedule {
    date: string
    startTime?: string
    endTime?: string
    location?: string
}

/**
 * 루틴 완료 기록: 날짜별로 완료된 루틴 ID 목록을 저장
 *  {
 *      '2025-05-26': ['routineId1', 'routineId2'],
 *      '2025-05-27': ['routineId3']
 *  }
 */
export interface RoutineCompletionMap {
    [date: string]: string[]
}