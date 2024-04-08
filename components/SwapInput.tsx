import React from 'react';
import { Input, Button, Box, Text, VStack, useColorModeValue } from '@chakra-ui/react';

type Props = {
  type: 'native' | 'token';
  tokenSymbol?: string;
  tokenBalance?: string;
  current: string;
  setValue: (value: string) => void;
  max?: string;
  value: string;
};

const SwapInput = ({
  type,
  tokenSymbol,
  tokenBalance,
  setValue,
  value,
  current,
  max,
}: Props) => {
  const truncate = (value: string) => value?.length > 5 ? value.slice(0, 5) : value;

  // Background color for the box
  const boxBg = useColorModeValue('gray.50', 'gray.800');
  // Dynamically changing text colors for better visibility
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
  const inputTextColor = useColorModeValue('green.600', 'green.300');
  const boxShadow = useColorModeValue('lg', 'dark-lg');

  return (
    <Box position="relative" p="4" boxShadow="lg" bg={boxBg} borderRadius="lg" w="full">
    <VStack spacing={4}>
      <Input
        type="number"
        placeholder="0,0"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        isDisabled={current !== type}
        size="md" // Consider using 'md' for better touch accessibility
        color={inputTextColor}
        _placeholder={{ color: 'gray.500' }}
      />
      <Box alignSelf="flex-end" pr={{ base: "1", md: "2" }}>
        <Text fontSize={{ base: "sm", md: "md" }} color={textColor}>
          {tokenSymbol}
        </Text>
        <Text fontSize={{ base: "xs", md: "sm" }} color={textColor}>
          Balance: {truncate(tokenBalance || '')}
        </Text>
      </Box>
      {current === type && (
        <Button size="md" onClick={() => setValue(max || '0')} colorScheme="blue" alignSelf="flex-end">
          Max
        </Button>
      )}
    </VStack>
  </Box>
  
  );
};

export default SwapInput;
