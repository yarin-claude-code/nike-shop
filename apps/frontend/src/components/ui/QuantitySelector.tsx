interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
}

export default function QuantitySelector({
  quantity,
  onChange,
  min = 1,
  max = 99,
}: QuantitySelectorProps): JSX.Element {
  return (
    <div className="flex items-center border border-primary-200 rounded-lg">
      <button
        onClick={() => onChange(quantity - 1)}
        disabled={quantity <= min}
        className="w-10 h-10 flex items-center justify-center text-primary-500 hover:text-primary hover:bg-primary-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-l-lg"
        aria-label="Decrease quantity"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>
      <span className="w-12 text-center font-bold text-primary">
        {quantity}
      </span>
      <button
        onClick={() => onChange(quantity + 1)}
        disabled={quantity >= max}
        className="w-10 h-10 flex items-center justify-center text-primary-500 hover:text-primary hover:bg-primary-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-r-lg"
        aria-label="Increase quantity"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}
