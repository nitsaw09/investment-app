import React, { useEffect, useState } from 'react';
import { Container, Box, Grid, Typography, Card as MuiCard, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { Header } from '../../components/Header/Header.component';
import { portfolioApi } from '../../config/Api';
import { Card } from '../../components/common/Card/Card.component';
import chains from '../../config/chains';

export const PortfolioPage: React.FC = () => {
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [ networkChains, setNetworkChains ] = useState<string[]>([])
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [nativeFilter, setNativeFilter] = useState<string>("all");
  const [networkFilter, setNetworkFilter] = useState<string>("all");

  useEffect(() => {
    setNetworkChains(Object.keys(chains));
    const walletAddress: string = localStorage.getItem("walletAddress") || ''; 
    try {
      if (!walletAddress) {
        throw new Error("No wallet selected");
      } 
      setWalletAddress(walletAddress);
      portfolioApi.getPortfolioValue(walletAddress)
        .then(response => setPortfolioData(response));
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
    const intervalId = setInterval(async () => {
      await portfolioApi.updatePortfolio(walletAddress); 
      await portfolioApi.getPortfolioValue(walletAddress, {
        page,
        limit: rowsPerPage,
        networkFilter,
        nativeFilter
    })
    }, 5 * 60 * 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleChangePage = async (event: unknown, newPage: number) => {
    const portfolioValue = await portfolioApi.getPortfolioValue(walletAddress, {
        page: newPage,
        limit: rowsPerPage,
        networkFilter,
        nativeFilter
    })
    setPage(newPage);
    setPortfolioData(portfolioValue);
  };

  const handleChangeRowsPerPage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    const portfolioValue = await portfolioApi.getPortfolioValue(walletAddress, {
        page,
        limit:parseInt(event.target.value, 10),
        networkFilter,
        nativeFilter
    })
    setPortfolioData(portfolioValue);
  };

  const handleNativeFilterChange = async (event: SelectChangeEvent<string>) => {
    setNativeFilter(event.target.value as string);
    const portfolioValue = await portfolioApi.getPortfolioValue(walletAddress, {
        page,
        limit: rowsPerPage,
        networkFilter,
        nativeFilter: event.target.value,
    })
    setPortfolioData(portfolioValue);
  };

  const handleNetworkFilterChange = async (event: SelectChangeEvent<string>) => {
    setNetworkFilter(event.target.value as string);
    const portfolioValue = await portfolioApi.getPortfolioValue(walletAddress, {
        page,
        limit: rowsPerPage,
        networkFilter: event.target.value,
        nativeFilter
    })
    setPortfolioData(portfolioValue);
  };

  return (
    <Box>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card title="Portfolio">
              {loading ? (
                <Typography variant="h6">Loading...</Typography>
              ) : portfolioData ? (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <MuiCard sx={{ p: 2 }}>
                      <Typography variant="h6">Wallet: {walletAddress}</Typography>
                      <Typography variant="h6">Total Portfolio Value: ${portfolioData?.totalValue?.toFixed(2)}</Typography>
                    </MuiCard>
                  </Grid>
                  <Grid item md={12}>
                    <MuiCard sx={{ p: 3 }}>
                      <Typography variant="h6">Token Balances</Typography>
                      <Grid container spacing={2} sx={{ mt: 2, mb: 2 }}>
                        <Grid item md={6}>
                          <FormControl variant="standard" fullWidth>
                            <InputLabel>Token Type</InputLabel>
                            <Select value={nativeFilter} onChange={handleNativeFilterChange}>
                              <MenuItem value="all">All Tokens</MenuItem>
                              <MenuItem value="native">Native Tokens</MenuItem>
                              <MenuItem value="non-native ">Non-native Tokens</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item md={6}>
                          <FormControl variant="standard" fullWidth>
                            <InputLabel>Network</InputLabel>
                            <Select value={networkFilter} onChange={handleNetworkFilterChange}>
                              <MenuItem value="all">All Networks</MenuItem>
                              {networkChains.map((chain) => (
                                <MenuItem value={chain}>{chain}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                      {portfolioData && portfolioData?.holdingsValue?.tokenBalances.length > 0 ? (
                        <TableContainer>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell></TableCell>
                                <TableCell>Token</TableCell>
                                <TableCell>Network</TableCell>
                                <TableCell>Balance (coin)</TableCell>
                                <TableCell>Balance (USD)</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {portfolioData?.holdingsValue?.tokenBalances?.map((token: any, index: number) => (
                                <TableRow key={index}>
                                  <TableCell><img src={token?.imgUrl} /></TableCell>
                                  <TableCell>{token?.symbol}</TableCell>
                                  <TableCell>{token?.network}</TableCell>
                                  <TableCell>{token?.tokenBalance?.toFixed(2)}</TableCell>
                                  <TableCell>${token?.balanceUSD?.toFixed(2)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          <TablePagination
                            component="div"
                            count={portfolioData.tokenCounts}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                          />
                        </TableContainer>
                      ) : (
                        <Typography>No token balances found.</Typography>
                      )}
                    </MuiCard>
                  </Grid>
                </Grid>
              ) : (
                <Typography variant="h6">No portfolio data found.</Typography>
              )}
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};