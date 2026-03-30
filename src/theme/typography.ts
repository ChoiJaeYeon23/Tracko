import type { TextStyle } from 'react-native'
import { fontFamilyForWeight } from './fonts'

function t(
    fontSize: number,
    fontWeight: NonNullable<TextStyle['fontWeight']> = '400',
    extra?: TextStyle
): TextStyle {
    return {
        fontSize,
        fontWeight,
        fontFamily: fontFamilyForWeight(fontWeight),
        ...extra,
    }
}

/** 크기·굵기 프리셋. 실제 글꼴 이름은 `fontFamilyForWeight`와 동일 규칙 */
export const typography = {
    tabLabel: t(10, '600'),
    scheduleTabLabel: t(14, '600'),
    micro: t(10, '800'),
    caption: t(12, '400'),
    captionSemi: t(12, '600'),
    captionBold: t(12, '700'),
    bodySm: t(13, '400'),
    bodySmSemi: t(13, '600'),
    bodySmBold: t(13, '700'),
    bodySmHeavy: t(13, '800'),
    body: t(14, '400'),
    bodySemi: t(14, '600'),
    bodyBold: t(14, '700'),
    bodyHeavy: t(14, '800'),
    bodyMd: t(15, '600'),
    bodyMdBold: t(15, '700'),
    bodyLg: t(16, '400'),
    bodyLgMedium: t(16, '500'),
    bodyLgSemi: t(16, '600'),
    bodyLgBold: t(16, '700'),
    titleMd: t(17, '700'),
    title: t(18, '400'),
    titleSemi: t(18, '600'),
    titleBold: t(18, '700'),
    titleHeavy: t(18, '800'),
    bodyXl: t(20, '400'),
    headline: t(20, '700'),
    headlineHeavy: t(20, '800'),
    display: t(22, '800'),
    displayXL: t(28, '800'),
    iconLarge: t(22, '400'),
    input: t(16, '400'),
} as const

export type TypographyVariant = keyof typeof typography
