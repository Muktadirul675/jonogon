// app/providers.tsx
'use client'

import { ChakraProvider } from './chakra'
import { SessionProvider } from 'next-auth/react'
import QueryProvider from './query'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <>
            <SessionProvider>
                <QueryProvider>
                    <ChakraProvider>
                        {children}
                    </ChakraProvider>
                </QueryProvider>
            </SessionProvider>
        </>
    )
}