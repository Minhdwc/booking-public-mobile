import { View, ViewProps } from 'react-native';

import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface ThemedViewProps extends ViewProps {
  lightColor?: string;
  darkColor?: string;
  type?: keyof typeof Colors.light & keyof typeof Colors.dark;
}

export function ThemedView({ style, lightColor, darkColor, type, ...otherProps }: ThemedViewProps) {
  const theme = useTheme();

  return <View style={[{ backgroundColor: theme[type ?? 'background'] }, style]} {...otherProps} />;
}
