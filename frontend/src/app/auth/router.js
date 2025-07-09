import { createServerClient } from '@supabase/ssr' // or your helper
import { redirect } from 'next/navigation'
import { cookies, headers as nextHeaders } from 'next/headers'

export async function GET(request) {
  const responseHeaders = new Headers()
  const cookieStore = cookies()
  const headerStore = nextHeaders()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll().map((c) => ({
            name: c.name,
            value: c.value,
          }))
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            const cookie = `${name}=${value}; Path=${options.path ?? '/'}; HttpOnly; SameSite=Lax`
            responseHeaders.append('set-cookie', cookie)
          })
        },
      },
    }
  )

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
    },
  })

  if (error) {
    return new Response('OAuth error: ' + error.message, { status: 500 })
  }

  return redirect(data.url, { headers: responseHeaders })
}
