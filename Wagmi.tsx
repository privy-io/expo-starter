import {
    EmbeddedWalletState,
    PrivyEmbeddedWalletProvider,
    useEmbeddedWallet as privyUseEmbeddedWallet,
    usePrivy,
  } from '@privy-io/expo'
  import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Address, EIP1193Provider } from 'viem'
  import { useAccount, useConnect} from 'wagmi'
  import { injected } from 'wagmi/connectors'
  
  const EmbeddedWalletContext = createContext<{
    connect: () => void
    address: Address | undefined
    isConnected: boolean
    isReady: boolean
    wallet: EmbeddedWalletState | undefined
  }>({
    connect: () => {},
    address: undefined,
    isConnected: false,
    isReady: false,
    wallet: undefined,
  })
  
  export const EmbeddedWalletProvider = ({ children }: { children: React.ReactNode }) => {
    const { isReady } = usePrivy()
    const {connect} = useConnect({});
    const { address, isConnected } = useAccount()
    const wallet = privyUseEmbeddedWallet()
    const [provider, setProvider] = useState<PrivyEmbeddedWalletProvider | undefined>(
      undefined
    );


    useEffect(() => {
      if (!wallet) return
      if (wallet.status === 'connected') {
        setProvider(wallet.provider)
      }
    }, [wallet])

    useEffect(() => {
        if (!provider) return;
        connect({
            connector: injected({
                target: {
                    provider: provider as EIP1193Provider,
                    id: '',
                    name: '',
                    icon: ''
                }
            })
        })

    }, [provider])
  
    const value = useMemo(
      () => ({
        connect,
        address,
        isConnected,
        isReady,
        wallet,
      }),
      [address, connect, isConnected, isReady, wallet]
    )
    return (
      <EmbeddedWalletContext.Provider value={value}>
        {children}
      </EmbeddedWalletContext.Provider>
    )
  }
  
  export const useEmbeddedWallet = () => {
    return useContext(EmbeddedWalletContext)
  }