import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');

    try {
      const result = await api.searchBlockchain(query.trim());
      if (result.type === 'block') navigate(`/block/${result.id}`);
      else if (result.type === 'transaction') navigate(`/tx/${result.id}`);
    } catch (err) {
      setError('Not found. Enter a valid Block Hash, TxID or Height. Error:' + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-10">
      <form onSubmit={handleSearch} className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Block Height, Block Hash, or Transaction ID"
          className="w-full py-4 pl-12 pr-32 text-lg bg-dark-card border border-dark-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-dark-muted text-dark-text shadow-lg"
        />
        <button
          type="submit"
          disabled={loading}
          className="absolute right-2 px-6 py-2 bg-primary hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '...' : 'Search'}
        </button>
      </form>
      {error && (
        <div className="mt-3 p-3 bg-red-900/20 border border-red-900/50 text-red-400 rounded-lg text-sm text-center">
          {error}
        </div>
      )}
    </div>
  );
}
