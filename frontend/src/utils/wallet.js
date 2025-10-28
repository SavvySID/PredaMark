export async function ensureEthereumProvider() {
  const { ethereum } = window;
  if (!ethereum || !ethereum.request) {
    throw new Error('MetaMask not detected');
  }
  return ethereum;
}

export async function connectWalletSafely() {
  const ethereum = await ensureEthereumProvider();
  try {
    // Prefer checking existing accounts first
    const existing = await ethereum.request({ method: 'eth_accounts' });
    if (existing && existing.length > 0) {
      return existing[0];
    }

    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts returned');
    }
    return accounts[0];
  } catch (error) {
    // Normalize common errors into user-friendly messages
    if (error && (error.code === 4001 || error.message?.includes('User rejected'))) {
      throw new Error('Connection request rejected in MetaMask');
    }
    if (error && error.message?.includes('MetaMask not detected')) {
      throw error;
    }
    throw new Error('Failed to connect to MetaMask');
  }
}


