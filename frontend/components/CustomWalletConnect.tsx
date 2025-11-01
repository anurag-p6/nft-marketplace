import React from 'react';
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function CustomWalletConnect() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {!connected ? (
              <button
                onClick={openConnectModal}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-gray-800 transition"
              >
                Connect Wallet
              </button>
            ) : chain.unsupported ? (
              <button
                onClick={openChainModal}
                className="px-4 py-2 bg-red-500 text-white rounded-xl"
              >
                Wrong Network
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={openChainModal}
                  className="flex items-center bg-gray-100 px-3 py-2 rounded-xl hover:bg-gray-200"
                >
                  {chain.hasIcon && (
                    <div
                      className="w-5 h-5 rounded-full overflow-hidden mr-2"
                      style={{ background: chain.iconBackground }}
                    >
                      {chain.iconUrl && (
                        <img alt={chain.name ?? 'Chain icon'} src={chain.iconUrl} />
                      )}
                    </div>
                  )}
                  {chain.name}
                </button>

                <button
                  onClick={openAccountModal}
                  className="px-3 py-2 bg-gray-900 text-white rounded-xl"
                >
                  {account.displayName}
                  {account.displayBalance
                    ? ` (${account.displayBalance})`
                    : ''}
                </button>
              </div>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
