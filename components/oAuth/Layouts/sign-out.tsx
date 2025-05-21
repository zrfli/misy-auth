"use client"

import { signOut } from "next-auth/react"

export default function oAuthSignOut({ fullName }: { fullName: string }) {
    return (
        <p className="text-sm font-medium mt-6">
            Not {fullName}?{" "}
            <span onClick={() => signOut({ redirectTo: '/' })} className="text-blue-600 hover:underline cursor-pointer">
                Log into another account.
            </span>
        </p>
    )    
}