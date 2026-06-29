'use client'
import { Button } from "@heroui/react"
export const CTA = ()=>{

    return (
        <div className="flex items-center gap-4">
            <Button className="px-6 py-6 rounded-none uppercase hover:bg-[#533a00]" size={'lg'} variant={"primary"}>
                Shop The Collection
            </Button>

            <Button className="px-6 py-6 rounded-none uppercase text-white hover:bg-white hover:text-black" size={'lg'} variant={"outline"}>
                Our Philosophy
            </Button>
        </div>
    )
}