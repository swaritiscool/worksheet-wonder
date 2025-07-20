// utils/credits.js
import { supabase } from '@/supabase/client'

export async function getUserCredits(userId) {
  if (!userId) {
    return { credits: 0, error: 'No user ID provided' }
  }

  try {
    const { data, error } = await supabase
      .from('credits')
      .select('credits')
      .eq('user_id', userId)
      .single()

    if (error) {
      // If no row found, return 0 credits instead of error
      if (error.code === 'PGRST116') {
        console.log('No credits record found for user:', userId)
        return { credits: 0, error: null }
      }
      console.error('Error fetching credits:', error)
      return { credits: 0, error }
    }
    
    return { credits: data.credits || 0, error: null }
  } catch (error) {
    console.error('Unexpected error fetching credits:', error)
    return { credits: 0, error }
  }
}

export async function deductCredits(userId, amount) {
  if (!userId) {
    return { success: false, error: 'No user ID provided' }
  }

  try {
    // First ensure user has a credits record
    await ensureUserCreditsRecord(userId)
    
    // Get current credits
    const { credits: currentCredits, error: fetchError } = await getUserCredits(userId)
    
    if (fetchError) {
      return { success: false, error: fetchError }
    }
    
    if (currentCredits < amount) {
      return { success: false, error: 'Insufficient credits' }
    }
    
    // Deduct credits
    const { data, error } = await supabase
      .from('credits')
      .update({ credits: currentCredits - amount })
      .eq('user_id', userId)
      .select()
    
    if (error) {
      console.error('Error deducting credits:', error)
      return { success: false, error }
    }
    
    return { success: true, newBalance: data[0].credits }
  } catch (error) {
    console.error('Unexpected error deducting credits:', error)
    return { success: false, error }
  }
}

export async function addCredits(userId, amount) {
  if (!userId) {
    return { success: false, error: 'No user ID provided' }
  }

  try {
    // First ensure user has a credits record
    await ensureUserCreditsRecord(userId)
    
    // Get current credits
    const { credits: currentCredits, error: fetchError } = await getUserCredits(userId)
    
    if (fetchError) {
      return { success: false, error: fetchError }
    }
    
    // Add credits
    const { data, error } = await supabase
      .from('user_credits')
      .update({ credits: currentCredits + amount })
      .eq('user_id', userId)
      .select()
    
    if (error) {
      console.error('Error adding credits:', error)
      return { success: false, error }
    }
    
    return { success: true, newBalance: data[0].credits }
  } catch (error) {
    console.error('Unexpected error adding credits:', error)
    return { success: false, error }
  }
}

export async function ensureUserCreditsRecord(userId, initialCredits = 100) {
  if (!userId) {
    return { success: false, error: 'No user ID provided' }
  }

  try {
    // Check if record exists
    const { data: existingRecord, error: checkError } = await supabase
      .from('user_credits')
      .select('id')
      .eq('user_id', userId)
      .single()
    
    // If record exists, return success
    if (existingRecord && !checkError) {
      return { success: true, exists: true }
    }
    
    // If record doesn't exist, create it
    if (checkError && checkError.code === 'PGRST116') {
      const { data, error } = await supabase
        .from('user_credits')
        .insert({ user_id: userId, credits: initialCredits })
        .select()
      
      if (error) {
        console.error('Error creating credits record:', error)
        return { success: false, error }
      }
      
      return { success: true, exists: false, created: true, credits: data[0].credits }
    }
    
    // Other error
    return { success: false, error: checkError }
  } catch (error) {
    console.error('Unexpected error ensuring credits record:', error)
    return { success: false, error }
  }
}

export async function initializeUserCredits(userId, initialCredits = 100) {
  return await ensureUserCreditsRecord(userId, initialCredits)
}
