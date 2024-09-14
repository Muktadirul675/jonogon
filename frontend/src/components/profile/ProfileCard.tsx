'use client'

import { Avatar } from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import { BsPen } from "react-icons/bs";
import { IoMdLogOut } from "react-icons/io";

function Edit(){
    return (
        <div className="flex-grow py-3 flex justify-center transition-all items-center text-center hover:bg-slate-50 hover:bg-opacity-10">
            <BsPen/> <span className="mx-1"></span> Edit
        </div>
    )
}

function Logout(){
    return(
        <div className="flex-grow py-3 flex justify-center transition-all items-center text-center hover:bg-slate-50 hover:bg-opacity-10">
           <IoMdLogOut/> <span className="mx-1"></span> Logout
        </div>
    )
}

function Actions({ edit, logout }: { edit: boolean, logout: boolean }){
    if(edit || logout){
        return(
            <div className="w-full flex text-blue-600 mt-3 py-3">
                {edit? <Edit/> : null}
                {logout ? <Logout/> : null}
            </div>
        )
    }else{
        return null;
    }
}

export default function ProfileCard({ edit, logout }: { edit: boolean, logout: boolean }) {
    const {data: session} = useSession()
    const user : any = session?.user
    return (
        <div className="px-1 py-2">
            {/* {JSON.stringify(session)} */}
            <div className="flex px-3 py-1">
                <Avatar size='xl' src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${user.profile.image}`}/>
                <div className="px-3 info">
                    <div className="text-lg">{(user as any).first_name + ' ' + (user as any).last_name}</div>
                    <div className="text-sm text-blue-500">{'@'+(user as any).username}</div>
                </div>
            </div>
            <div className="bio text-center py-1">
                {user.profile.bio}
            </div>
            <Actions edit={edit} logout={logout}/>
        </div>
    )
}