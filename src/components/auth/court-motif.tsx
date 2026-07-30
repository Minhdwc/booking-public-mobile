import { View } from 'react-native';
export function CourtMotif({ className = '' }: { className?: string }) {
  return (
    <View pointerEvents="none" className={`absolute ${className}`}>
      <View className="h-40 w-64 -rotate-6 overflow-hidden rounded-3xl border-2 border-line/25">
        <View className="absolute inset-y-0 left-1/2 -ml-px w-px bg-line/25" />
        <View className="absolute inset-0 items-center justify-center">
          <View className="h-10 w-10 rounded-full border-2 border-line/25" />
        </View>
      </View>
    </View>
  );
}
