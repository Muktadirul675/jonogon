'use client';

import { getPost } from "@/queries/posts/details";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import ProfileShortIntro from "../profile/ProfileShortIntro";
import { Spinner } from "@chakra-ui/react";
import GetPostReactions from "@/queries/posts/post_reactions";
import { getComments } from "@/queries/comments/list";
import Reactions from "./Reactions";
import Actions from "./Actions";

export default ({ id }: { id: number }) => {
    const session = useSession({ required: true })

    const post = useQuery({
        queryKey: ['post', { id: id }],
        queryFn: async () => {
            const data = await getPost({ id: id, access: (session.data as any).access_token })
            return data
        },
        staleTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
        keepPreviousData: true,
        enabled: session.status === 'authenticated'
    })

    const reactions = useQuery({
        queryKey: ['posts', { id: (post?.data as any)?.id }, 'reactions'],
        queryFn: async () => {
            const data = await GetPostReactions(id, (session.data as any).access_token)
            return data
        },
        enabled: session.status === 'authenticated' && post.isSuccess,
        staleTime: 1000 * 60 * 3,
        refetchInterval: 1000 * 60,
        refetchOnWindowFocus: false,
        keepPreviousData: true,
        refetchOnReconnect: false,
    })
    const comments = useQuery({
        queryKey: ['post', { id: (post?.data as any)?.id  }, 'comments'],
        queryFn: async () => {
            // console.log((session as any).access_token)
            const data = await getComments(id, (session.data as any).access_token)
            return data
        },
        enabled: (post !== null && post !== undefined) && session !== undefined,
        staleTime: 1000 * 60 * 3,
        refetchInterval: 1000 * 60,
        refetchOnWindowFocus: false,
        keepPreviousData: true,
        refetchOnReconnect: false,
        placeholderData: []
    })

    if (post.isPending) {
        return (
            <>
                <Spinner />
            </>
        )
    }
    if (post.isSuccess) {
        return (
            <div className="w-full md:w-2/3 mx-auto p-3">
                <ProfileShortIntro user={(post.data as any).author} />
                <div dangerouslySetInnerHTML={{ __html: (post.data as any).body }}></div>
                <div className="flex w-full flex-wrap justify-around">
                    {/* {reactions.isSuccess && comments.isSuccess && <Actions comments={comments.data} reactions={reactions.data} post={post.data} />} */}
                    {reactions.isSuccess && <Reactions post={post.data} reactions={reactions.data}/>}
                </div>
            </div>
        )
    }
    return null;
}
