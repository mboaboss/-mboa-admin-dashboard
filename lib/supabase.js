import { createClient } from '@supabase/supabase-js'

// Client Supabase standard (pour les opérations de lecture)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Client Supabase avec Service Role (pour les opérations admin)
// ⚠️ Ne doit être utilisé QUE dans les API Routes côté serveur
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Fonction pour vérifier si une URL est accessible
export async function checkImageUrl(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok
  } catch (error) {
    console.error('Erreur vérification image:', error)
    return false
  }
}
