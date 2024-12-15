import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface CryptoTableProps {
  data: any[];
}

export const CryptoTable: React.FC<CryptoTableProps> = ({ data = [] }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Symbol</TableCell>
            <TableCell>Last Price (USD)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((crypto: any) => (
            <TableRow key={crypto.CoinInfo.Name}>
              <TableCell><img src={`https://cryptocompare.com/${crypto.CoinInfo.ImageUrl}`} style={{maxWidth: "30px"}} /></TableCell>
              <TableCell>{crypto.CoinInfo.FullName}</TableCell>
              <TableCell><a href={`https://cryptocompare.com/${crypto.CoinInfo.Url}`} target="_blank" >{crypto.CoinInfo.Name}</a></TableCell>
              <TableCell>
                { crypto?.RAW && crypto?.RAW?.CHANGEPCTHOUR < 0 ? 
                  (<span style={{ color: "green" }}>{crypto.DISPLAY?.USD?.PRICE}</span>) :
                  (<span style={{ color: "red" }}>{crypto.DISPLAY?.USD?.PRICE}</span>)
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};