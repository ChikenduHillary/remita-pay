import React, { useState } from 'react';
import { CreditCard, AlertCircle } from 'lucide-react';

interface RRRInputFormProps {
  onSubmit: (rrr: string) => void;
  loading: boolean;
}

export const RRRInputForm: React.FC<RRRInputFormProps> = ({ onSubmit, loading }) => {
  const [rrr, setRrr] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!rrr.trim()) {
      setError('Please enter a valid RRR');
      return;
    }

    if (rrr.length !== 12) {
      setError('RRR must be exactly 12 digits');
      return;
    }

    if (!/^\d+$/.test(rrr)) {
      setError('RRR must contain only numbers');
      return;
    }

    onSubmit(rrr);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 12) {
      setRrr(value);
      setError('');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <CreditCard className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Pay with Solana USDC
          </h1>
          <p className="text-gray-600">
            Enter your Remita Retrieval Reference (RRR) to begin
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="rrr" className="block text-sm font-medium text-gray-700 mb-2">
              Remita Retrieval Reference (RRR)
            </label>
            <input
              id="rrr"
              type="text"
              value={rrr}
              onChange={handleInputChange}
              placeholder="Enter 12-digit RRR"
              className={`
                w-full px-4 py-3 text-lg font-mono tracking-wider border-2 rounded-xl 
                transition-colors focus:outline-none focus:ring-4 focus:ring-blue-100
                ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'}
              `}
              disabled={loading}
            />
            {error && (
              <div className="mt-2 flex items-center text-red-600 text-sm">
                <AlertCircle size={16} className="mr-1" />
                {error}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!rrr || loading}
            className={`
              w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200
              ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : rrr
                  ? 'bg-blue-600 hover:bg-blue-700 active:transform active:scale-95 shadow-lg hover:shadow-xl'
                  : 'bg-gray-400 cursor-not-allowed'
              }
            `}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Fetching Invoice...
              </div>
            ) : (
              'Fetch Invoice Details'
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            This payment will be processed using USDC on Solana devnet.
            <br />
            Make sure you have a compatible Solana wallet ready.
          </p>
        </div>
      </div>
    </div>
  );
};