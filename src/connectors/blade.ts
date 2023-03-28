import {
  AccountId,
  Client,
  Transaction,
  TransactionId,
  TransactionReceiptQuery,
} from '@hashgraph/sdk';
import { BladeSigner, HederaNetwork } from '@bladelabs/blade-web3.js';
import { randomIntFromInterval } from '../utils/numberUtils';

class BladeConnect {
  signer: BladeSigner;
  setConnected: (loading: boolean) => void;
  setUserId: (userId: string) => void;

  constructor(setConnected: (loading: boolean) => void, setUserId: (userId: string) => void) {
    const bladeSigner = new BladeSigner();

    this.signer = bladeSigner;
    this.setConnected = setConnected;
    this.setUserId = setUserId;
  }

  async connect() {
    const params = {
      network: process.env.REACT_APP_NETWORK_TYPE as HederaNetwork,
      // dAppCode - optional while testing, request specific one by contacting us.
      dAppCode: 'HeliSwap DEX',
    };

    // create session with optional parameters.
    await this.signer.createSession(params);
    this.setConnected(true);
    this.setUserId(this.signer.getAccountId().toString());
  }

  async sendTransaction(transaction: Transaction, userId: string) {
    const transactionBytes = await this.freezeTransaction(transaction, userId);

    const response = await this.signer.call(transactionBytes);
    const { transactionId } = response;

    try {
      // const receipt = await this.signer.call(new TransactionReceiptQuery({ transactionId }));
      const networkType = process.env.REACT_APP_NETWORK_TYPE as string;
      const client = networkType === 'testnet' ? Client.forTestnet() : Client.forMainnet();
      const receipt = await new TransactionReceiptQuery({
        transactionId,
      }).execute(client);

      return {
        response: {
          ...response,
          success: receipt.status.toString() === 'SUCCESS',
          error: '',
        },
        receipt,
      };
    } catch (error) {
      return {
        response: {
          ...response,
          success: false,
          error,
        },
        receipt: null,
      };
    }
  }

  async freezeTransaction(trans: Transaction, userId: string) {
    let transId = TransactionId.generate(userId);
    trans.setTransactionId(transId);

    let nodeId = 5;
    //Choose random node depending on the network selected (we exclude some of the nodes as the current hashgraph/sdk version 2.16.2 used by hashconnect doesn't support all of the available hedera nodes)
    if (process.env.REACT_APP_NETWORK_TYPE === 'testnet') {
      nodeId = randomIntFromInterval(3, 7);
    } else if (process.env.REACT_APP_NETWORK_TYPE === 'mainnet') {
      nodeId = randomIntFromInterval(5, 20);
    }

    trans.setNodeAccountIds([new AccountId(nodeId)]);

    trans.freeze();

    return trans;
  }
}

export default BladeConnect;
