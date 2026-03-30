import React from 'react'
import { Text as RNText, TextProps, StyleSheet } from 'react-native'
import { typography, type TypographyVariant } from '../theme/typography'
import { fontFamilyForWeight } from '../theme/fonts'

export type { TypographyVariant }

interface TypographyProps extends TextProps {
    variant?: TypographyVariant
}

const Typography: React.FC<TypographyProps> = ({ variant, style, ...rest }) => {
    const flat = StyleSheet.flatten([
        variant ? typography[variant] : {},
        style,
    ])

    const getFontFamily = () => fontFamilyForWeight(flat?.fontWeight)

    return (
        <RNText
            style={[
                { fontFamily: getFontFamily() },
                variant ? typography[variant] : undefined,
                style,
            ]}
            {...rest}
        />
    )
}

export default Typography