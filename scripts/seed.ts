import { Prisma, PrismaClient } from "@prisma/client";

const units: Prisma.UnitCreateInput[] = [
  {
    title: "Data Transfer Instructions",
    // description: "Instructions that move data between registers and memory.",
    order: 0,
    lessons: {
      createMany: {
        data: [
          {
            title: "Copying values between registers",
            description: "Learn how to copy values between registers.",
            order: 0,
            challenges: JSON.stringify([
              {
                type: "gap-fill",
                translation: "Copy the value from R0 to R4",
                prompt: [
                  {
                    value: "mov",
                    type: "operation",
                    hint: "MOV Rm Rn: Copy value from Rm to Rn.",
                  },
                  { value: "r0", type: "register", hint: "Register r0" },
                  { value: "r4", type: "register", hint: "Register r4" },
                ],
                choices: ["nop", "mov.l", "mov"],
                fillableIndex: 0,
                correctIndex: 2,
              },
              {
                type: "gap-fill",
                translation: "Copy the value from R8 to R0",
                prompt: [
                  {
                    value: "mov",
                    type: "operation",
                    hint: "MOV Rm Rn: Copy value from Rm to Rn.",
                  },
                  { value: "r8", type: "register", hint: "Register r0" },
                  { value: "r0", type: "register", hint: "Register r4" },
                ],
                choices: ["r8", "r0", "fr0"],
                fillableIndex: 2,
                correctIndex: 1,
              },
            ]),
          },
          {
            title: "Copying values between registers",
            description: "Learn how to copy values between registers.",
            order: 1,
            challenges: JSON.stringify([
              {
                type: "gap-fill",
                translation: "Copy the value from R0 to R4",
                prompt: [
                  {
                    value: "mov",
                    type: "operation",
                    hint: "MOV Rm Rn: Copy value from Rm to Rn.",
                  },
                  { value: "r0", type: "register", hint: "Register r0" },
                  { value: "r4", type: "register", hint: "Register r4" },
                ],
                choices: ["nop", "mov.l", "mov"],
                fillableIndex: 0,
                correctIndex: 2,
              },
              {
                type: "gap-fill",
                translation: "Copy the value from R8 to R0",
                prompt: [
                  {
                    value: "mov",
                    type: "operation",
                    hint: "MOV Rm Rn: Copy value from Rm to Rn.",
                  },
                  { value: "r8", type: "register", hint: "Register r0" },
                  { value: "r0", type: "register", hint: "Register r4" },
                ],
                choices: ["r8", "r0", "fr0"],
                fillableIndex: 2,
                correctIndex: 1,
              },
            ]),
          },
        ],
      },
    },
  },
  {
    title: "More Data Transfer Instructions",
    // description: "Instructions that move data between registers and memory.",
    order: 1,
    lessons: {
      createMany: {
        data: [
          {
            title: "Copying values between registers",
            description: "Learn how to copy values between registers.",
            order: 0,
            challenges: JSON.stringify([
              {
                type: "gap-fill",
                translation: "Copy the value from R0 to R4",
                prompt: [
                  {
                    value: "mov",
                    type: "operation",
                    hint: "MOV Rm Rn: Copy value from Rm to Rn.",
                  },
                  { value: "r0", type: "register", hint: "Register r0" },
                  { value: "r4", type: "register", hint: "Register r4" },
                ],
                choices: ["nop", "mov.l", "mov"],
                fillableIndex: 0,
                correctIndex: 2,
              },
              {
                type: "gap-fill",
                translation: "Copy the value from R8 to R0",
                prompt: [
                  {
                    value: "mov",
                    type: "operation",
                    hint: "MOV Rm Rn: Copy value from Rm to Rn.",
                  },
                  { value: "r8", type: "register", hint: "Register r0" },
                  { value: "r0", type: "register", hint: "Register r4" },
                ],
                choices: ["r8", "r0", "fr0"],
                fillableIndex: 2,
                correctIndex: 1,
              },
            ]),
          },
          {
            title: "Copying values between registers",
            description: "Learn how to copy values between registers.",
            order: 1,
            challenges: JSON.stringify([
              {
                type: "gap-fill",
                translation: "Copy the value from R0 to R4",
                prompt: [
                  {
                    value: "mov",
                    type: "operation",
                    hint: "MOV Rm Rn: Copy value from Rm to Rn.",
                  },
                  { value: "r0", type: "register", hint: "Register r0" },
                  { value: "r4", type: "register", hint: "Register r4" },
                ],
                choices: ["nop", "mov.l", "mov"],
                fillableIndex: 0,
                correctIndex: 2,
              },
              {
                type: "gap-fill",
                translation: "Copy the value from R8 to R0",
                prompt: [
                  {
                    value: "mov",
                    type: "operation",
                    hint: "MOV Rm Rn: Copy value from Rm to Rn.",
                  },
                  { value: "r8", type: "register", hint: "Register r0" },
                  { value: "r0", type: "register", hint: "Register r4" },
                ],
                choices: ["r8", "r0", "fr0"],
                fillableIndex: 2,
                correctIndex: 1,
              },
            ]),
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
