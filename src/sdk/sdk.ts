import {
  ContractExecuteTransaction,
  ContractFunctionParameters,
  TransactionReceipt,
} from '@hashgraph/sdk';
import Hashconnect from '../connectors/hashconnect';
import { ICreatePairData } from '../interfaces/comon';
import { tokenIdToAddress } from '../utils/tokenUtils';

class SDK {
  async createPair(
    hashconnectConnectorInstance: Hashconnect,
    userId: string,
    createPairData: ICreatePairData,
  ) {
    const { tokenAId, tokenBId } = createPairData;
    const tokenAAdress = tokenIdToAddress(tokenAId);
    const tokenBAdress = tokenIdToAddress(tokenBId);

    const trans = new ContractExecuteTransaction()
      //Set the ID of the contract
      .setContractId('0.0.34735045')

      //Set the gas for the contract call
      .setGas(3000000)

      //Set the contract function to call
      .setFunction(
        'createPair',
        new ContractFunctionParameters().addAddress(tokenAAdress).addAddress(tokenBAdress),
      );

    const transactionBytes: Uint8Array | undefined = await hashconnectConnectorInstance?.makeBytes(
      trans,
      userId as string,
    );

    const response = await hashconnectConnectorInstance?.sendTransaction(
      transactionBytes as Uint8Array,
      userId as string,
      false,
    );

    const responseData: any = {
      response,
      receipt: null,
    };

    if (response?.success) {
      responseData.receipt = TransactionReceipt.fromBytes(response.receipt as Uint8Array);
    }

    return responseData;
  }
  // Works only for erc20 tokens
  async approveToken(hashconnectConnectorInstance: Hashconnect, userId: string, tokenId: string) {
    const routerContractAddress = '0x000000000000000000000000000000000212272e';

    const trans = new ContractExecuteTransaction()
      //Set the ID of the contract
      .setContractId(tokenId)

      //Set the gas for the contract call
      .setGas(3000000)

      //Set the contract function to call
      .setFunction(
        'approve',
        new ContractFunctionParameters().addAddress(routerContractAddress).addUint256(1000000),
      );

    const transactionBytes: Uint8Array | undefined = await hashconnectConnectorInstance?.makeBytes(
      trans,
      userId as string,
    );

    const response = await hashconnectConnectorInstance?.sendTransaction(
      transactionBytes as Uint8Array,
      userId as string,
      false,
    );

    const responseData: any = {
      response,
      receipt: null,
    };

    if (response?.success) {
      responseData.receipt = TransactionReceipt.fromBytes(response.receipt as Uint8Array);
    }

    return responseData;
  }

  async addLiquidity(
    hashconnectConnectorInstance: Hashconnect,
    userId: string,
    createPairData: ICreatePairData,
  ) {
    const deadline = Math.floor(Date.now() / 1000) + 60 * 60;
    const token0 = '0x00000000000000000000000000000000021240b2';
    const token1 = '0x00000000000000000000000000000000021240c8';
    const amount = 10000;

    const userAddress = tokenIdToAddress(userId);
    const trans = new ContractExecuteTransaction()
      //Set the ID of the router contract
      .setContractId('0.0.34750635')

      //Set the gas for the contract call
      .setGas(3000000)

      //Set the contract function to call
      .setFunction(
        'addLiquidity',
        new ContractFunctionParameters()
          .addAddress(token0)
          .addAddress(token1)
          .addUint256(amount)
          .addUint256(amount)
          .addUint256(amount)
          .addUint256(amount)
          .addAddress(userAddress)
          .addUint256(deadline),
      );

    const transactionBytes: Uint8Array | undefined = await hashconnectConnectorInstance?.makeBytes(
      trans,
      userId as string,
    );

    const response = await hashconnectConnectorInstance?.sendTransaction(
      transactionBytes as Uint8Array,
      userId as string,
      false,
    );

    const responseData: any = {
      response,
      receipt: null,
    };

    if (response?.success) {
      responseData.receipt = TransactionReceipt.fromBytes(response.receipt as Uint8Array);
    }

    return responseData;
  }
}

export default SDK;
