import { IoMdHeart, IoMdThumbsDown, IoMdThumbsUp } from "react-icons/io";
import PostActionInfoText from "../PostActionInfoText";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios, { AxiosHeaders } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { headers } from "next/headers";

function Like({ react, setReact, count, click }: { react: any, setReact: any, count: any, click: any }) {
    function handleClick() {
        click('Like')
    }
    return (
        <div className="flex items-center cursor-pointer">
            {count !== 0 && <PostActionInfoText>{count}</PostActionInfoText>}
            {react === 'Like' ? <IoMdThumbsUp onClick={handleClick} className="text-blue-400" /> : <IoMdThumbsUp onClick={handleClick} />}
        </div>
    )
}

function Love({ react, setReact, count, click }: { react: any, setReact: any, count: any, click: any }) {
    function handleClick() {
        click('Love')
    }
    return (
        <div className="flex items-center cursor-pointer">
            {count !== 0 && <PostActionInfoText>{count}</PostActionInfoText>}
            {react === 'Love' ? <IoMdHeart onClick={handleClick} className="text-blue-400" /> : <IoMdHeart onClick={handleClick} />}
        </div>
    )
}

function Dislike({ react, setReact, count, click }: { react: any, setReact: any, count: any, click: any }) {
    function handleClick() {
        click('Dislike')
    }
    return (
        <div className="flex items-center cursor-pointer">
            {count !== 0 && <PostActionInfoText>{count}</PostActionInfoText>}
            {react === 'Dislike' ? <IoMdThumbsDown onClick={handleClick} className="text-blue-400" /> : <IoMdThumbsDown onClick={handleClick} />}
        </div>
    )
}

