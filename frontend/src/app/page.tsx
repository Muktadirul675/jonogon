import { auth } from "@/auth";
import HomePage from "@/components/home/HomePage";
import Image from "next/image";

export default async function Home() {
  const session = await auth()
  return (
    <div className="w-full md:w-2/3 mx-auto">
      <HomePage/>
    </div>
  );
}
