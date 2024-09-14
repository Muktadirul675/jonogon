// app/providers.tsx
'use client'

import {
    ChakraBaseProvider,
    extendBaseTheme,
    theme as chakraTheme,
} from '@chakra-ui/react'
import React from 'react'

const { Button, Spinner, Avatar, Badge, Form, Input, Modal, Popover,  } = chakraTheme.components

const theme = extendBaseTheme({
    components: {
        Button, Spinner, Avatar, Badge, Form, Input, Modal, Popover, 
    },
})

export function ChakraProvider({children}:{children: React.ReactNode}) {
    return (
        <ChakraBaseProvider theme={theme}>
            {children}
        </ChakraBaseProvider>
    )
}  