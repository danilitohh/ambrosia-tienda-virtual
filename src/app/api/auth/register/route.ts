import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone, securityQuestion, securityAnswer } = await request.json()

    // Validar datos de entrada
    if (!name || !email || !password || !phone || !securityQuestion || !securityAnswer) {
      return NextResponse.json(
        { message: "Todos los campos son requeridos" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      )
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "Ya existe una cuenta con este email" },
        { status: 400 }
      )
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 12)

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        securityQuestion,
        securityAnswer,
      },
    })

    // Remover contraseña de la respuesta
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user

    return NextResponse.json(
      { message: "Usuario creado exitosamente", user: userWithoutPassword },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating user:", error)
    
    // Verificar si es un error de Prisma
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { message: "Ya existe una cuenta con este email" },
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json(
      { message: "Error interno del servidor. Por favor, intenta de nuevo." },
      { status: 500 }
    )
  }
} 