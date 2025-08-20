

import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Limita el pool de conexiones para entornos serverless (Vercel)
const prisma =
	globalForPrisma.prisma ||
	new PrismaClient({
		datasources: { db: { url: process.env.DATABASE_URL } },
		// Limita el pool de conexiones a 1 para evitar errores en serverless
		log: ["error", "warn"],
	});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Cierra Prisma Client en serverless para liberar conexiones
if (process.env.NODE_ENV === "production") {
	process.on("beforeExit", async () => {
		await prisma.$disconnect();
	});
}

export { prisma };