/** 원화 숫자 문자열 (천 단위 구분) */
export const formatKrw = (amount: number): string =>
    amount.toLocaleString('ko-KR')
