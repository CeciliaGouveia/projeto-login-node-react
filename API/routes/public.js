import express from "express"
import { PrismaClient } from "../generated/prisma/index.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET

// Rota de Cadastro
router.post("/cadastro", async (req, res) => {
  try {
    const user = req.body
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(user.password, salt)

    const userDB = await prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: hashPassword,
      },
    })
    res.status(201).json(userDB)
  } catch (err) {
    res.status(500).json({ message: "Erro no Servidor, tente novamente" })
  }
})

// Rota de Login
router.post("/login", async (req, res) => {
  try {
    const userInfo = req.body

    // prisma acessará o mongo e vai pedir para o servidor encontrar UM usuário que tenha o email que o usuário digitou no login
    const userDataBase = await prisma.user.findUnique({
      where: { email: userInfo.email },
    })

    // se não acharmos o usuário, retornará um código de erro informando qeu o usuário não foi encontrado
    if (!userDataBase) {
      return res.status(404).json({ message: "Usuário não encontrado" })
    }

    // vamos comparar se a senha digitada pelo usuário é igual a senha que pegamos no banco de dados
    const isMatch = await bcrypt.compare(
      userInfo.password,
      userDataBase.password
    )

    if (!isMatch) {
      return res.status(400).json({ message: "Senha inválida" })
    }

    // Gera token JWT
    const token = jwt.sign({ id: userDataBase.id }, JWT_SECRET, {
      expiresIn: "7d",
    })

    res.status(200).json(token)
  } catch (err) {
    res.status(500).json({ message: "Erro no Servidor, tente novamente" })
  }
})

export default router
