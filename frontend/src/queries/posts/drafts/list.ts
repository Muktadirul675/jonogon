'use client'

import axios from "axios"


export async function getDrafts(access:any) {
    // console.log(access)
    const { data } = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + 'posts/drafts/', {
        headers: {
            Authorization: `Bearer ${access}`
        }
    })
    return data
}