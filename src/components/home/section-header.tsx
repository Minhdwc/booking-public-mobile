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
        <Text className="text-mist text-xs font-bold uppercase tracking-widest">{eyebrow}</Text>
      ) : null}
      <Text className="text-ink dark:text-paper text-xl font-extrabold">{title}</Text>
      {subtitle ? <Text className="text-mist text-sm leading-5">{subtitle}</Text> : null}
    </View>
  );
}
