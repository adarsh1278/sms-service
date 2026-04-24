function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function withRetries(
  fn,
  { retries = 2, delayMs = 300, shouldRetry = () => false } = {}
) {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const isFinalAttempt = attempt === retries;
      if (isFinalAttempt || !shouldRetry(error)) {
        throw error;
      }

      if (delayMs > 0) {
        await sleep(delayMs);
      }
    }
  }

  throw lastError;
}