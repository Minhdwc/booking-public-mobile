import { Text, View } from 'react-native';

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

export function SectionHeader({ eyebrow, title, subtitle }: SectionHeaderProps) {
  return (
    <View className="gap-1">
      {eyebrow ? (
        <Text className="text-xs font-bold uppercase tracking-widest text-mist">{eyebrow}</Text>
      ) : null}
      <Text className="text-xl font-extrabold text-ink dark:text-paper">{title}</Text>
      {subtitle ? <Text className="text-sm leading-5 text-mist">{subtitle}</Text> : null}
    </View>
  );
}
