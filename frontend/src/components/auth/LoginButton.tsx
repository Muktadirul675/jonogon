'use client'

import { Button } from "@chakra-ui/react"
import { signIn } from "next-auth/react"

export default function () {
    return (
        <>
            <Button onClick={()=>signIn('google', {callbackUrl:'/profile'})}>Login</Button>
        </>
    )
}
