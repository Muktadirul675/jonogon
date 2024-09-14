'use client'

import axios from "axios";

export async function getComments(id:any, access:any){
    const { data } = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + 'comments/?post=' + id,{
        headers:{
            Authorization: `Bearer ${access}`
        }
    })
    return data;
}