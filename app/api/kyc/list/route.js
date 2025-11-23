// app/api/kyc/list/route.js
// API pour récupérer la liste des KYC avec URLs signées

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // ⚠️ Utiliser la Service Role Key côté serveur
)

export async function GET(request) {
  try {
    // 1. Récupérer tous les KYC
    const { data: kycList, error } = await supabase
      .from('kyc_submissions')
      .select('*')
      .order('submitted_at', { ascending: false })

    if (error) {
      console.error('❌ Erreur Supabase:', error)
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 })
    }

    // 2. Générer des URLs signées pour chaque KYC
    const kycListWithSignedUrls = await Promise.all(
      kycList.map(async (kyc) => {
        try {
          // Durée de validité des URLs signées : 1 heure (3600 secondes)
          const signedUrlOptions = { expiresIn: 3600 }

          // Générer URL signée pour la photo ID
          let id_photo_signed_url = null
          if (kyc.id_photo_url) {
            const idPhotoPath = extractPathFromUrl(kyc.id_photo_url)
            if (idPhotoPath) {
              const { data: idData, error: idError } = await supabase.storage
                .from('kyc-documents')
                .createSignedUrl(idPhotoPath, signedUrlOptions.expiresIn)
              
              if (!idError && idData) {
                id_photo_signed_url = idData.signedUrl
              } else {
                console.warn('⚠️ Erreur URL ID photo:', kyc.wallet_address, idError)
              }
            }
          }

          // Générer URL signée pour le selfie
          let selfie_signed_url = null
          if (kyc.selfie_url) {
            const selfiePath = extractPathFromUrl(kyc.selfie_url)
            if (selfiePath) {
              const { data: selfieData, error: selfieError } = await supabase.storage
                .from('kyc-documents')
                .createSignedUrl(selfiePath, signedUrlOptions.expiresIn)
              
              if (!selfieError && selfieData) {
                selfie_signed_url = selfieData.signedUrl
              } else {
                console.warn('⚠️ Erreur URL selfie:', kyc.wallet_address, selfieError)
              }
            }
          }

          // Générer URL signée pour le justificatif d'adresse
          let proof_address_signed_url = null
          if (kyc.proof_address_url) {
            const proofPath = extractPathFromUrl(kyc.proof_address_url)
            if (proofPath) {
              const { data: proofData, error: proofError } = await supabase.storage
                .from('kyc-documents')
                .createSignedUrl(proofPath, signedUrlOptions.expiresIn)
              
              if (!proofError && proofData) {
                proof_address_signed_url = proofData.signedUrl
              } else {
                console.warn('⚠️ Erreur URL justificatif:', kyc.wallet_address, proofError)
              }
            }
          }

          return {
            ...kyc,
            // Remplacer les URLs par les URLs signées
            id_photo_url: id_photo_signed_url || kyc.id_photo_url,
            selfie_url: selfie_signed_url || kyc.selfie_url,
            proof_address_url: proof_address_signed_url || kyc.proof_address_url
          }
        } catch (err) {
          console.error('❌ Erreur traitement KYC:', kyc.wallet_address, err)
          return kyc // Retourner le KYC original en cas d'erreur
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: kycListWithSignedUrls,
      count: kycListWithSignedUrls.length
    })

  } catch (error) {
    console.error('❌ Erreur serveur:', error)
    return NextResponse.json({
      success: false,
      error: 'Erreur serveur interne'
    }, { status: 500 })
  }
}

// Fonction utilitaire pour extraire le path du fichier depuis l'URL Supabase
function extractPathFromUrl(url) {
  if (!url) return null
  
  try {
    // Format URL Supabase Storage :
    // https://xxxxx.supabase.co/storage/v1/object/public/kyc-documents/wallet_address/filename.jpg
    // On veut extraire : wallet_address/filename.jpg
    
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/')
    
    // Trouver l'index de 'kyc-documents' dans le path
    const bucketIndex = pathParts.indexOf('kyc-documents')
    
    if (bucketIndex !== -1 && bucketIndex + 1 < pathParts.length) {
      // Récupérer tout ce qui vient après 'kyc-documents'
      const filePath = pathParts.slice(bucketIndex + 1).join('/')
      return filePath
    }
    
    return null
  } catch (err) {
    console.error('❌ Erreur extraction path:', err)
    return null
  }
}