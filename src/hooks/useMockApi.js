import { useState, useCallback } from 'react';
import useStore from '../store/useStore';
import { SEED_TRANSACTIONS } from '../data/mockData';

const LOAD_DELAY_MS = 1400;

function useMockApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const setStoreLoading = useStore((s) => s.setLoading);
  const hydrateTransactions = useStore((s) => s.hydrateTransactions);
  const transactions = useStore((s) => s.transactions);

  const fetchData = useCallback(() => {
    if (transactions.length > 0) {
      return;
    }

    setIsLoading(true);
    setStoreLoading(true);
    setError(null);

    const promise = new Promise((resolve) => {
      setTimeout(() => resolve(SEED_TRANSACTIONS), LOAD_DELAY_MS);
    });

    promise
      .then((data) => {
        hydrateTransactions(data);
        setIsLoading(false);
        setStoreLoading(false);
      })
      .catch(() => {
        setError('Failed to load transaction data. Please try again.');
        setIsLoading(false);
        setStoreLoading(false);
      });
  }, [transactions.length, setStoreLoading, hydrateTransactions]);

  const retry = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { isLoading, error, retry, fetchData };
}

export default useMockApi;
