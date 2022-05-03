export interface ITokenData {
  tokenId: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  expiryTimestamp: string;
}

export interface IUserToken {
  tokenId: string;
  balance: number;
}

export interface IWalletBalance {
  balance: number;
  tokens: IUserToken[];
}
