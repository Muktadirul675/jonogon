'use client'

import { Color } from '@tiptap/extension-color'
import OrderedList from '@tiptap/extension-ordered-list'
import TextStyle from '@tiptap/extension-text-style'
import { Editor, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { BiBold, BiHeading, BiImage, BiListOl, BiVideo } from 'react-icons/bi'
import { BsBack, BsBackspace, BsQuote } from 'react-icons/bs'
import './tiptap.css'
import Blockquote from '@tiptap/extension-blockquote'
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import ListItem from '@tiptap/extension-list-item'
import Bold from '@tiptap/extension-bold'
import Heading from '@tiptap/extension-heading'
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
    Spinner,
} from '@chakra-ui/react'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import Image from '@tiptap/extension-image'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { IoMdAdd, IoMdReturnLeft } from 'react-icons/io'
import { PostponedPathnameNormalizer } from 'next/dist/server/future/normalizers/request/postponed'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'

const Tiptap = () => {
    const session = useSession({ required: true })
    const [post, setPost] = useState<any | null>(null)
    const [postId, setPostId] = useState<string | null>(null)
    const [isAdding, setIsAdding] = useState<boolean>(false)

    const router = useRouter()

    const query = useSearchParams()
    const post_query = query.get('post')

    const client = useQueryClient()

    const editor = useEditor({
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'border-0 focus:border-0 p-3 rounded-lg'
            }
        },
        extensions: [
            Document,
            Paragraph,
            Text,
            Blockquote.configure({
                HTMLAttributes: {
                    class: 'ps-5 py-3 border-l-4 border-l-gray-500 my-3'
                }
            }),
            OrderedList.configure({
                HTMLAttributes: {
                    class: 'list-decimal ps-5 py-4'
                }
            }),
            ListItem,
            Bold,
            Heading.configure({
                levels: [3],
                HTMLAttributes: {
                    class: 'text-xl'
                }
            }),
            Image.configure({
                inline: true,
                HTMLAttributes: {
                    class: "max-w-[50%] mx-auto"
                }
            })
        ],
        content: post?.body || '',
    })


    async function get_post() {
        if (post_query) {
            const { data } = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + 'posts/' + post_query + '/profile_post/', {
                headers: {
                    Authorization: `Bearer ${(session.data as any).access_token}`
                }
            })
            setPost(data)
            setPostId(data.id)
        } else {
            const { data } = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + 'posts/', {
                body: 'New post'
            }, {
                headers: {
                    Authorization: `Bearer ${(session.data as any).access_token}`
                }
            })
            setPost(data)
            setPostId(data.id)
        }
        client.invalidateQueries({queryKey:['profile','drafts']})
    }


    useEffect(() => {
        if ((session.data && !post)) {
            get_post()
        }
    }, [session, editor])

    useEffect(() => {
        if (post && editor) {
            editor.commands.setContent(post?.body)
            editor.commands.focus(0)
        }
    }, [post, editor])

    async function upload() {
        setIsAdding(true)
        if (post && editor && session) {
            const { data } = await axios.patch(process.env.NEXT_PUBLIC_BACKEND_URL + 'posts/' + post.id + '/', {
                body: editor.getHTML()
            }, {
                headers: {
                    Authorization: `Bearer ${(session.data as any).access_token}`
                }
            })
        }
        setIsAdding(false)
    }

    return (
        <div>
            {isAdding ? <Spinner />
                :
                <div className="menu">
                    <div className='me-auto is_active'>
                        <IoMdReturnLeft />
                    </div>
                    <div onClick={() => editor?.chain().focus().toggleBold().run()} className={`${editor?.isActive('bold') ? 'is_active' : null}`}>
                        <BiBold />
                    </div>
                    <div onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} className={`${editor?.isActive('heading', { level: 3 }) ? 'is_active' : null}`}>
                        <BiHeading />
                    </div>
                    <ImageModal editor={editor} />
                    <div onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={`${editor?.isActive('orderedList') ? 'is_active' : null}`}>
                        <BiListOl />
                    </div>
                    <div>
                        <BiVideo />
                    </div>
                    <div onClick={() => editor?.chain().focus().toggleBlockquote().run()} className={`${editor?.isActive('blockquote') ? 'is_active' : null}`}>
                        <BsQuote />
                    </div>
                    <div onClick={upload} className='ms-auto is_active'>
                        <IoMdAdd />
                    </div>
                </div>
            }
            {post && postId ? <EditorContent editor={editor} /> : <Spinner />}
            {post && postId && <div className="my-2">
                <Button size='sm'>Save as draft</Button>
            </div> }
        </div>
    )
}

function ImageModal({ editor }: { editor: Editor | null }) {
    const [isUploading, setIsUploading] = useState<boolean>(false)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [error, setError] = useState<string | null>(null)
    const [image, setImage] = useState<File | null>(null)
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const session = useSession()

    async function handleChange(e: ChangeEvent<HTMLInputElement>) {
        if (editor) {
            if (e.target.files) {
                const image = e.target.files[0]
                setImage(image)
                const reader = new FileReader()
                reader.onloadend = () => {
                    setImageSrc(reader.result as string)
                }
                reader.readAsDataURL(image)
            }
        }
    }

    async function handleUpload(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        // console.log((session.data as any).access_token)
        setIsUploading(true)
        if (image && editor && session) {
            const formData = new FormData()
            formData.append('image', image)
            try {
                const { data } = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + 'images/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${(session.data as any).access_token}`
                    }
                })
                editor.chain().focus().setImage({ src: data.image, alt: 'Image' }).run()
                onClose()
                editor.chain().focus(0)
            } catch (e) {
                setError(JSON.stringify(e))
            }
        }
        setIsUploading(false)
    }

    return (
        <>
            <div onClick={onOpen}>
                <BiImage />
            </div>

            <Modal closeOnOverlayClick={true} isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent backgroundColor={'#121212'}>
                    <ModalHeader>Upload image via URL or local device</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {error &&
                            <div className="my-2 rounded-lg p-3">
                                {error}
                                <br />
                                <button onClick={() => setError(null)}>Close</button>
                            </div>
                        }
                        {isUploading ?
                            <Spinner />
                            :
                            <div>
                                <form onSubmit={handleUpload}>
                                    <input onChange={handleChange} type="file" name="" accept='image/*' id="" />
                                    <br />
                                    {image && <Button type='submit'>Upload</Button>}
                                </form>
                                {imageSrc && <img src={imageSrc} />}
                            </div>
                        }
                        <br /><br />
                    </ModalBody>

                    {/* <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
              </Button>
              <Button variant='ghost'>Secondary Action</Button>
            </ModalFooter> */}
                </ModalContent>
            </Modal>
        </>
    )
}

export default Tiptap