import { useTheme } from '@/context/ThemeContext';
import { View, type ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps;

export function ThemedView({ style, ...otherProps }: ThemedViewProps) {
  const { theme } = useTheme();
  const backgroundColor = theme.background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
