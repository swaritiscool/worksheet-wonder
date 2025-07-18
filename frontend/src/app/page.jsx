'use client'
import styles from "./page.module.css"
import { LinkedButton } from "@/components/buttonLong"
import { useRouter } from 'next/navigation';
import { useEffect } from 'react'

const home = () => {
  const router = useRouter()

  useEffect(() => {
    router.push("/generate")
  }, [])

  return (
    <div styles={styles.page}>
      <LinkedButton title="Auth" href="/auth" />
      <LinkedButton title="Generate" href="/generate" />
    </div>
  )
}

export default home
