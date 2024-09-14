export default function Pill({children}:{children:React.ReactNode}){
    return(
        <div className="inline-block rounded-full bg-blue-500 text-xs p-[2px]">
            {children}
        </div>
    )
}