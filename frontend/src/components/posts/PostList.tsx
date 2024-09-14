'use client'

import PostCard from "./PostCard"

export default function PostList({list}:{list:any[]}){
    // return(
    //     <>{JSON.stringify(list)}</>
    // )
    if(list){return(
        <>
            {list.map((el:any)=>{
                return <div key={el.id}><PostCard post={el}/></div>
            })}
        </>
    )
    }
}