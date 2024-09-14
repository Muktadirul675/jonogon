export function truncateFn(text: string, count : number){
    if(text.length < count) return text
    return text.slice(0,count) + '...'
}