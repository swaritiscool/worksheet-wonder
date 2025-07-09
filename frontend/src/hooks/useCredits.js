// hooks/useCredits.js
import { useState, useEffect } from 'react'
import { supabase } from '@/supabase/client'
import { getUserCredits, deductCredits, addCredits, ensureUserCreditsRecord } from '@/utils/credits'

export function useCredits(userId) {
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchCredits = async () => {
      setLoading(true)
      
      try {
        // Ensure user has a credits record
        await ensureUserCreditsRecord(userId)
        
        // Get user credits
        const { credits: userCredits, error } = await getUserCredits(userId)
        
        if (error) {
          setError(error)
          setCredits(0)
        } else {
          setCredits(userCredits)
          setError(null)
        }
      } catch (err) {
        console.error('Error in fetchCredits:', err)
        setError(err)
        setCredits(0)
      }
      
      setLoading(false)
    }

    fetchCredits()
  }, [userId])

  const deduct = async (amount) => {
    if (!userId) {
      return { success: false, error: 'No user ID provided' }
    }

    const result = await deductCredits(userId, amount)
    
    if (result.success) {
      setCredits(result.newBalance)
      setError(null)
    } else {
      setError(result.error)
    }
    
    return result
  }

  const add = async (amount) => {
    if (!userId) {
      return { success: false, error: 'No user ID provided' }
    }

    const result = await addCredits(userId, amount)
    
    if (result.success) {
      setCredits(result.newBalance)
      setError(null)
    } else {
      setError(result.error)
    }
    
    return result
  }

  const refresh = async () => {
    if (!userId) return
    
    const { credits: userCredits, error } = await getUserCredits(userId)
    
    if (error) {
      setError(error)
    } else {
      setCredits(userCredits)
      setError(null)
    }
  }

  return { credits, loading, error, deduct, add, refresh }
}
