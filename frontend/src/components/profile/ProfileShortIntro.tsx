'use client'

import { Avatar } from "@chakra-ui/react"

export default function ProfileShortIntro({user}:{user:any}){
    return(
        <div className="flex w-full items-center">
            <Avatar src={user.profile.image}/>
            <div className="px-2 flex-grow">
                {/* {JSON.stringify(user)} */}
                <b>{user.first_name + ' ' + user.last_name}</b>
            </div>
        </div>
    )
}
