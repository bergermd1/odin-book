const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
// console.log(prisma);

module.exports = prisma;