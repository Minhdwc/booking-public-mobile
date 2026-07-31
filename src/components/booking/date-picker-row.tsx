import { Pressable, ScrollView, Text } from 'react-native';

import type { BookingDayOption } from './booking-utils';

type DatePickerRowProps = {
  days: BookingDayOption[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
};

export function DatePickerRow({ days, selectedDate, onSelectDate }: DatePickerRowProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
      {days.map((day) => {
        const selected = day.value === selectedDate;

        return (
          <Pressable
            key={day.value}
            onPress={() => onSelectDate(day.value)}
            className={`min-w-[72px] rounded-2xl border px-3 py-3 ${
              selected
                ? 'border-line bg-line'
                : 'border-ink/15 bg-paper dark:border-paper/20 dark:bg-court-deep'
            }`}
          >
            <Text
              className={`text-xs font-bold uppercase ${
                selected ? 'text-ink' : 'text-mist'
              }`}
            >
              {day.isToday ? 'Hôm nay' : day.weekday}
            </Text>
            <Text
              className={`mt-1 text-sm font-extrabold ${
                selected ? 'text-ink' : 'text-ink dark:text-paper'
              }`}
            >
              {day.dayMonth}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
