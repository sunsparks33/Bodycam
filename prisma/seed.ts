import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clear existing data to ensure seed is idempotent
  await prisma.bodycamClip.deleteMany({});
  await prisma.user.deleteMany({});

  // Default testing users
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const officerPasswordHash = await bcrypt.hash("cop123", 10);

  // 1. Seed default testing accounts
  await prisma.user.create({
    data: {
      username: "Commander Doe",
      badgeNumber: "001",
      password: adminPasswordHash,
      role: "HIGH_COMMAND",
    },
  });

  await prisma.user.create({
    data: {
      username: "Officer Smith",
      badgeNumber: "100",
      password: officerPasswordHash,
      role: "OFFICER",
    },
  });

  // 2. Seed users parsed from PHPMyAdmin dump mapped to IRL panel Call-Signs
  const dumpUsers = [
    { username: 'reda_admin', badgeNumber: 'P-00', password: '$2y$10$2/SNbeDy.Tmz0Z93kog2POFW4MB2ZgkDxhd7iuQ3Wmxz.BtPDwjrC', role: 'HIGH_COMMAND' as const },
    { username: 'Achraf Farkav', badgeNumber: 'P-03', password: '$2y$10$xi/Mi6gBmdKcCwo0q3VnR.15w04S.WiIf/gJAT/eZkXAsIGhKfTiq', role: 'HIGH_COMMAND' as const },
    { username: 'Enrico Berti', badgeNumber: 'P-01', password: '$2y$10$JiRyqvwDFXkeXY48KlYE6uUaVT8EY63dn2t5ghJgCdNbx1lfZLlfu', role: 'HIGH_COMMAND' as const },
    { username: 'Leo Berti', badgeNumber: 'P-10', password: '$2y$10$v.ddfufL3t0Ioc.TqhtLH.YQA14Vy4QPlZG9nsR3eH105bO.jSvK2', role: 'HIGH_COMMAND' as const },
    { username: 'John Marston', badgeNumber: 'P-65', password: '$2y$10$z3XTZpOYh6o74XpzG9sGiOG7NnAsYy4BoVa/pxGo5PiBNcFYhNjvq', role: 'OFFICER' as const },
    { username: 'Zack Corleon', badgeNumber: 'P-55', password: '$2y$10$cOa7XwWwJx9DfmKmmUenDuCGgeaariHP/wI7vSBbjYgP6iZbBp5a2', role: 'OFFICER' as const },
    { username: 'Vladimir Anthony', badgeNumber: 'P-59', password: '$2y$10$gX8f8GUi70Qlq0B16fjxHeN3bhDPced98mipbrAz1oIdiV2JA1zpS', role: 'OFFICER' as const },
    { username: 'Hassan Dakhamat', badgeNumber: 'P-60', password: '$2y$10$b21DPgUI20yQ8GsMyDr.a.k14CWmS6mMJdw6.vCv1Zz8Ejgb.qX6K', role: 'OFFICER' as const },
    { username: 'Leon Kennedy', badgeNumber: 'P-76', password: '$2y$10$NMqZLaA/ZT9CI/SKp0ni5OAEpxlw7VrKAOZSiz.kVCS5Sw3vdaJoW', role: 'OFFICER' as const },
    { username: 'Isaac Kahnwald', badgeNumber: 'P-61', password: '$2y$10$iyf7XYHsH9MVsMGYVsw4N.bjPDajJjJG.yhQALlKW55wavJwvPdLG', role: 'OFFICER' as const },
    { username: 'Mike Jackson', badgeNumber: 'P-24', password: '$2y$10$cbX6uY6G8EAkEVzq9fCMs.JdWQmFdlUlfknaahpW.e4HfdvVoflZu', role: 'OFFICER' as const },
    { username: 'Polaski Louis', badgeNumber: 'P-62', password: '$2y$10$v.56mS8pBWiCANx9wfi8ruiHrIFMRN26d2qaMpGWFsu8Jgx4t540y', role: 'OFFICER' as const },
    { username: 'Ethan Kennedy', badgeNumber: 'P-98', password: '$2y$10$UBjySQpYGjSbVJjTa/u1Ge5KyLkK7a8wtDPUSfQfZXsw49fikcVsC', role: 'OFFICER' as const },
    { username: 'Mark Bissos', badgeNumber: 'P-52', password: '$2y$10$DdUbuNsbM/iVyqIVCYJLR.KcFRmpN8VikDlSATxuGvPfhqSmDEo5u', role: 'OFFICER' as const },
    { username: 'Ali Alaoui', badgeNumber: 'P-67', password: '$2y$10$hoD0ExdgHh.6R6GaXwEBse9woXrK8euSFqzmCVTKwTt.La3OUYDJm', role: 'OFFICER' as const },
    { username: 'Soulayman Abodrar', badgeNumber: 'P-51', password: '$2y$10$MXr1apiqX6XtlQ3mHx1YqOZXQG2ZdrCw0u0gOlvMAAVDCiAP7kV0O', role: 'OFFICER' as const },
    { username: 'Tim Bradford', badgeNumber: 'P-29', password: '$2y$10$D.xNmsPeJLvE0WnmuvigX.0adnBDbzHR3FK8kyJcSzLY0Rj4wEyKy', role: 'OFFICER' as const },
    { username: 'James Scoot', badgeNumber: 'P-70', password: '$2y$10$.RyH/xwIwBMP1rSMlPtVa.23pq06d2HGN6p0mo9VkUECbsaiuQPai', role: 'OFFICER' as const },
    { username: 'Dimitri Petrov', badgeNumber: 'P-21', password: '$2y$10$uiYbJlTVapSuoN.X9bl.W.hLk6WVTNCy9KTd/OhFPwKVliI70p3x2', role: 'OFFICER' as const },
    { username: 'Melvin Harris', badgeNumber: 'P-71', password: '$2y$10$MY2TFIX4E6zDUFApAdFGse.eQnsDmDTlWHgpQ1PjRrTWXhBNYgddq', role: 'OFFICER' as const }
  ];

  for (const user of dumpUsers) {
    await prisma.user.create({
      data: {
        username: user.username,
        badgeNumber: user.badgeNumber,
        password: user.password,
        role: user.role,
      },
    });
  }

  console.log("Database seeded successfully with all LSPD officers and Call-Signs!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
