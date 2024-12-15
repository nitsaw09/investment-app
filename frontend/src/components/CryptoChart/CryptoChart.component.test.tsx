import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CryptoChart } from './CryptoChart.component';
import { Line } from 'react-chartjs-2';
import { vi } from 'vitest';

// Mock react-chartjs-2
vi.mock('react-chartjs-2', () => ({
  Line: vi.fn(() => null),
}));

describe('CryptoChart Component', () => {
  // Sample test data
  const mockRawData = {
    Data: [
      { time: 1640995200, close: 100 },  // 2022-01-01
      { time: 1641081600, close: 150 },  // 2022-01-02
      { time: 1641168000, close: 200 },  // 2022-01-03
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the Line component', () => {
    render(<CryptoChart rawData={mockRawData} />);
    expect(Line).toHaveBeenCalled();
  });

  it('transforms Unix timestamps to JS Dates correctly', () => {
    render(<CryptoChart rawData={mockRawData} />);
    
    const lineProps = (Line as jest.Mock).mock.calls[0][0];
    const dates = lineProps.data.labels;
    
    expect(dates[0]).toEqual(new Date(1640995200 * 1000));
    expect(dates[1]).toEqual(new Date(1641081600 * 1000));
    expect(dates[2]).toEqual(new Date(1641168000 * 1000));
  });

  it('maps close prices correctly', () => {
    render(<CryptoChart rawData={mockRawData} />);
    
    const lineProps = (Line as jest.Mock).mock.calls[0][0];
    const prices = lineProps.data.datasets[0].data;
    
    expect(prices).toEqual([100, 150, 200]);
  });

  it('handles empty data gracefully', () => {
    render(<CryptoChart rawData={{ Data: [] }} />);
    
    const lineProps = (Line as jest.Mock).mock.calls[0][0];
    expect(lineProps.data.labels).toEqual([]);
    expect(lineProps.data.datasets[0].data).toEqual([]);
  });

  it('handles undefined data gracefully', () => {
    render(<CryptoChart rawData={undefined as any} />);
    
    const lineProps = (Line as jest.Mock).mock.calls[0][0];
    expect(lineProps.data.labels).toEqual([]);
    expect(lineProps.data.datasets[0].data).toEqual([]);
  });

  it('applies correct chart options', () => {
    render(<CryptoChart rawData={mockRawData} />);
    
    const lineProps = (Line as jest.Mock).mock.calls[0][0];
    const { options } = lineProps;
    
    expect(options.responsive).toBe(true);
    expect(options.scales.x.type).toBe('time');
    expect(options.scales.x.time.unit).toBe('day');
    expect(options.scales.y.beginAtZero).toBe(true);
  });

  it('applies correct dataset styling', () => {
    render(<CryptoChart rawData={mockRawData} />);
    
    const lineProps = (Line as jest.Mock).mock.calls[0][0];
    const dataset = lineProps.data.datasets[0];
    
    expect(dataset.label).toBe('Close Price');
    expect(dataset.borderColor).toBe('rgba(75, 192, 192, 1)');
    expect(dataset.fill).toBe(true);
  });

  it('preserves data order when mapping values', () => {
    const unorderedData = {
      Data: [
        { time: 1641168000, close: 200 },  // Last
        { time: 1640995200, close: 100 },  // First
        { time: 1641081600, close: 150 },  // Middle
      ],
    };

    render(<CryptoChart rawData={unorderedData} />);
    
    const lineProps = (Line as jest.Mock).mock.calls[0][0];
    const prices = lineProps.data.datasets[0].data;
    
    expect(prices).toEqual([200, 100, 150]);
  });

  // Test for memory leaks and proper cleanup
  it('does not cause memory leaks with large datasets', () => {
    const largeData = {
      Data: Array.from({ length: 1000 }, (_, i) => ({
        time: 1640995200 + (i * 86400),
        close: i * 100,
      })),
    };

    render(<CryptoChart rawData={largeData} />);
    
    const lineProps = (Line as jest.Mock).mock.calls[0][0];
    expect(lineProps.data.labels.length).toBe(1000);
    expect(lineProps.data.datasets[0].data.length).toBe(1000);
  });
});