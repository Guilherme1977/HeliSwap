import React, { useState } from 'react';
import Icon from './Icon';
import Modal from './Modal';
import TransactionSettingsModalContent from './Modals/TransactionSettingsModalContent';

import {
  getTransactionSettings,
  handleSaveTransactionSettings,
  INITIAL_REMOVE_SLIPPAGE_TOLERANCE,
} from '../utils/transactionUtils';
import { IStringToString } from '../interfaces/comon';

interface ISettingsProps {
  slippage: string;
}

const Settings = ({ slippage }: ISettingsProps) => {
  const [showModalTransactionSettings, setShowModalTransactionSettings] = useState(false);

  const slippageMapping: IStringToString = {
    provide: 'provideSlippage',
    create: 'provideSlippage',
    swap: 'swapSlippage',
    remove: 'removeSlippage',
  };

  const currentSlippage = getTransactionSettings();
  const currentSlippageKey = slippageMapping[slippage] as keyof {
    provideSlippage: number;
    swapSlippage: number;
    removeSlippage: number;
  };

  return (
    <>
      <div
        className="d-flex justify-content-end align-items-center cursor-pointer"
        onClick={() => setShowModalTransactionSettings(true)}
      >
        <span className="text-small me-2">Settings</span>
        <Icon name="settings" />
      </div>
      {showModalTransactionSettings ? (
        <Modal show={showModalTransactionSettings}>
          <TransactionSettingsModalContent
            modalTitle="Transaction settings"
            closeModal={() => setShowModalTransactionSettings(false)}
            slippage={currentSlippage[currentSlippageKey]}
            expiration={getTransactionSettings().transactionExpiration}
            saveChanges={handleSaveTransactionSettings}
            defaultSlippageValue={INITIAL_REMOVE_SLIPPAGE_TOLERANCE}
          />
        </Modal>
      ) : null}
    </>
  );
};

export default Settings;
