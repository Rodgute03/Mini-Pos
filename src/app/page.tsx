"use client"

import { useRouter } from "next/navigation";

export default function Home() {
  let router = useRouter()
  const redit = ()=>{
    router.push("/Scaner")
  }
  return (
    <div className="flex justify-center items-center w-full h-[100vh]">
      <button onClick={redit} className="border-white border-1 text-white rounded p-4 px-10 text-2xl active:border-0 active:bg-white active:text-[#111] select-none font-bold">Iniciar</button>
    </div>
  );
}
