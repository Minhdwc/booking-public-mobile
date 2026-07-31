import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Pressable, ScrollView, Text, View, StyleSheet } from 'react-native';

import { Spacing } from '@/constants/theme';

const TAB_ITEMS = [
  { name: 'home', href: '/', label: '🏠 Trang chủ' },
  { name: 'explore', href: '/explore', label: '🔍 Khám phá' },
  { name: 'bookings', href: '/bookings', label: '📅 Đặt sân' },
  { name: 'notifications', href: '/notifications', label: '🔔 Thông báo' },
  { name: 'account', href: '/account', label: '👤 Tài khoản' },
] as const;

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          {TAB_ITEMS.map((tab) => (
            <TabTrigger key={tab.name} name={tab.name} href={tab.href} asChild>
              <TabButton>{tab.label}</TabButton>
            </TabTrigger>
          ))}
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <View
        className={`rounded-2xl px-3 py-2 ${isFocused ? 'bg-line' : 'bg-paper dark:bg-court-deep'}`}
      >
        <Text className={`text-xs font-bold ${isFocused ? 'text-ink' : 'text-mist'}`}>
          {children}
        </Text>
      </View>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  return (
    <View {...props} style={styles.tabListContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabScrollContent}
      >
        <View className="flex-row items-center gap-2 rounded-full border border-line/20 bg-court px-3 py-2">
          {props.children}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    width: '100%',
    padding: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  tabScrollContent: {
    paddingHorizontal: Spacing.one,
  },
  pressed: {
    opacity: 0.7,
  },
});
