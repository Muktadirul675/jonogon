'use client'

import Period from "@/components/Period";
import addComment from "@/queries/comments/add_comment";
import { truncateFn } from "@/utils/Truncate";
import { Button, Input } from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { access } from "fs";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { BiUpload } from "react-icons/bi";

export default function AddCommentBox({ parent, post, setParentNullFn, setTextAreaRefFn }: { parent: any, post: any, setParentNullFn: any | null, setTextAreaRefFn:any }) {
  const [comment, setComment] = useState<string>('')
  const [isValid, setIsvalid] = useState<boolean>(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { data } = useSession({ required: true })

  useEffect(()=>{
    if(setTextAreaRefFn) setTextAreaRefFn(textareaRef)
  },[setTextAreaRefFn])

  useEffect(() => {
    const handleResize = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        const newHeight = Math.min(textareaRef.current.scrollHeight, 72); // 72px for 3 rows
        textareaRef.current.style.height = `${newHeight}px`;
      }
    };

    handleResize(); // Initial resize
    window.addEventListener('resize', handleResize); // Handle window resize

    return () => {
      window.removeEventListener('resize', handleResize); // Clean up
    };
  }, [comment]);

  useEffect(() => {
    let valid = false;
    for (var i of comment) {
      if (i !== ' ' && i !== '\n' && i !== '\t') {
        valid = true;
      }
    }
    setIsvalid(valid)
  }, [comment])

  const client = useQueryClient()

  const add = useMutation({
    mutationFn: async ({post, content, parent, access}:{post: any, content: any, parent: any,access:string})=>{
      const data = await addComment(post, content, parent, access)
      setComment('')
    },
    onSuccess: ()=>{
      client.invalidateQueries({
        queryKey:['post',{id:post.id}, 'comments']
      })
    },
    onError:(e)=> alert(e)
  })

  async function handleUpload() {
    if (data) {
    // console.log('posting')
      const { access_token : access } = (data as any)
      add.mutate({post:post,content:comment,parent:parent, access: access})
    }
    if(setParentNullFn) setParentNullFn(null)
  }
  return (
    <>
      {parent &&
        <span className="mt-1">
          Replying to <b>{truncateFn(parent.content, 15)}</b> <Period /> <span className="text-blue-300" onClick={() => setParentNullFn(null)}>Cancel</span>
        </span>}
      {data && <div className="w-full flex my-2.5 items-center">
        <form onSubmit={(e) => e.preventDefault()} className="flex-grow transition-all">
          <button hidden disabled></button>
          {/* <Input placeholder="Comment" className="bg-background-secondary rounded-full" /> */}
          <textarea ref={textareaRef} value={comment} onChange={(e) => setComment(e.target.value)} id="autoTextarea" rows={1} placeholder="comment..." className="transition-all rounded-2xl bg-background-secondary p-2 px-3 text-sm w-full border border-transparent resize-none overflow-hidden focus:border-0" />
        </form>
        <div className="ms-2">
          {isValid && <Button onClick={handleUpload} size={'sm'}><BiUpload /></Button>}
        </div>
      </div>}
    </>
  )
}
