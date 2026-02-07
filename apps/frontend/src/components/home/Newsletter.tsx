import { useState } from 'react';

export default function Newsletter(): JSX.Element {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    setIsSubmitted(true);
    setEmail('');
  };

  return (
    <section className="bg-black py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-8">
            <span className="text-white">Sign Up for </span>
            <span className="text-accent">Updates</span>
            <span className="text-white"> & Newsletter</span>
          </h2>

          {isSubmitted ? (
            <div className="bg-surface-light rounded-2xl p-8 animate-scale-in">
              <p className="text-white font-bold text-lg mb-2">You're In!</p>
              <p className="text-white/50">Check your inbox for a welcome surprise.</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="flex-1 bg-surface-light border border-primary-700 text-white px-5 py-3.5 rounded-full focus:outline-none focus:border-accent placeholder:text-primary-500"
              />
              <button
                type="submit"
                className="bg-accent hover:bg-accent-600 text-white font-medium px-8 py-3.5 rounded-full transition-colors whitespace-nowrap"
              >
                Sign Up
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
