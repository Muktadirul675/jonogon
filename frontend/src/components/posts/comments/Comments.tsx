'use client'

import PostActionInfoText from "@/components/PostActionInfoText"
import { BiComment, BiCross, BiEdit, BiReply, BiReset, BiTrash, BiUpload } from "react-icons/bi"
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    Avatar,
} from '@chakra-ui/react'
import AddCommentBox from "./AddCommentBox"
import Divider from "@/components/Divider"
import { LegacyRef, RefObject, useEffect, useRef, useState } from "react"
import { useSession } from "next-auth/react"
import { IoMdClose } from "react-icons/io"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

export default function Comments({ post, comments }: { post: number, comments: any[] }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [parent, setParent] = useState<any | null>(null)
    const [commentCount, setCommentCount] = useState<number>(0)
    const [textAreaRef, setTextAreaRef] = useState<RefObject<HTMLTextAreaElement> | null>(null)
    let number = 0;
    async function count(arr: any[]) {
        number += arr.length;
        for (var c of arr) {
            if (c.replies.length > 0) {
                count(c.replies)
            }
        }
    }

    count(comments).then(() => setCommentCount(number));

    return (
        <>
            <div onClick={onOpen} className="flex items-center cursor-pointer">
                {commentCount !== 0 && <PostActionInfoText>{commentCount}</PostActionInfoText>}
                <BiComment />
            </div>
            <Modal closeOnOverlayClick={true} isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent bg={'#121212'} >
                    <ModalHeader>Comments</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <div className="max-h-[80vh] overflow-y-scroll">
                            {/* {JSON.stringify(comments)}
                            {JSON.stringify(comments)}
                            {JSON.stringify(comments)}
                            {JSON.stringify(comments)} */}
                            {comments.length === 0 ?
                                <h3 className="text-lg">Be the first to comment!</h3>
                                :
                                <>
                                    {comments.map((c) => <div key={c.id}><Comment textAreaRef={textAreaRef} parentFn={setParent} depth={1} comment={c} /></div>)}
                                </>
                            }
                            <br />
                            <br />
                            <br />
                        </div>
                        <div className="absolute bottom-3 bg-background-primary w-[90%]">
                            {/* <div className=""> */}
                            <AddCommentBox setTextAreaRefFn={setTextAreaRef} setParentNullFn={setParent} post={post} parent={parent} />
                            {/* </div> */}
                        </div>
                    </ModalBody>

                    {/* <ModalFooter>
                </ModalFooter> */}
                </ModalContent>
            </Modal >
        </>
    )
}

function Comment({ comment, depth, parentFn, textAreaRef }: { comment: any, depth: number, parentFn: any | null, textAreaRef: RefObject<HTMLTextAreaElement> | null }) {
    const [postComment, setPostComment] = useState<string>(comment.content)
    const [editingComment, setEdiitngComment] = useState<string>(comment.content)
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const localTextAreaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        const handleResize = () => {
            if (localTextAreaRef.current) {
                localTextAreaRef.current.style.height = 'auto';
                const newHeight = Math.min(localTextAreaRef.current.scrollHeight, 72); // 72px for 3 rows
                localTextAreaRef.current.style.height = `${newHeight}px`;
            }
        };

        handleResize(); // Initial resize
        window.addEventListener('resize', handleResize); // Handle window resize

        return () => {
            window.removeEventListener('resize', handleResize); // Clean up
        };
    }, [editingComment]);

    useEffect(()=>{
        if(isEditing){
            localTextAreaRef.current?.focus()
            const length = editingComment.length
            localTextAreaRef.current?.setSelectionRange(length,length)
        }
    },[isEditing])

    const client = useQueryClient()

    const update = useMutation({
        mutationFn: async ({id, access_token, post_id}:{id:number, access_token:string, post_id:any})=>{
            const {data} = await axios.patch(process.env.NEXT_PUBLIC_BACKEND_URL+'comments/'+id+`/?post=${post_id}`,{
                content: editingComment
            },{
                headers:{
                    Authorization: `Bearer ${access_token}`
                }
            })
            return data
        },
        onSuccess:(data)=>{
            const {content} = data
            setPostComment(content)
            setEdiitngComment(content)
            setIsEditing(false)
            client.invalidateQueries({queryKey:['post',{id:data.post},'comments']})
        }
    }) 

    const {data} = useSession()
    const { user } = data as any
    const { access_token } = data as any
    return (
        <div className={`${(depth === 1 ? 'p-3' : null)} rounded-md bg-background-secondary my-2`}>
            <div className="flex items-center mb-2">
                {/* {depth} */}
                <Avatar size='sm' src={comment.user.profile.image} />
                <span className="mx-1"></span>
                {comment.user.first_name + ' ' + comment.user.last_name}
            </div>
            <div>
                {isEditing ?
                    <>
                        <textarea ref={localTextAreaRef} value={editingComment} onChange={(e) => setEdiitngComment(e.target.value)} id="autoTextarea" rows={1} placeholder="comment..." className="transition-all rounded-2xl bg-background-secondary p-2 px-3 text-sm w-full border resize-none overflow-hidden mb-1" />
                        <br />
                        <Button onClick={()=>{
                            // console.log(comment)
                            update.mutate({id:comment.id, access_token:access_token, post_id:comment.post})
                        }} size='sm'>
                            <BiUpload/>
                        </Button>
                        <span className="mx-2"></span>
                        <Button onClick={()=>setIsEditing(false)} size='sm' colorScheme="red">
                            <IoMdClose/>
                        </Button>
                        <span className="mx-2"></span>
                        <Button onClick={()=>{
                            setEdiitngComment(comment.content)
                            localTextAreaRef.current?.focus()
                        }} size='sm'>
                            <BiReset/>
                        </Button>
                    </>
                    :
                    <>{postComment}</>
                }
            </div>
            <div className="mt-1 ms-1 text-text-secondary flex">
                {!isEditing && <span className="cursor-pointer text-blue-400" onClick={() => {
                    parentFn(comment)
                    if (textAreaRef) {
                        textAreaRef.current?.focus()
                    }
                }}>
                    <BiReply />
                </span>}
                <span className="mx-2"></span>
                {
                    user.username === comment.user.username && !isEditing &&
                    <span onClick={() => {
                        setIsEditing(true)
                    }} className="cursor-pointer text-blue-400">
                        <BiEdit />
                    </span>
                }
                <span className="mx-2"></span>
                {user.username === comment.user.username && !isEditing && <span className="cursor-pointer text-red-400">
                    <BiTrash />
                </span>}
            </div>
            <div>
                {comment.replies.length > 0 &&
                    <>
                        {depth <= 4 ?
                            <div className={`ms-5`}>
                                {comment.replies.map((r: any) => <div key={r.id}><Comment textAreaRef={textAreaRef} parentFn={parentFn} depth={depth + 1} comment={r} /></div>)}
                            </div>
                            :
                            <div className="ms-0">
                                {comment.replies.map((r: any) => <div key={r.id}><Comment textAreaRef={textAreaRef} parentFn={parentFn} depth={depth + 1} comment={r} /></div>)}
                            </div>
                        }
                    </>
                }
            </div>
        </div>
    )
}

// function ShowComments({ comments }: { comments: any }) {

//     return (
//         <>
//             <Button onClick={onOpen}>Open Modal</Button>

//         </>
//     )
// }