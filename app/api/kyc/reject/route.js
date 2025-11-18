import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request) {
  try {
    const { id, reason } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'ID manquant' },
        { status: 400 }
      )
    }

    if (!reason || reason.trim().length === 0) {
      return NextResponse.json(
        { error: 'Le motif de rejet est obligatoire' },
        { status: 400 }
      )
    }

    // Mettre à jour le statut à 'rejected'
    const { data, error } = await supabaseAdmin
      .from('kyc_submissions')
      .update({
        status: 'rejected',
        rejection_reason: reason.trim(),
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erreur Supabase:', error)
      return NextResponse.json(
        { error: 'Erreur lors du rejet du KYC' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'KYC rejeté avec succès',
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
