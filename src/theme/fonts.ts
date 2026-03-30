import type { TextStyle } from 'react-native'

export function fontFamilyForWeight(
    weight: TextStyle['fontWeight'] | undefined
): string {
    switch (weight) {
        case '900':
            return 'Pretendard-Black'
        case '800':
            return 'Pretendard-ExtraBold'
        case 'bold':
        case '700':
            return 'Pretendard-Bold'
        case '600':
            return 'Pretendard-SemiBold'
        case '500':
            return 'Pretendard-Medium'
        case '400':
        case 'normal':
            return 'Pretendard-Regular'
        case '300':
            return 'Pretendard-Light'
        case '200':
            return 'Pretendard-ExtraLight'
        case '100':
            return 'Pretendard-Thin'
        default:
            return 'Pretendard-Regular'
    }
}
