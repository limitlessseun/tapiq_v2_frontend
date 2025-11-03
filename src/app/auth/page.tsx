import { useRouter } from "next/navigation";
import React from "react";

export default function page() {
  const router = useRouter();
  return router.push("/auth/register");
}
