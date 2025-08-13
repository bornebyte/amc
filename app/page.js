import Link from "next/link";
import RegisterUserComponent from "./register/page";

export default function Home() {
  return (
    <div>
      AMC
      <Link href="/register">Register</Link>
    </div>
  );
}
