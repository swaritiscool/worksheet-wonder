'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/supabase/client'

export default function AuthCallback() {
  const router = useRouter()
  const [message, setMessage] = useState('Finishing login...')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the current session instead of manually exchanging
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback failed:', error)
          setMessage('Login failed. Please try again.')
          return
        }

        if (session) {
          setMessage('Login successful! Redirecting...')
          setTimeout(() => router.push('/generate'), 1500)
        } else {
          setMessage('No session found. Please try logging in again.')
        }
      } catch (error) {
        console.error('Unexpected error:', error)
        setMessage('An unexpected error occurred.')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div style={callbackStyle}>
      <h2>{message}</h2>
    </div>
  )
}

const callbackStyle = {
  color: '#fff',
  textAlign: 'center',
  paddingTop: '100px',
  fontFamily: 'sans-serif',
}
