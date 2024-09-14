'use client';

import Link from "next/link";

export default function DraftActions({post}:{post:any}){
    return(
        <div className="flex justify-around text-blue-500 text-sm">
            <Link href={`/posts/add/?post=${post.id}`}>
                Edit
            </Link>
            <div>
                Publish
            </div>
            <div className="text-red-500">
                Delete
            </div>
        </div>
    )
}