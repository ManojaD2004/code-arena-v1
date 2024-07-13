import { signOut } from "../../../auth.js";

export default function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button
        type="submit"
        className="px-3 py-2 bg-[#8b3dff] text-[white] rounded-[12%] mt-[-4]"
      >
        Sign Out
      </button>
    </form>
  );
}
