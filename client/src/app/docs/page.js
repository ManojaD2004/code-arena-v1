import React from "react";
import Header from "../components/header.jsx";
import Body from "./components/body.jsx";
import SignupFormDemo from "./components/body.jsx";
import Header1 from "../components/header.jsx";
import { signIn, auth } from "../../../auth.js";

const Page = async () => {
  const session = await auth();
  console.log(session);
  return (
    <div>
      <Header1 />
      <SignupFormDemo username={session?.user?.email} />
    </div>
  );
};

export default Page;
