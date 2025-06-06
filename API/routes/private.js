import express from "express"
import { PrismaClient } from "../generated/prisma/index.js"

const router = express.Router()

const prisma = new PrismaClient()

router.get("/listar-usuarios", async (req, res) => {
  try {
    const users = await prisma.user.findMany({ omit: { password: true } })

    res.status(200).json({ message: "Usuários listados com sucesso", users })
  } catch (err) {
    res.status(500).json({ message: "Erro no servidor" })
  }
})

export default router
