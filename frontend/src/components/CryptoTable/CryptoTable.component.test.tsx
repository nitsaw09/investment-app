import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CryptoTable } from './CryptoTable.component';
import { vi } from 'vitest';

vi.mock('@mui/material', () => ({
  Table: ({ children }: any) => <table>{children}</table>,
  TableBody: ({ children }: any) => <tbody>{children}</tbody>,
  TableCell: ({ children }: any) => <td>{children}</td>,
  TableContainer: ({ children }: any) => <div>{children}</div>,
  TableHead: ({ children }: any) => <thead>{children}</thead>,
  TableRow: ({ children }: any) => <tr>{children}</tr>,
  Paper: ({ children }: any) => <div>{children}</div>,
}));

describe('CryptoTable Component', () => {
  const mockData = [
    {
      CoinInfo: {
        Name: 'BTC',
        FullName: 'Bitcoin',
        ImageUrl: '/media/19633/btc.png',
      },
      DISPLAY: {
        USD: {
          PRICE: '$45,000'
        }
      }
    },
    {
      CoinInfo: {
        Name: 'ETH',
        FullName: 'Ethereum',
        ImageUrl: '/media/20646/eth.png',
      },
      DISPLAY: {
        USD: {
          PRICE: '$2,500'
        }
      }
    }
  ];

  it('renders table headers correctly', () => {
    render(<CryptoTable data={[]} />);
    
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Symbol')).toBeInTheDocument();
    expect(screen.getByText('Last Price (USD)')).toBeInTheDocument();
  });

  it('renders crypto data correctly', () => {
    render(<CryptoTable data={mockData} />);
    
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
    
    expect(screen.getByText('BTC')).toBeInTheDocument();
    expect(screen.getByText('ETH')).toBeInTheDocument();
    
    expect(screen.getByText('$45,000')).toBeInTheDocument();
    expect(screen.getByText('$2,500')).toBeInTheDocument();
  });

  it('handles empty data array', () => {
    render(<CryptoTable data={[]} />);
    
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Symbol')).toBeInTheDocument();
    expect(screen.getByText('Last Price (USD)')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('handles missing DISPLAY data gracefully', () => {
    const dataWithMissingDisplay = [
      {
        CoinInfo: {
          Name: 'BTC',
          FullName: 'Bitcoin',
          ImageUrl: '/media/19633/btc.png',
        }
      }
    ];

    render(<CryptoTable data={dataWithMissingDisplay} />);
    
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(screen.getByText('BTC')).toBeInTheDocument();
  });

  it('handles missing USD data gracefully', () => {
    const dataWithMissingUSD = [
      {
        CoinInfo: {
          Name: 'BTC',
          FullName: 'Bitcoin',
          ImageUrl: '/media/19633/btc.png',
        },
        DISPLAY: {} 
      }
    ];

    render(<CryptoTable data={dataWithMissingUSD} />);
    
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(screen.getByText('BTC')).toBeInTheDocument();
  });

  it('handles large datasets without performance issues', () => {
    const largeData = Array.from({ length: 100 }, (_, i) => ({
      CoinInfo: {
        Name: `CRYPTO${i}`,
        FullName: `Cryptocurrency ${i}`,
        ImageUrl: `/media/crypto${i}.png`,
      },
      DISPLAY: {
        USD: {
          PRICE: `$${i},000`
        }
      }
    }));

    render(<CryptoTable data={largeData} />);
    
    expect(screen.getAllByRole('img')).toHaveLength(100);
    expect(screen.getByText('Cryptocurrency 99')).toBeInTheDocument();
  });
});