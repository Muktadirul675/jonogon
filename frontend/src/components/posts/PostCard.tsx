'use client'

import ProfileShortIntro from "../profile/ProfileShortIntro";
import PostActionInfoText from '@/components/PostActionInfoText'
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import GetPostReactions from "@/queries/posts/post_reactions";
import { useSession } from "next-auth/react";
import Actions from "./Actions";
import AddCommentBox from "./comments/AddCommentBox";
import Divider from "../Divider";
import axios from "axios";
import { getComments } from "@/queries/comments/list";
import DraftActions from "./DraftActions";

export default function PostCard({ post }: { post: any }) {
    const session = useSession({required:true})
    const [isMounted, setIsMounted] = useState<boolean>(false)
    useEffect(()=>{
        setIsMounted(true)
        return ()=>{
            setIsMounted(false)
        }
    },[])
    const id : number = post.id
    const reactions = useQuery({
        queryKey: ['posts', {id:id} , 'reactions'],
        queryFn: async ()=>{
            const data = await GetPostReactions(id, (session.data as any).access_token)
            return data
        },
        enabled: isMounted && session.status === 'authenticated' ,
        staleTime: 1000 * 60 * 3,
        refetchInterval: 1000 * 60,
        refetchOnWindowFocus: false,
        keepPreviousData: true,
        refetchOnReconnect: false,
    })
    const comments = useQuery({
        queryKey: ['post', { id: post.id }, 'comments'],
        queryFn: async () => {
            // console.log((session as any).access_token)
            const data = await getComments(id, (session.data as any).access_token)
            return data
        },
        enabled: isMounted && (post !== null && post !== undefined) && session !== undefined ,
        staleTime: 1000 * 60 * 3,
        refetchInterval: 1000 * 60,
        refetchOnWindowFocus: false,
        keepPreviousData: true,
        refetchOnReconnect: false,
        placeholderData: []
    })
    return (
        <>
            <div className="p-3">
                <ProfileShortIntro user={post.author} />
                <div className="my-1 px-2">
                    {post.body}
                    {/* {JSON.stringify(reactions)}
                    {JSON.stringify(session.data)} */}
                </div>
                {post.status == "Public" &&  <div className="actions my-3">
                    <Actions comments={comments.data} post={post} reactions={reactions.data} />
                    <AddCommentBox setTextAreaRefFn={null} setParentNullFn={null} parent={null} post={post}/>
                </div>}
                {post.status == "Draft" &&  <div className="actions my-3">
                    <DraftActions post={post}/>
                </div>}
            </div>
            <Divider/>
        </>
    )
}