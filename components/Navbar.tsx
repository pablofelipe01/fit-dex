import React from 'react';
import { Flex, Box, Image, Text, IconButton, useColorMode, Button, useDisclosure, Stack } from '@chakra-ui/react';
import { ConnectWallet } from "@thirdweb-dev/react";
import { FaMoon, FaSun, FaBars, FaTimes } from 'react-icons/fa'; // Import additional icons

export default function Navbar() {
    const { colorMode, toggleColorMode } = useColorMode();
    const { isOpen, onToggle } = useDisclosure();

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
                <Image src="/logo.png" alt="Logo" boxSize="50px" mr={2}/>
                <Text fontSize="xl" fontWeight="bold">
                    [Creator`s name] Dex
                </Text>
            </Flex>

            {/* Hamburger icon for mobile */}
            <IconButton
                display={{ base: "block", md: "none" }}
                icon={isOpen ? <FaTimes /> : <FaBars />}
                aria-label="Open Menu"
                onClick={onToggle}
                size="sm" // Adjust the size as needed
                minHeight="auto" // Ensures the button height matches the icon size
                minWidth="auto" // Ensures the button width matches the icon size
                alignItems="center" // Ensures content is aligned to the center
                justifyContent="center" // Ensures content is justified in the center
                padding="2" // Removes padding to allow the icon to be truly centered
            />

            {/* Menu items */}
            <Box
                display={{ base: isOpen ? "block" : "none", md: "flex" }}
                width={{ base: "full", md: "auto" }}
                alignItems="center"
                flexGrow={1}
            >
                <Stack
                    direction={{ base: "column", md: "row" }}
                    spacing="24px"
                    align="center"
                    justify="center"
                    width={{ base: "full", md: "auto" }}
                >
                    <Button as="a" href="https://token-social.vercel.app/login" px={2} variant="ghost" target="_blank" rel="noopener noreferrer">Creator</Button>
                    <Button as="a" href="https://www.truesocialtoken.xyz/sign-in" px={2} variant="ghost" target="_blank" rel="noopener noreferrer">Home</Button>
                </Stack>
            </Box>

            {/* Dark mode toggle and wallet connect, always visible */}
            <Flex
                display={{ base: isOpen ? "none" : "flex", md: "flex" }}
                align="center"
            >
                <IconButton
                    aria-label="Toggle dark mode"
                    icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
                    onClick={toggleColorMode}
                    mr={4}
                />
                <ConnectWallet />
            </Flex>
        </Flex>
    );
}
