/**
 * AdminScaffold — the shared page frame from the design system:
 * header (school + session context), screen title/subtitle, scrollable body,
 * optional bottom action area. Every admin screen wraps itself in this.
 */
import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { colors, typography, spacing } from '../theme';

export default function AdminScaffold({
  contextTop = 'Greenfield Secondary',
  contextBottom = '2026/2027 · First Term',
  eyebrow,
  title,
  subtitle,
  actions = null,
  children,
}) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.context}>
        <Text style={styles.contextTop}>{contextTop}</Text>
        <Text style={styles.contextBottom}>{contextBottom}</Text>
      </View>

      <View style={styles.header}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        {title ? <Text style={styles.title}>{title}</Text> : null}
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>

      {actions ? <View style={styles.actions}>{actions}</View> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  context: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contextTop: { ...typography.label, color: colors.text },
  contextBottom: { ...typography.label },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm },
  eyebrow: {
    ...typography.label,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  title: { ...typography.title, marginBottom: 2 },
  subtitle: { ...typography.body, color: colors.muted },
  body: { flex: 1 },
  bodyContent: { padding: spacing.lg, paddingBottom: spacing.xl },
  actions: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.sm,
  },
});
