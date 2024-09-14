'use client'

import axios from "axios";

export async function getPost({id, access}:{id:any, access:any}){
    // console.log(access)
    const {data} = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+'posts/'+id+'/',{
        headers:{
            Authorization: `Bearer ${access}`
        }
    })
    return data;
}