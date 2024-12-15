import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { portfolioApi } from '../../config/Api';

export const MetaMaskWalletButton: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);

  const handleConnectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const address = accounts[0];
        setWalletAddress(address);
        setIsWalletConnected(true);
        localStorage.setItem('walletAddress', address);
        portfolioApi.updatePortfolio(address);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const handleNetworkChange = (chainId: string) => {
    console.log('Network changed to:', chainId);
    localStorage.setItem('networkChainId', chainId);
  };

  const handleAccountChange = (accounts: string[]) => {
    if (accounts.length > 0) {
      const newAddress = accounts[0];
      setWalletAddress(newAddress);
      localStorage.setItem('walletAddress', newAddress);
      portfolioApi.updatePortfolio(newAddress);
      console.log('Wallet address changed to:', newAddress);
    } else {
      setWalletAddress('');
      setIsWalletConnected(false);
      localStorage.removeItem('walletAddress');
      console.log('Wallet disconnected');
    }
  };

  const formatWalletAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 9)}...${address.slice(-4)}`; 
  };

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum && window.ethereum.isConnected()) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          localStorage.setItem("walletAddress", accounts[0]);
          setWalletAddress(accounts[0]);
          setIsWalletConnected(true);
        }
      }
    };

    checkWalletConnection();

    // Listen for network changes
    window.ethereum.on('chainChanged', handleNetworkChange);

    // Listen for account changes
    window.ethereum.on('accountsChanged', handleAccountChange);

    return () => {
      // Cleanup the event listeners on component unmount
      window.ethereum.removeListener('chainChanged', handleNetworkChange);
      window.ethereum.removeListener('accountsChanged', handleAccountChange);
    };
  }, []);

  return (
    <Button onClick={handleConnectWallet} sx={{ mr: 2 }}>
      {isWalletConnected ? `${formatWalletAddress(walletAddress)}` : 'Connect MetaMask'}
    </Button>
  );
};