const Slider = ({ 
  label, 
  min = 0, 
  max = 100, 
  step = 1, 
  value, 
  onChange, 
  disabled = false,
  className = '',
  showValue = true,
  ...props 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center">
        {label && (
          <label className="block text-sm font-medium text-slate-300">
            {label}
          </label>
        )}
        {showValue && (
          <span className="text-sm text-slate-400">{value}</span>
        )}
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          style={{
            background: `linear-gradient(to right, #6366F1 0%, #6366F1 ${((value - min) / (max - min)) * 100}%, #475569 ${((value - min) / (max - min)) * 100}%, #475569 100%)`
          }}
          {...props}
        />
        <style jsx>{`
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: linear-gradient(135deg, #6366F1, #8B5CF6);
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          }
          
          .slider::-moz-range-thumb {
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: linear-gradient(135deg, #6366F1, #8B5CF6);
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          }
        `}</style>
      </div>
    </div>
  );
};

export default Slider;