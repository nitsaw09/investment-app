import React, { useEffect, useState } from 'react';
import { Container, Box, Grid, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Typography } from '@mui/material';
import { Header } from '../../components/Header/Header.component';

import { CryptoTable } from '../../components/CryptoTable/CryptoTable.component';
import { CryptoChart } from '../../components/CryptoChart/CryptoChart.component';
import { Card } from '../../components/common/Card/Card.component';
import { cryptoApi } from '../../config/Api';

export const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [topCoins, setTopCoins] = useState<any>([]);
  const [cryptoPriceChart, setCryptoPriceChart] = useState<any>([]);
  const [chartCoinFilter, setChartCoinFilter] = useState<string>('BTC');

  const getCryptoDetails = async () => {
    try {
      const [topCoins, cryptoPriceChart] = await Promise.all([
        cryptoApi.getTopCoins(),
        cryptoApi.getHistoricalData(chartCoinFilter.toUpperCase())
      ])
      setTopCoins(topCoins?.length > 0 ? topCoins : []);
      setCryptoPriceChart(cryptoPriceChart);
    } catch(error: any) {
      console.error('Error fetching crypto data:', error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }

  const handleCoinChange = async (event: SelectChangeEvent<string>) => {
    setChartCoinFilter(event.target.value as string);
    const cryptoPriceChart = await cryptoApi.getHistoricalData(chartCoinFilter.toUpperCase());
    setCryptoPriceChart(cryptoPriceChart);
  }

  useEffect(() => {
    getCryptoDetails();
    // const intervalId = setInterval(() => {
    //   getCryptoDetails();
    // }, 5000);

    // return () => {
    //   clearInterval(intervalId);
    // };
  }, [])

  return (
    <Box>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={2}>
            <Grid item xs={5}>
              <Card title="Top 10 Cryptocurrencies">
                {loading ? 
                  (<Typography variant="h6">Loading...</Typography>) : 
                  (<CryptoTable data={topCoins} />)
                }
              </Card>
            </Grid>
          <Grid item xs={7}>
            <Card title="Price Movements Over Time">
              {loading ? (
                <Typography variant="h6">Loading...</Typography>
              ) : (
                <>
                  <FormControl
                    variant="standard"
                    sx={{ m: 1, minWidth: 120, float: "inline-end" }}
                  >
                    <InputLabel>Coins</InputLabel>
                    <Select
                      value={chartCoinFilter}
                      onChange={handleCoinChange}
                      label="Coins"
                    >
                      {topCoins.map((crypto: any) => (
                        <MenuItem key={crypto?.CoinInfo?.Name} value={crypto?.CoinInfo?.Name}>
                          {crypto?.CoinInfo?.Name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <CryptoChart rawData={cryptoPriceChart} />
                </>
              )}
            </Card>
          </Grid>    
        </Grid>
      </Container>
    </Box>
  );
};