import { signIn, signOut, useSession } from 'next-auth/react';
import { useAccount, useDisconnect, useNetwork, useSignMessage } from 'wagmi';
import { useToast } from '@chakra-ui/react';
import { useAuthRequestChallengeEvm } from '@moralisweb3/next';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect } from 'react';

const RainbowButton = () => {
  const { disconnectAsync } = useDisconnect();
  const { isConnected, isDisconnected, address } = useAccount();
  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage();
  const toast = useToast();
  const { data, status } = useSession();
  const { requestChallengeAsync } = useAuthRequestChallengeEvm();

  const handleAuth = async () => {
    if (!address || !chain) {
      throw new Error('No Address or chain');
    }
    try {
      const challenge = await requestChallengeAsync({ address, chainId: chain?.id });

      if (!challenge) {
        throw new Error('No challenge received');
      }

      const signature = await signMessageAsync({ message: challenge.message });

      await signIn('moralis-auth', { message: challenge.message, signature, network: 'Evm', redirect: true });
    } catch (e) {
      toast({
        title: 'Oops, something went wrong...',
        description: (e as { message: string })?.message,
        status: 'error',
        position: 'top-right',
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    console.log({ data, isConnected });
    if (status === 'unauthenticated' && isConnected && !data) {
      console.log({ isConnected });
      handleAuth();
    }
  }, [status, isConnected, data]);

  useEffect(() => {
    if (isDisconnected) {
      disconnectAsync().then(() => {
        signOut({ redirect: false });
      });
    }
  }, [isDisconnected]);

  return <ConnectButton />;
};

export default RainbowButton;
