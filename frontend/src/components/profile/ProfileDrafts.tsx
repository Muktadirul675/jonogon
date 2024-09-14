'use client'

import axios from "axios"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { BiCard } from "react-icons/bi"
import PostActionInfoText from "../PostActionInfoText"
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    Avatar,
} from '@chakra-ui/react'
import PostList from "../posts/PostList"
import { useQuery } from "@tanstack/react-query"
import { getDrafts } from "@/queries/posts/drafts/list"

export default function ProfileDrafts() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const session = useSession({ required: true })
    // const [drafts, setDrafts] = useState<any>([])
    const access = (session.data as any).access_token
    
    // useEffect(()=>{
    //     async function get(){
    //         const { data } = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + 'posts/drafts/', {
    //             headers: {
    //                 Authorization: `Bearer ${(session.data as any).access_token}`
    //             }
    //         })
    //     }
    //     get()
    // },[])

    const drafts = useQuery({
        queryKey: ['profile', 'drafts'],
        queryFn: async () => {
            // console.log((session.data as any).access_token)
            const data = await getDrafts((session.data as any).access_token)
            return data
        },
        enabled: session.status === 'authenticated',
        staleTime: Infinity,
        // refetchOnReconnect: false,
        // refetchOnWindowFocus: false,
    })

    if (drafts.data) {
        if ((drafts?.data as any).length) {
            return (
                <>
                    <div onClick={onOpen} className="w-full flex justify-center items-center text-blue-500 p-3 rounded-lg hover:bg-opacity-80 hover:bg-slate-50 transition-all cursor-pointer">
                        <BiCard /> Drafts <span className="mx-1"></span> <PostActionInfoText>{(drafts?.data as any).length}</PostActionInfoText>
                    </div>
                    {/* <div onClick={onOpen} className="flex items-center cursor-pointer">
                    {commentCount !== 0 && <PostActionInfoText>{commentCount}</PostActionInfoText>}
                    <BiComment />
                </div> */}
                    <Modal closeOnOverlayClick={true} isOpen={isOpen} onClose={onClose} isCentered>
                        <ModalOverlay />
                        <ModalContent bg={'#121212'} >
                            <ModalHeader>Drafts</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody pb={6}>
                                {(drafts?.data as any).length === 0 ?
                                    <div className="w-full p-5 flex justify-center items-center">
                                        No Drafts
                                    </div>
                                    :
                                    <div>
                                        <PostList list={drafts?.data as any} />
                                    </div>
                                }
                            </ModalBody>
                        </ModalContent>
                    </Modal >
                </>
            )
        }
    }
    return null;
}
