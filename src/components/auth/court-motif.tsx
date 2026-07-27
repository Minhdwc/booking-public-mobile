import { View } from 'react-native';
export function CourtMotif({ className = '' }: { className?: string }) {
  return (
    <View pointerEvents="none" className={`absolute ${className}`}>
      <View className="border-line/25 h-40 w-64 -rotate-6 overflow-hidden rounded-3xl border-2">
        <View className="bg-line/25 absolute inset-y-0 left-1/2 -ml-px w-px" />
        <View className="absolute inset-0 items-center justify-center">
          <View className="border-line/25 h-10 w-10 rounded-full border-2" />
        </View>
      </View>
    </View>
  );
}
