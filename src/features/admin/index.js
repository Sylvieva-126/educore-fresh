/**
 * Admin module entry — JavaScript replacement for the old index.ts.
 *
 * Navigation mirrors the AD01 design: a bottom tab bar with
 * Home · Students · Academics · Fees · More. All 34 AD screens are
 * registered on the root stack so any screen can navigate to any other
 * (e.g. StudentListView pushes StudentProfile).
 *
 * CONTRACT: every role folder's index.js must export <role>Module —
 * the shared navigation does `import { adminModule } from '../features/admin'`.
 * The adminModule entry lives at the bottom of this same file, so there is
 * no separate module.js needed (delete module.js in this folder if present).
 */
import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ADMIN_SCREENS, screenComponent } from './views/screens';
import AdminScaffold from './views/components/AdminScaffold';
import { colors, typography, spacing, touchTarget } from './views/theme';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

/** A simple menu of screens for tabs that have no single landing screen. */
function MenuScreen({ adCodes }) {
  const navigation = useNavigation();
  return (
    <AdminScaffold
      eyebrow="Menu"
      title="Pick a page"
      subtitle="Screens follow the same MVP pattern — built ones open, the rest show the recipe."
    >
      {adCodes.map((code) => {
        const entry = ADMIN_SCREENS[code];
        const built = Boolean(entry.Component);
        return (
          <Pressable
            key={code}
            style={({ pressed }) => [styles.menuRow, pressed && { opacity: 0.7 }]}
            onPress={() => navigation.navigate(entry.name)}
          >
            <Text style={styles.menuCode}>{code}</Text>
            <Text style={styles.menuTitle}>{entry.title}</Text>
            <Text style={[styles.menuState, built && styles.menuBuilt]}>
              {built ? 'Ready' : 'To build'}
            </Text>
          </Pressable>
        );
      })}
    </AdminScaffold>
  );
}

function AcademicsMenu() {
  return (
    <MenuScreen
      adCodes={['AD11', 'AD12', 'AD13', 'AD14', 'AD15', 'AD16', 'AD17', 'AD18', 'AD19', 'AD20']}
    />
  );
}

function FeesMenu() {
  return <MenuScreen adCodes={['AD21', 'AD23', 'AD24', 'AD25']} />;
}

function MoreMenu() {
  return (
    <MenuScreen
      adCodes={[
        'AD05',
        'AD06',
        'AD07',
        'AD08',
        'AD09',
        'AD10',
        'AD26',
        'AD27',
        'AD28',
        'AD29',
        'AD30',
        'AD31',
        'AD32',
        'AD33',
        'AD34',
      ]}
    />
  );
}

/** Tab icon matches the tab's function — outline when idle, filled when active. */
function tabIcon(inactive, active) {
  return function TabBarIcon({ focused, color, size }) {
    return <Ionicons name={focused ? active : inactive} size={size} color={color} />;
  };
}

function AdminTabs() {
  return (
    <Tabs.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="HomeTab"
        component={screenComponent('AD01')}
        options={{ title: 'Home', tabBarIcon: tabIcon('home-outline', 'home') }}
      />
      <Tabs.Screen
        name="StudentsTab"
        component={screenComponent('AD02')}
        options={{ title: 'Students', tabBarIcon: tabIcon('people-outline', 'people') }}
      />
      <Tabs.Screen
        name="AcademicsTab"
        component={AcademicsMenu}
        options={{ title: 'Academics', tabBarIcon: tabIcon('school-outline', 'school') }}
      />
      <Tabs.Screen
        name="FeesTab"
        component={FeesMenu}
        options={{ title: 'Fees', tabBarIcon: tabIcon('wallet-outline', 'wallet') }}
      />
      <Tabs.Screen
        name="MoreTab"
        component={MoreMenu}
        options={{ title: 'More', tabBarIcon: tabIcon('ellipsis-horizontal', 'ellipsis-horizontal') }}
      />
    </Tabs.Navigator>
  );
}

/**
 * The admin navigator. It renders INSIDE the app's single NavigationContainer
 * (the root container in src/navigation) — nested navigators are fine; a
 * nested NavigationContainer is not. Every AD screen is addressable by name.
 */
export function AdminNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AdminTabs" component={AdminTabs} options={{ headerShown: false }} />
      {Object.entries(ADMIN_SCREENS).map(([code, entry]) => (
        <Stack.Screen
          key={code}
          name={entry.name}
          component={screenComponent(code)}
          options={{ title: entry.title, headerShown: false }}
        />
      ))}
      {/* Safety net: older presenters navigate to "ADxx Placeholder" names.
          Registering those names for the not-yet-built screens means a stale
          call lands on the recipe page instead of dying with a console error. */}
      {Object.entries(ADMIN_SCREENS)
        .filter(([, entry]) => !entry.Component)
        .map(([code, entry]) => (
          <Stack.Screen
            key={`${code}-placeholder-alias`}
            name={`${code} Placeholder`}
            component={screenComponent(code)}
            options={{ title: entry.title, headerShown: false }}
          />
        ))}
    </Stack.Navigator>
  );
}

/* ------------------------------------------------------------------ *
 * Role-module entry — what the shared workspace renders for ADMIN.    *
 * It mounts the whole admin app above (own tabs and own stack) as a   *
 * plain navigator inside the ROOT NavigationContainer. The context /  *
 * openShared / target props passed by RoleWorkspaceScreen are         *
 * accepted but not needed yet.                                        *
 * ------------------------------------------------------------------ */
export function AdminHomeScreen() {
  return <AdminNavigator />;
}

export default AdminNavigator;

export const adminModule = { HomeScreen: AdminHomeScreen };

const styles = StyleSheet.create({
  menuRow: {
    ...touchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  menuCode: { ...typography.label, color: colors.primary, width: 52 },
  menuTitle: { ...typography.body, flex: 1 },
  menuState: { ...typography.label },
  menuBuilt: { color: colors.primary, fontWeight: '700' },
});
