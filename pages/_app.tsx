import { ChakraProvider } from '@chakra-ui/react';
import { createClient, defaultChains, WagmiConfig } from 'wagmi';
import { configureChains } from '@wagmi/core';
import { extendTheme } from '@chakra-ui/react';
import { publicProvider } from 'wagmi/providers/public';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';

import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

const { provider, webSocketProvider, chains } = configureChains(defaultChains, [publicProvider()]);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains,
});

const client = createClient({
  provider,
  webSocketProvider,
  autoConnect: true,
  // added connectors from rainbowkit
  connectors,
});

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({ config });

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <WagmiConfig client={client}>
        <SessionProvider session={pageProps.session} refetchInterval={0}>
          <RainbowKitProvider chains={chains}>
            <Component {...pageProps} />
          </RainbowKitProvider>
        </SessionProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
};

export default MyApp;
