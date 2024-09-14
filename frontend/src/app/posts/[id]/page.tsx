import { auth } from "@/auth"
import PostClientPage from "@/components/posts/PostClientPage"
import axios from "axios"

export default async ({params}:{params:{id:number}}) =>{
    const id : number = params.id 
    
    return(
        <div>
            <PostClientPage id={id}/>
            {/* {JSON.stringify(session)} */}
        </div>
    )
}