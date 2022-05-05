import axios from 'axios';
import { ITokenData, IWalletBalance } from '../interfaces/tokens';

export const getTokenInfo = async (tokenId: string): Promise<ITokenData> => {
  const url = `${process.env.REACT_APP_MIRROR_NODE_URL}/api/v1/tokens/${tokenId}`;

  try {
    const {
      data: {
        token_id: tokenId,
        name,
        symbol,
        decimals,
        total_supply: totalSupply,
        expiry_timestamp: expiryTimestamp,
      },
    } = await axios(url);

    const tokenInfo = {
      tokenId,
      name,
      symbol,
      decimals: Number(decimals),
      totalSupply,
      expiryTimestamp,
    };

    return tokenInfo;
  } catch (e) {
    console.error(e);
    return {} as ITokenData;
  }
};

export const getTokensWalletBalance = async (userId: string): Promise<IWalletBalance> => {
  const url = `${process.env.REACT_APP_MIRROR_NODE_URL}/api/v1/balances?order=asc&account.id=${userId}`;

  try {
    const {
      data: { balances },
    } = await axios(url);

    const { balance, tokens: tokensRaw } = balances[0];
    const tokens = tokensRaw.map((token: { token_id: string; balance: number }) => ({
      tokenId: token.token_id,
      balance: token.balance,
    }));

    return { balance, tokens };
  } catch (e) {
    console.error(e);
    return {} as IWalletBalance;
  }
};