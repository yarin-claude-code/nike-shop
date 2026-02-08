import { Link } from 'react-router-dom';

interface ErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
  title?: string;
  message?: string;
}

export default function ErrorFallback({
  error,
  resetErrorBoundary,
  title = 'Something went wrong',
  message = 'We encountered an error while loading the page. Please try again.',
}: ErrorFallbackProps): JSX.Element {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-surface-light border border-primary-700 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Error Title */}
        <h1 className="text-display-sm font-black text-white tracking-tighter mb-4 uppercase">
          {title}
        </h1>

        {/* Error Message */}
        <p className="text-white/60 text-lg mb-8">
          {message}
        </p>

        {/* Debug Info (only in dev) */}
        {error && import.meta.env.DEV && (
          <div className="mb-8 p-4 bg-surface-light border border-primary-700 text-left">
            <p className="text-accent text-xs font-mono mb-2">Error Details:</p>
            <p className="text-white/50 text-xs font-mono break-all">
              {error.message}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {resetErrorBoundary && (
            <button
              onClick={resetErrorBoundary}
              className="btn-accent"
            >
              Try Again
            </button>
          )}
          <Link to="/" className="btn-outline">
            Go Home
          </Link>
        </div>

        {/* Support Link */}
        <p className="mt-8 text-white/30 text-sm">
          Need help?{' '}
          <a href="/contact" className="text-accent hover:underline">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}

interface PageErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function PageError({
  title = 'Failed to load',
  message = 'Unable to load the content. Please check your connection and try again.',
  onRetry,
}: PageErrorProps): JSX.Element {
  return (
    <div className="py-20 text-center">
      <div className="max-w-md mx-auto">
        {/* Error Icon */}
        <div className="w-16 h-16 mx-auto bg-surface-light border border-primary-700 flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
        </div>

        <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-2">
          {title}
        </h3>
        <p className="text-white/50 mb-6">
          {message}
        </p>

        {onRetry && (
          <button onClick={onRetry} className="btn-outline text-sm py-2 px-6">
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

export function SectionError({
  message = 'Failed to load this section',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}): JSX.Element {
  return (
    <div className="border border-dashed border-primary-700 p-8 text-center">
      <div className="text-accent mb-4">
        <svg
          className="w-10 h-10 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <p className="text-white/50 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-accent hover:underline text-sm font-bold uppercase tracking-wider"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
