import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'ID manquant' },
        { status: 400 }
      )
    }

    // Mettre à jour le statut à 'approved'
    const { data, error } = await supabaseAdmin
      .from('kyc_submissions')
      .update({
        status: 'approved',
        reviewed_at: new Date().toISOString(),
        rejection_reason: null, // Effacer le motif de rejet précédent si existant
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erreur Supabase:', error)
      return NextResponse.json(
        { error: 'Erreur lors de l\'approbation du KYC' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'KYC approuvé avec succès',
      data
    })
  } catch (error) {
    console.error('Erreur serveur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
