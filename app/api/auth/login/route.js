import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { username, password } = await request.json()

    // Vérifier les credentials (simple pour démonstration)
    // En production, utilisez bcrypt et une base de données
    const validUsername = process.env.ADMIN_USERNAME
    const validPassword = process.env.ADMIN_PASSWORD

    if (username === validUsername && password === validPassword) {
      // Générer un token simple (en production, utilisez JWT)
      const token = Buffer.from(`${username}:${Date.now()}`).toString('base64')

      return NextResponse.json({
        success: true,
        token,
        user: {
          username,
          role: 'admin'
        }
      })
    }

    return NextResponse.json(
      { error: 'Identifiants incorrects' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Erreur login:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
