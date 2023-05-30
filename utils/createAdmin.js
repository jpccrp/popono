const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

const email = "admin@trevoseguros.co.ao";
const password = "password";
const saltRounds = 10;

async function createAdmin() {
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const admin = await prisma.employee.create({
    data: {
      firstName: "Admin",
      lastName: "User",
      email: email,
      password: hashedPassword,
      isAdmin: true
    },
  });

  console.log("Admin user created:", admin);
  prisma.$disconnect();
}

createAdmin();