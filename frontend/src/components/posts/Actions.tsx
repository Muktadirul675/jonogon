import { useState } from "react";
import PostActionInfoText from "../PostActionInfoText"
import { BiComment, BiDislike, BiHeart, BiLike, BiShare } from "react-icons/bi";
import Reactions from "./Reactions";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import Comments from "./comments/Comments";

function Share({ count }: { count: number }) {
    return (
        <div className="flex items-center">
            {count !== 0 && <PostActionInfoText>{count}</PostActionInfoText>}
            <BiShare />
        </div>
    )
}

export default function Actions({ reactions, post, comments }: { reactions: any[], post: any, comments:any[] }) {
    
    return (
        <div className="flex w-full flex-wrap justify-around">
            <Reactions post={post} reactions={reactions} />
            <Comments comments={comments} post={post} />
            <Share count={0} />
        </div>
    )
}