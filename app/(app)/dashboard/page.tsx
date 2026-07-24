"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/lib/AuthContext";

const ROLE_HOME: Record<string, string> = {
  school_admin: "/admin",
  teacher: "/teacher",
  student: "/student",
  parent: "/parent",
  creator: "/creator",
};

export default function DashboardRedirect() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) router.replace(ROLE_HOME[user.role] ?? "/student");
  }, [user, router]);

  return null;
}
