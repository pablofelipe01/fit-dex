import { Flex, Box, Image, Text, IconButton, useColorMode } from '@chakra-ui/react';
import { ConnectWallet } from "@thirdweb-dev/react";
import { FaMoon, FaSun } from 'react-icons/fa'; // Import icons for the button

export default function Navbar() {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <Flex
            as="nav"
            align="center"
            justify="space-between"
            wrap="wrap"
            padding="1.5rem"
            bg={colorMode === 'light' ? 'gray.200' : 'gray.700'}
            color={colorMode === 'light' ? 'black' : 'white'}
        >
            <Flex align="center" mr={5}>
                <Box>
                    <Image src="/logo.png" alt="Logo" boxSize="50px" mr={2}/>
                </Box>
                <Text fontSize="xl" fontWeight="bold">
                    [Creator`s name] Dex
                </Text>
            </Flex>

            <Flex align="center">
                <IconButton
                    aria-label="Toggle dark mode"
                    icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
                    onClick={toggleColorMode}
                    mr={4}
                />
                <ConnectWallet/>
            </Flex>
        </Flex>
    )
}
