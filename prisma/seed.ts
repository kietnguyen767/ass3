import { PrismaClient, Prisma } from "../app/generated/prisma";


const prisma = new PrismaClient();

// Dữ liệu mẫu cho bảng UserP
const userPData: Prisma.UserPCreateInput[] = [
  {
    name: "Alice Nguyen",
    email: "alice@example.com",
    password: "123456",
  },
  {
    name: "Bob Tran",
    email: "bob@example.com",
    password: "654321",
  },
  {
    name: "Charlie Le",
    email: "charlie@example.com",
    password: "abcdef",
  },
];

async function main() {
  console.log("🌱 Start seeding...");
  for (const user of userPData) {
    const createdUser = await prisma.userP.create({ data: user });
    console.log(`✅ Created user: ${createdUser.name}`);
  }
  console.log("🌱 Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
