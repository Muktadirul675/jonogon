'use client'

import Image from "next/image"
import Logo from '/public/jonogon.png'
import { useSession } from "next-auth/react"
import { Avatar } from "@chakra-ui/react"
import { BsBell, BsHouse, BsSearch } from "react-icons/bs"
import { BiUser } from "react-icons/bi"
import Link from "next/link"

export default function Navbar() {
    const session = useSession()
    let picture = null
    if (session.data) {
        picture = (session.data as any).picture
    }
    return (
        <div className="w-full fixed bottom-0 left-0 border-t border-gray-500 z-[20] bg-background-primary">
            <div className="w-full md:w-1/2 mx-auto flex items-center h-[60px] justify-around">
                <Link href="/">
                    <BsHouse/>
                </Link>
                <Link href="/">
                    <BsSearch/>
                </Link>
                <Link href="/">
                    <BsBell/>
                </Link>
                <Link href="/profile">
                    {session.data ? 
                        <Avatar size='sm' src={picture}/>
                        :
                        <BiUser/>
                    }
                </Link>
            </div>
        </div>
    )
}