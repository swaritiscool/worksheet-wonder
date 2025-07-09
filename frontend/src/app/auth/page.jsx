'use client'
import { signInWithGoogle } from '@/supabase/auth'
import { ButtonLong } from '@/components/buttonLong.jsx'

export default function LoginWithGoogle() {
  const handleGoogleLogin = async () => {
    const { error } = await signInWithGoogle()
    if (error) {
      alert('Login failed: ' + error.message)
    }
  }

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Login with Google</h1>
      <ButtonLong title="Continue with Google" onPress={handleGoogleLogin} />
    </div>
  )
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  gap: '20px',
}

const headingStyle = {
  color: '#fff',
  textAlign: 'center',
  lineHeight: '60px',
}

