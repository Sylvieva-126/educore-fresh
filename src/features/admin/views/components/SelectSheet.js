/**
 * SelectSheet — the labelled bottom sheet used for every dropdown in the
 * design handoff ("open a labelled bottom sheet; mark the current value").
 */
import React from 'react';
import { Modal, View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { colors, typography, spacing, touchTarget } from '../theme';

export default function SelectSheet({
  visible,
  label,
  options = [],
  value,
  onSelect,
  onClose,
  // Multi-select mode (e.g. "apply this fee to several classes"): tapping a
  // row toggles it and stays open until Done. Single-select behaviour is
  // unchanged for every existing caller.
  multiple = false,
  selectedValues = [],
  onToggle,
}) {
  const picked = multiple ? selectedValues.length : 0;
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropTouch} onPress={onClose} />
        <View style={styles.sheet}>
          <Text style={styles.title}>{label || 'Choose one'}</Text>
          <FlatList
            data={options}
            keyExtractor={(item) => String(item.value)}
            renderItem={({ item }) => {
              const selected = multiple
                ? selectedValues.includes(item.value)
                : item.value === value;
              return (
                <Pressable
                  onPress={() => {
                    if (multiple) {
                      onToggle && onToggle(item.value);
                      return;
                    }
                    onSelect(item.value);
                    onClose();
                  }}
                  style={({ pressed }) => [
                    styles.option,
                    pressed && { backgroundColor: colors.positive },
                  ]}
                >
                  <Text style={[styles.optionLabel, selected && styles.optionSelected]}>
                    {item.label}
                  </Text>
                  {selected ? <Text style={styles.check}>✓</Text> : null}
                </Pressable>
              );
            }}
          />
          {multiple ? (
            <Pressable style={({ pressed }) => [styles.done, pressed && { opacity: 0.7 }]} onPress={onClose}>
              <Text style={styles.doneText}>Done{picked ? ` (${picked} selected)` : ''}</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  backdropTouch: { flex: 1 },
  sheet: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    width: '100%',
    maxWidth: 480,
    maxHeight: '70%',
    overflow: 'hidden',
    alignSelf: 'center',
    paddingBottom: spacing.md,
  },
  title: { ...typography.sectionTitle, padding: spacing.lg },
  option: {
    ...touchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  optionLabel: { ...typography.body, flex: 1 },
  optionSelected: { color: colors.primary, fontWeight: '700' },
  check: { color: colors.primary, fontSize: 18, fontWeight: '700' },
  done: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  doneText: { ...typography.body, color: colors.onPrimary, fontWeight: '700' },
});
