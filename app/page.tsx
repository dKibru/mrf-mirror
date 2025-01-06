"use server";
import { permanentRedirect } from "next/navigation";

export default async function Home() {
  permanentRedirect("/try"); // Navigate to the new user profile
}
