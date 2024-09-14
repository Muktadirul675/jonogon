import Link from "next/link";
import { BiNews } from "react-icons/bi";

export default function AddPostBox(){
    return(
        <Link href="/posts/add" className="w-full flex justify-center items-center text-blue-500 p-3 rounded-lg hover:bg-opacity-80 hover:bg-slate-50 transition-all cursor-pointer">
            <BiNews/> Add a post
        </Link>
    )
}