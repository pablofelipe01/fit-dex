// Home.js
import React, { useEffect, useState } from "react";
import { MdSwapVert } from 'react-icons/md';
import {
  Box,
  Button,
  VStack,
  Text,
  useToast,
  Center,
  IconButton,
} from "@chakra-ui/react";
import {
  toEther,
  toWei,
  useAddress,
  useBalance,
  useContract,
  useContractRead,
  useContractWrite,
  useSDK,
  useTokenBalance,
} from "@thirdweb-dev/react";
import SwapInput from "../components/SwapInput";

const Home = () => {
  const TOKEN_CONTRACT = "0x40798ad1280a8d323aA80E814B2Cbe0d4Ff6d36e";
  const DEX_CONTRACT = "0x79b7A843335932c264e6a84b81aa791a61C0e87F";

  const sdk = useSDK();
  const address = useAddress();
  const { contract: tokenContract } = useContract(TOKEN_CONTRACT);
  const { contract: dexContract } = useContract(DEX_CONTRACT);

  const { data: symbol } = useContractRead(tokenContract, "symbol");
  const { data: tokenBalance } = useTokenBalance(tokenContract, address);
  const { data: nativeBalance } = useBalance();
  const { data: contractTokenBalance } = useTokenBalance(tokenContract, DEX_CONTRACT);

  const [contractBalance, setContractBalance] = useState("0");
  const [nativeValue, setNativeValue] = useState("0");
  const [tokenValue, setTokenValue] = useState("0");
  const [currentFrom, setCurrentFrom] = useState("token");
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: swapNativeToken } = useContractWrite(dexContract, "swapEthTotoken");
  const { mutateAsync: swapTokenToNative } = useContractWrite(dexContract, "swapTokenToEth");
  const { mutateAsync: approveTokenSpending } = useContractWrite(tokenContract, "approve");

  const toast = useToast();

  const { data: amountToGet } = useContractRead(
    dexContract,
    "getAmountOfTokens",
    currentFrom === "native"
      ? [toWei(nativeValue || "0"), toWei(contractBalance || "0"), contractTokenBalance?.value]
      : [toWei(tokenValue || "0"), contractTokenBalance?.value, toWei(contractBalance || "0")]
  );

  const fetchContractBalance = async () => {
    try {
      const balance = await sdk?.getBalance(DEX_CONTRACT);
      setContractBalance(balance?.displayValue || "0");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error fetching contract balance",
        description: (error as any).message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const executeSwap = async () => {
    setIsLoading(true);
    try {
      if (currentFrom === "native") {
        await swapNativeToken({
          overrides: {
            value: toWei(nativeValue || "0"),
          },
        });
      } else {
        await approveTokenSpending({
          args: [DEX_CONTRACT, toWei(tokenValue || "0")],
        });
        await swapTokenToNative({
          args: [toWei(tokenValue || "0")],
        });
      }
      toast({
        title: "Swap executed successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred",
        description: (error as any).message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContractBalance();
    const interval = setInterval(fetchContractBalance, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!amountToGet) return;
    if (currentFrom === "native") {
      setTokenValue(toEther(amountToGet));
    } else {
      setNativeValue(toEther(amountToGet));
    }
  }, [amountToGet]);

  return (
    <Center minHeight="100vh" padding="4">
      <VStack
        spacing="5"
        backgroundColor="gray.700"
        p="4"
        borderRadius="md"
        width={{ base: "90%", md: "500px" }} // Adjust based on the screen width
        color="white"
        boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)"
      >
        <SwapInput
          current={currentFrom}
          type="token"
          max={tokenBalance?.displayValue}
          value={tokenValue}
          setValue={setTokenValue}
          tokenSymbol={symbol}
          tokenBalance={tokenBalance?.displayValue}
        />
        <SwapInput
          current={currentFrom}
          type="native"
          max={nativeBalance?.displayValue}
          value={nativeValue}
          setValue={setNativeValue}
          tokenSymbol="MATIC"
          tokenBalance={nativeBalance?.displayValue}
        />
        
       
        <IconButton
           aria-label="Swap tokens"
            icon={<MdSwapVert />}
            onClick={() => setCurrentFrom(currentFrom === "native" ? "token" : "native")}
            size="lg"
            colorScheme="blue"
        />
        
        
        {address ? (
          <Button
            colorScheme="blue"
            onClick={executeSwap}
            isLoading={isLoading}
            loadingText="Loading"
          >
            Swap
          </Button>
        ) : (
          <Text>Connect wallet to exchange.</Text>
        )}
      </VStack>
    </Center>
  );
};

export default Home;
