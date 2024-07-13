import React from "react";
import { signIn, auth } from "../../../auth.js";
import SignIn from "./signin";
import SignOut from "./signout";
import Link from "next/link";

export default async function Header() {
  const session = await auth();
  console.log(session);
  return (
    <div className="bg-white flex justify-between items-center h-18 p-4  fixed z-10 w-full px-[130px]">
      <div className="flex gap-20 text-[#8b3dff] ">
        <Link href={"/"} className="font-bold text-2xl">
          Volatility
        </Link>
        <ul className="flex gap-6 list-none font-medium text-[#0b3557] items-center">
          <Link href={"/upload-memory"}>Upload memory</Link>
          <Link href={"/analysis"}>Analysis</Link>
          <Link href={"/history"}>History</Link>
        </ul>
      </div>
      <div className="flex gap-6 list-none text-black items-center ">
        {session ? (
          <div className="font-medium flex gap-3">
            <div className="items-center flex">
              <img
                src={`${session?.user?.image}`}
                width={30}
                className="inline-block rounded-[50%]"
              />
            </div>{" "}
            <div className="flex items-center">{session?.user?.name}</div>
            <SignOut />
          </div>
        ) : (
          <div>
            <SignIn />
          </div>
        )}
      </div>
    </div>
  );
}
