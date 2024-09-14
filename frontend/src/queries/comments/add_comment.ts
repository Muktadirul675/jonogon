import axios from "axios";

export default async function addComment(post: any, content: any, parent: any,access:string) {
    const { data } = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + 'comments/', {
        parent: parent !== null ? parent.id : null,
        content: content,
        post: post.id
    }, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    })
    return data;
}