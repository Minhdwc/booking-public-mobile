import { Text } from 'react-native';

type TabIconProps = {
  emoji: string;
  focused: boolean;
};

export function TabIcon({ emoji, focused }: TabIconProps) {
  return (
    <Text style={{ fontSize: focused ? 22 : 20, opacity: focused ? 1 : 0.72 }}>{emoji}</Text>
  );
}
