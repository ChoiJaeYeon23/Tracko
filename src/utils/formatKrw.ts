/** 원화 숫자 문자열 (천 단위 구분) */
export const formatKrw = (amount: number): string =>
    amount.toLocaleString('ko-KR')

/**
 * TextInput 등: 입력에서 숫자만 남겨 천 단위 구분 문자열로 만듦.
 * 빈 입력이면 ''.
 */
export const formatKrwInputText = (text: string): string => {
    const digits = text.replace(/[^0-9]/g, '')
    if (digits === '') return ''
    const n = Number(digits)
    return Number.isFinite(n) ? formatKrw(n) : ''
}