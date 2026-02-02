import { auth } from "@/lib/auth"

export async function getSession() {
  return await auth()
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user || null
}

export async function requireAuth() {
  const session = await getSession()
  if (!session?.user) {
    return null
  }
  return session.user
}
