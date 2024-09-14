'use client';

import { useQuery, useQueryClient } from "@tanstack/react-query";
import GetPosts from '@/queries/posts/list'
import { useSession } from "next-auth/react";
import PostList from "../posts/PostList";
import Loading from "../Loading";

export default function HomePage(){
    const session = useSession({required:true})
    const query = useQuery({
        queryKey: ['posts'],
        queryFn: async () =>{
            const data = await GetPosts((session.data as any).access_token)
            // console.log('From rq')
            return data
        } ,
        enabled: session.status === 'authenticated',
        staleTime: Infinity,
        cacheTime: 1000* 60 * 5,
        refetchOnWindowFocus: false,
        keepPreviousData: true,
        refetchOnReconnect: false,
        // refetchInterval: 60 * 5
    })
    if(query.isPending){
        return <Loading/>
    }
    return(
        <div>
            {/* {JSON.stringify(query)} */}
            <PostList list={query.data.results}/>
        </div>
    )
}
