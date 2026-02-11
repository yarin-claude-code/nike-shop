import { Link } from 'react-router-dom';

export default function EmptyCart(): JSX.Element {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-display-sm font-black text-primary tracking-tighter mb-4">
          YOUR CART IS EMPTY
        </h2>
        <p className="text-primary-400 mb-8 max-w-md">
          Looks like you haven't added any kicks yet.
          Let's change that.
        </p>
        <Link to="/products" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    </div>
  );
}
