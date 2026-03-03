/**
 * Web3 helpers for PHU81 token interaction.
 * Uses ethers.js (loaded via CDN or installed separately).
 * Gracefully degrades when MetaMask is not present.
 */

const CONTRACT_ADDRESS = process.env.REACT_APP_WEB3_CONTRACT_ADDRESS;
if (!CONTRACT_ADDRESS) {
  console.warn('REACT_APP_WEB3_CONTRACT_ADDRESS is not set — Web3 token features will be unavailable.');
}

// Minimal ERC-20 ABI — only what we need
const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
];

const isMetaMaskAvailable = () =>
  typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';

export const connectWallet = async () => {
  if (!isMetaMaskAvailable()) {
    throw new Error('MetaMask is not installed. Please install MetaMask to use Web3 features.');
  }
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  return accounts[0];
};

export const getConnectedAccount = async () => {
  if (!isMetaMaskAvailable()) return null;
  const accounts = await window.ethereum.request({ method: 'eth_accounts' });
  return accounts[0] || null;
};

export const getPHU81Balance = async (address) => {
  if (!isMetaMaskAvailable()) return '0';
  try {
    // Dynamic import to avoid bundling ethers when not needed
    const { ethers } = await import('ethers');
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ERC20_ABI, provider);
    const balance = await contract.balanceOf(address);
    const decimals = await contract.decimals();
    return ethers.formatUnits(balance, decimals);
  } catch (err) {
    console.error('Error fetching PHU81 balance:', err);
    return '0';
  }
};

export const transferPHU81 = async (toAddress, amount) => {
  if (!isMetaMaskAvailable()) {
    throw new Error('MetaMask is not installed.');
  }
  const { ethers } = await import('ethers');
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ERC20_ABI, signer);
  const decimals = await contract.decimals();
  const parsedAmount = ethers.parseUnits(String(amount), decimals);
  const tx = await contract.transfer(toAddress, parsedAmount);
  return tx.wait();
};

export const getNetworkName = async () => {
  if (!isMetaMaskAvailable()) return 'Not connected';
  const { ethers } = await import('ethers');
  const provider = new ethers.BrowserProvider(window.ethereum);
  const network = await provider.getNetwork();
  return network.name;
};
