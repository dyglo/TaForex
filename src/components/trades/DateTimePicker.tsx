import React from 'react';

export default function DateTimePicker({ value, onChange }: { value: Date; onChange: (date: Date) => void }) {
  return (
    <input
      type="datetime-local"
      value={value.toISOString().slice(0, 16)}
      onChange={e => onChange(new Date(e.target.value))}
      className="block w-full bg-gray-700 border-gray-600 rounded-md py-2 px-3 text-white focus:ring-blue-500 focus:border-blue-500"
      required
      placeholder="Select date and time"
      title="Select date and time"
    />
  );
}