export default function Reactions({ reactions, post }: { reactions: any[], post: any }) {
    const [react, setReact] = useState<string | null>(null)
    const [reactId, setReactId] = useState<number | null>(null)
    const [likes, setLikes] = useState<number>(0)
    const [loves, setLoves] = useState<number>(0)
    const [dislikes, setDislikes] = useState<number>(0)
    const [temp, setTemp] = useState<string | null>(null)
    const session = useSession()
    const client = useQueryClient()

    const add = useMutation({
        mutationFn: async (type: string) => {
            switch (type) {
                case 'Like':
                    setLikes((prev) => prev + 1)
                    setReact('Like')
                    break;
                case 'Love':
                    setLoves((prev) => prev + 1)
                    setReact('Love')
                    break;
                case 'Dislike':
                    setDislikes((prev) => prev + 1)
                    setReact('Dislike')
                    break;
            }
            // console.log(`Bearer ${(session.data as any).access_token}`)
            const { data } = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + 'reactions/', {
                type: type,
                post: post.id
            }, {
                headers: {
                    Authorization: `Bearer ${(session.data as any).access_token}`
                }
            })
            setReact(data.type)
            setReactId(data.id)
        },
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ['posts', { id: post.id }, 'reactions'] })
        },
        onError: () => {
            switch (react) {
                case 'Like':
                    setLikes((prev) => prev - 1)
                    break;
                case 'Love':
                    setLoves((prev) => prev - 1)
                    break;
                case 'Dislike':
                    setDislikes((prev) => prev - 1)
                    break;
            }
            setReact(null)
        }
    })

    const update = useMutation({
        mutationFn: async (type: string) => {
            // console.log(post)
            switch (react) {
                case 'Like':
                    setLikes((prev) => prev - 1)
                    break;
                case 'Love':
                    setLoves((prev) => prev - 1)
                    break;
                case 'Dislike':
                    setDislikes((prev) => prev - 1)
                    break;
            }
            setTemp(react)
            setReact(null)
            const { data } = await axios.patch(process.env.NEXT_PUBLIC_BACKEND_URL + 'reactions/' + reactId + `/?post=${post.id}`, {
                post: post.id,
                type: type
            }, {
                headers: {
                    Authorization: `Bearer ${(session.data as any).access_token}`
                }
            })
            setReact(data.type)
            switch (react) {
                case 'Like':
                    setLikes((prev) => prev + 1)
                    break;
                case 'Love':
                    setLoves((prev) => prev + 1)
                    break;
                case 'Dislike':
                    setDislikes((prev) => prev + 1)
                    break;
            }
        },
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ['posts', { id: post.id }, 'reactions'] })
            setTemp(null)
        },
        onError: () => {
            switch (temp) {
                case 'Like':
                    setLikes((prev) => prev + 1)
                    break;
                case 'Love':
                    setLoves((prev) => prev + 1)
                    break;
                case 'Dislike':
                    setDislikes((prev) => prev + 1)
                    break;
            }
            setReact(temp)
            setTemp(null)
        }
    })

    const remove = useMutation({
        mutationFn: async () => {
            switch (react) {
                case 'Like':
                    setLikes((prev) => prev - 1)
                    break;
                case 'Love':
                    setLoves((prev) => prev - 1)
                    break;
                case 'Dislike':
                    setDislikes((prev) => prev - 1)
                    break;
            }
            setTemp(react)
            setReact(null)
            const { data } = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL + 'reactions'}/${reactId}/?post=${post.id}`, {
                headers: {
                    Authorization: `Bearer ${(session.data as any).access_token}`
                }
            })
        },
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ['posts', { id: post.id }, 'reactions'] })
            setTemp(null)
        },
        onError: () => {
            switch (temp) {
                case 'Like':
                    setLikes((prev) => prev + 1)
                    break;
                case 'Love':
                    setLoves((prev) => prev + 1)
                    break;
                case 'Dislike':
                    setDislikes((prev) => prev + 1)
                    break;
            }
            setReact(temp)
            setTemp(null)
        }
    })

    // async function addReaction(type: string) {
    //     try {
    //         setLikes((prev)=>prev+1)
    //         const { data } = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + 'reactions/', {
    //             post: post.id,
    //             type: type
    //         })
    //         setReact(data.type)
    //     } catch (e) {
    //         setLikes((prev)=>prev-1)
    //         alert(e)
    //     }
    // }

    async function UpdateReaction(type: string) {
        try {
            const { data } = await axios.patch(process.env.NEXT_PUBLIC_BACKEND_URL + 'reactions/' + reactId + `/post=${post.id}`)
            setReact(data.type)
        } catch (e) {
            alert(e)
        }
    }

    async function removeReaction(id: number) {
        try {
            const { data } = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL + 'reactions'}/${id}/?post=${post.id}`)
            setReact(null)
        } catch (e) {
            alert(e)
        }
    }

    function click(type: string) {
        if (!react) {
            add.mutate(type)
        } else {
            if (type !== react) {
                update.mutate(type)
            }else{
                remove.mutate()
            }
        }
    }

    useEffect(() => {
        if (reactions) {
            let likes = 0, loves = 0, dislikes = 0;
            reactions.forEach((r) => {
                if (r.type === 'Like') likes++;
                else if (r.type === 'Love') loves++;
                else if (r.type === 'Dislike') dislikes++;
            })
            setLikes(likes);
            setLoves(loves);
            setDislikes(dislikes)
        }
    }, [reactions])

    useEffect(() => {
        if (reactions && session) {
            const user: any = session.data?.user
            if (!react) {
                for (var r of reactions) {
                    if (r.user.username === user.username) {
                        setReact(r.type)
                        setReactId(r.id)
                        break;
                    }
                }
            }
        }
    }, [reactions, session])

    return (
        <>
            {/* {JSON.stringify((session.data as any).access_token)} */}
            <Like react={react} click={click} setReact={setReact} count={likes} />
            <Love react={react} click={click} setReact={setReact} count={loves} />
            <Dislike react={react} click={click} setReact={setReact} count={dislikes} />
        </>
    )
}
