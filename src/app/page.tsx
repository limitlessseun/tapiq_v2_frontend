"use client";
import { useRouter } from "next/navigation";

const Homepage = () => {
  const router = useRouter();
  return router.push("/home");
};

export default Homepage;
