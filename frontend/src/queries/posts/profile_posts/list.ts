'use client';

import axios from 'axios'

export async function getProfilePosts(access:any){
    const {data} = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+'posts/profile_posts/',{
        headers:{
            Authorization:`Bearer ${access}`
        }
    })
    return data
}
