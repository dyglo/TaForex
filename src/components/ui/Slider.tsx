import React from 'react';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Slider: React.FC<SliderProps> = ({ label, value, min = 0, max = 10, step = 1, onChange, ...props }) => (
  <div className="w-full flex flex-col gap-1">
    {label && <label className="mb-1 text-neutral-300 text-sm">{label}</label>}
    <div className="flex items-center gap-2">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-accent"
        {...props}
      />
      <span className="text-neutral-400 text-xs w-10 text-right">{value} hrs</span>
    </div>
  </div>
);

export default Slider;
