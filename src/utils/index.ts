// Utility functions

/**
 * Format time in seconds to a human-readable string (e.g., "2m 30s" or "45s")
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins > 0) {
    return `${mins}m ${secs}s`;
  }
  return `${secs}s`;
};
