import React from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { spacing, radius } from '../styles/spacing';
import { typography } from '../styles/typography';

import appLogo from '../../assets/alunoeprof.png';

export default function AppLoading({ message = 'Carregando...' }) {
    return (
        <View style={styles.container}>
            <Image source={appLogo} style={styles.logo} resizeMode="contain" />
            <ActivityIndicator size="small" color={colors.accentTeacher} />
            <Text style={styles.message}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.md,
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: spacing.sm,
    },
    message: {
        marginTop: spacing.sm,
        color: colors.inkMuted,
        fontSize: typography.sizes.sm,
    },
});