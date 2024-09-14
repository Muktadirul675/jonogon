'use client'

import axios from "axios"

export default async function GetPostReactions(id:number, access:string){
    // console.log(access)
    const {data} = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+'reactions/?post='+id,{
        headers:{
            Authorization:`Bearer ${access}`,
        }
    })
    return data
}