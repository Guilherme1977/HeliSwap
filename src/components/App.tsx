import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HashConnect, HashConnectTypes } from 'hashconnect';

import Home from '../pages/Home';
import Styleguide from '../pages/Styleguide';

import Header from './Header';
import Footer from './Footer';

import SDK from '../sdk/sdk';

function App() {
  const [sdk, setSdk] = useState({});
  const [connected, setConnected] = useState(false);
  const [isConnectionLoading, setIsConnectionLoading] = useState(true);
  const [readyToConnect, setReadyToConnect] = useState(false);
  const [hashconnectInstance, setHashconnectInstance] = useState<HashConnect>();
  const [walletMetadata, setWalletMetadata] = useState({});
  const [userId, setUserId] = useState('');
  const [connectionData, setConnectionData] = useState({
    topic: '',
    pairingString: '',
    privateKey: '',
    pairedWalletData: undefined,
    pairedAccounts: [],
  });

  /* Wallet connect hooks & functions - Start */
  const initHashConnect = async () => {
    const hashconnect = new HashConnect();

    setHashconnectInstance(hashconnect);

    const appMetadata: HashConnectTypes.AppMetadata = {
      name: 'HeliSwap DEX',
      description: 'HeliSwap DEX',
      icon: 'https://absolute.url/to/icon.png',
    };

    // Check for already saved login data
    const foundData = localStorage.getItem('hashconnectData');

    if (foundData) {
      const savedData = JSON.parse(foundData);
      await hashconnect.init(appMetadata, savedData.privateKey);
      await hashconnect.connect(savedData.topic, savedData.pairedWalletData);

      setUserId(savedData.pairedAccounts[0]);
      setIsConnectionLoading(false);
      setReadyToConnect(true);
      setConnected(true);
    } else {
      const initData = await hashconnect.init(appMetadata);
      const privateKey = initData.privKey;
      const state = await hashconnect.connect();
      const topic = state.topic;
      const pairingString = hashconnect.generatePairingString(state, 'testnet', false);

      setConnectionData(prev => ({ ...prev, privateKey, topic, pairingString }));

      hashconnect.findLocalWallets();
    }
  };

  const connectWallet = () => {
    if (walletMetadata && hashconnectInstance) {
      setIsConnectionLoading(true);
      hashconnectInstance.connectToLocalWallet(connectionData.pairingString);
    }
  };

  const disconnectWallet = () => {
    localStorage.removeItem('hashconnectData');
    setConnected(false);
    setWalletMetadata({});
    setUserId('');
    setConnectionData(prev => ({ ...prev, pairedWalletData: undefined, pairedAccounts: [] }));
  };

  useEffect(() => {
    initHashConnect();
  }, []);

  useEffect(() => {
    if (hashconnectInstance) {
      hashconnectInstance.foundExtensionEvent.once(walletMetadata => {
        setWalletMetadata(walletMetadata);
        setReadyToConnect(true);
        setIsConnectionLoading(false);
      });
    }
  }, [hashconnectInstance]);

  useEffect(() => {
    if (connectionData.topic !== '' && hashconnectInstance) {
      hashconnectInstance.pairingEvent.once(pairingData => {
        const { accountIds: pairedAccounts, metadata: pairedWalletData } = pairingData;
        const objectToSave = { ...connectionData, pairedAccounts, pairedWalletData };

        localStorage.setItem('hashconnectData', JSON.stringify(objectToSave));

        setUserId(pairedAccounts[0]);
        setConnected(true);
        setIsConnectionLoading(false);
      });

      hashconnectInstance.connectionStatusChange.once(connectionStatus => {
        console.log('connectionStatus', connectionStatus);
      });

      hashconnectInstance.acknowledgeMessageEvent.once(acknowledgeData => {
        console.log('acknowledgeData', acknowledgeData);
      });
    }
  }, [hashconnectInstance, connectionData]);
  /* Wallet connect hooks & functions - End */

  /* SDK & HTS hooks & functions - Start */
  useEffect(() => {
    const sdk = new SDK();
    setSdk(sdk);
  }, []);
  /* SDK & HTS hooks & functions - Start */

  return (
    <BrowserRouter>
      <div className="wrapper">
        <Header
          connected={connected}
          connectWallet={connectWallet}
          disconnectWallet={disconnectWallet}
          readyToConnect={readyToConnect}
          isConnectionLoading={isConnectionLoading}
        />
        <div className="main">
          <div className="container py-5 py-lg-7">
            <Routes>
              <Route path="/" element={<Home userId={userId} />} />
              <Route path="styleguide" element={<Styleguide />} />
            </Routes>
          </div>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
