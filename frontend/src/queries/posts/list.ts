'use client'

import axios from 'axios'
import { useSession } from 'next-auth/react'

export default async function GetPosts(access: any){
    // console.log('fetching', access)
    const {data} = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+'posts/?page=1',{
        headers:{
            Authorization:`Bearer ${access}`
        }
    })
    return data
}