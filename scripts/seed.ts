import { Prisma, PrismaClient } from "@prisma/client";
import u1l1 from "./seed/u1l1.json";
import u1l2 from "./seed/u1l2.json";
import u1l3 from "./seed/u1l3.json";
import u2l1 from "./seed/u1l1.json";
import u2l2 from "./seed/u1l2.json";
import u2l3 from "./seed/u1l3.json";
import u2l4 from "./seed/u1l3.json";

const units: Prisma.UnitCreateInput[] = [
  {
    title: "Basic register copy instructions",
    // description: "Instructions that move data between registers and memory.",
    order: 0,
    lessons: {
      createMany: {
        data: [
          {
            title: "Copying values between registers",
            description: "Learn how to copy values between registers.",
            order: 0,
            challenges: JSON.stringify(u1l1),
          },
          {
            title: "Copying constant values to registers",
            description: "Learn how to fill registers with immediate values.",
            order: 1,
            challenges: JSON.stringify(u1l2),
          },
          {
            title: "Register copy and immediate values review",
            description: "Review copying values between registers and immediate values.",
            order: 2,
            challenges: JSON.stringify(u1l3),
          },
        ],
      },
    },
  },
  {
    // Basic Arithmethc
    title: "Fundamentals of Assembly Arithmetic",
    order: 1,
    lessons: {
      createMany: {
        data: [
          {
            title: "Adding two registers",
            description: "Learn to add values stored in two different registers.",
            order: 0,
            challenges: JSON.stringify(u2l1),
          },
          {
            title: "Adding numbers to registers",
            description: "Discover how to add a fixed number directly to a register.",
            order: 1,
            challenges: JSON.stringify(u2l2),
          },
          {
            title: "Addition practice",
            description: "Reinforce your skills with various addition exercises.",
            order: 2,
            challenges: JSON.stringify(u2l3),
          },
          {
            title: "Progress checkpoint",
            description: "Review key concepts including register operations and basic addition.",
            order: 3,
            challenges: JSON.stringify(u2l4),
          },
        ],
      },
    },
  },
];

(async function () {
  console.log("Seeding database...");

  const prisma = new PrismaClient();

  if ((await prisma.unit.count()) > 0) {
    console.log("Database already seeded.");
    return;
  }

  for await (const unit of units) {
    await prisma.unit.create({ data: unit });
  }

  console.log("Database seeded.");
})();
