import { supabase } from '@/supabase/client'

export async function getUserCredits(userId) {
  const { data, error } = await supabase
    .from('credits')
    .select('credits')
    .eq('user_id', userId)
    .single()
  
  if (error) {
    console.error('Error fetching credits:', error)
    return { credits: 0, error }
  }
  
  return { credits: data.credits, error: null }
}

export async function deductCredits(userId, amount) {
  // First check if user has enough credits
  const { credits: currentCredits, error: fetchError } = await getUserCredits(userId)
  
  if (fetchError) {
    return { success: false, error: fetchError }
  }
  
  if (currentCredits < amount) {
    return { success: false, error: 'Insufficient credits' }
  }
  
  // Deduct credits
  const { data, error } = await supabase
    .from('user_credits')
    .update({ credits: currentCredits - amount })
    .eq('user_id', userId)
    .select()
  
  if (error) {
    console.error('Error deducting credits:', error)
    return { success: false, error }
  }
  
  return { success: true, newBalance: data[0].credits }
}

export async function addCredits(userId, amount) {
  // Get current credits first
  const { credits: currentCredits, error: fetchError } = await getUserCredits(userId)
  
  if (fetchError) {
    // If no record exists, create one
    const { data, error } = await supabase
      .from('user_credits')
      .insert({ user_id: userId, credits: amount })
      .select()
    
    if (error) {
      console.error('Error creating credits record:', error)
      return { success: false, error }
    }
    
    return { success: true, newBalance: data[0].credits }
  }
  
  // Update existing record
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
}

export async function initializeUserCredits(userId, initialCredits = 100) {
  const { data, error } = await supabase
    .from('user_credits')
    .insert({ user_id: userId, credits: initialCredits })
    .select()
  
  if (error) {
    console.error('Error initializing credits:', error)
    return { success: false, error }
  }
  
  return { success: true, credits: data[0].credits }
}
