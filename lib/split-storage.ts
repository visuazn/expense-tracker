import { SplitData } from './split-types';

const STORAGE_KEY = 'expense-split-data';

/**
 * Load split data from localStorage
 */
export function loadSplitData(): SplitData {
  if (typeof window === 'undefined') {
    return { users: [], days: [] };
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return { users: [], days: [] };
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading split data:', error);
    return { users: [], days: [] };
  }
}

/**
 * Save split data to localStorage
 */
export function saveSplitData(data: SplitData): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving split data:', error);
  }
}

/**
 * Clear all split data
 */
export function clearSplitData(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing split data:', error);
  }
}

