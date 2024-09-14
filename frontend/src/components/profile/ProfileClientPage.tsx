'use client'

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Box, Button, Code, HStack, Spinner, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import ProfileCard from "./ProfileCard";
import Divider from "../Divider";
import AddPostBox from "./AddPostBox";
import ProfileDrafts from "./ProfileDrafts";
import { useQuery } from "@tanstack/react-query";
import {getProfilePosts} from '@/queries/posts/profile_posts/list'
import Loading from "../Loading";
import PostList from "../posts/PostList";

export default function ProfileClientPage() {
    const session = useSession({ required: true });
    const posts = useQuery({
        queryKey: ['profile','posts'],
        queryFn: async ()=>{
            const data = await getProfilePosts((session.data as any).access_token)
            return data
        }
    })

    if (session.status == "loading") {
        return <Spinner size="lg" />;
    }
    if (session) {
        return (
            <div className="w-full md:w-2/3 mx-auto">
                <ProfileCard edit={true} logout={true} />
                <Divider />
                <div className="flex justify-between">
                    <ProfileDrafts/>
                    <AddPostBox />
                </div>
                <Divider />
                {posts.isPending ? <Loading/> :
                    <>
                        {JSON.stringify(posts.data)}
                        <PostList list={posts.data}/>
                    </>
                }
            </div>
        );
    }

    return <>Please log in</>
}