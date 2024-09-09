const fs = require("fs");

function generateChallenges(count) {
  const challenges = [];
  const registers = [
    "r0",
    "r1",
    "r2",
    "r3",
    "r4",
    "r5",
    "r6",
    "r7",
    "r8",
    "r9",
    "r10",
    "r11",
    "r12",
    "r13",
    "r14",
    "r15",
  ];

  for (let i = 0; i < count; i++) {
    const sourceReg = registers[Math.floor(Math.random() * registers.length)];
    const destReg = registers[Math.floor(Math.random() * registers.length)];

    const fillableIndex = Math.floor(Math.random() * 3);
    const correctChoice =
      fillableIndex === 0 ? "mov" : fillableIndex === 1 ? sourceReg : destReg;

    const distractors = generateChoices(fillableIndex, correctChoice);
    const correctIndex = Math.floor(Math.random() * 3);
    distractors.splice(correctIndex, 0, correctChoice);

    const challenge = {
      type: "gap-fill",
      translation: `Copy the value from ${sourceReg.toUpperCase()} to ${destReg.toUpperCase()}`,
      prompt: [
        {
          value: "mov",
          type: "operation",
          hint: "MOV Rm Rn: Copy value from Rm to Rn.",
        },
        { value: sourceReg, type: "register", hint: `Register ${sourceReg}` },
        { value: destReg, type: "register", hint: `Register ${destReg}` },
      ],
      choices: distractors,
      fillableIndex: fillableIndex,
      correctIndex: correctIndex,
    };

    challenges.push(challenge);
  }

  return challenges;
}

function generateChoices(fillableIndex, correctChoice) {
  const instructions = [
    "add",
    "sub",
    "and",
    "or",
    "xor",
    "not",
    "cmp",
    "jmp",
    "bra",
    "rts",
  ];
  const registers = [
    "r0",
    "r1",
    "r2",
    "r3",
    "r4",
    "r5",
    "r6",
    "r7",
    "r8",
    "r9",
    "r10",
    "r11",
    "r12",
    "r13",
    "r14",
    "r15",
  ];
  const specialRegisters = [
    "pc",
    "sp",
    "sr",
    "gbr",
    "vbr",
    "mach",
    "macl",
    "pr",
  ];

  let choices = [];

  if (fillableIndex === 0) {
    // For instructions
    while (choices.length < 2) {
      const randomInstruction =
        instructions[Math.floor(Math.random() * instructions.length)];
      if (
        randomInstruction !== correctChoice &&
        !choices.includes(randomInstruction)
      ) {
        choices.push(randomInstruction);
      }
    }
  } else {
    // For registers
    while (choices.length < 2) {
      const useSpecialRegister = Math.random() < 0.3; // 30% chance to use a special register
      const registerPool = useSpecialRegister ? specialRegisters : registers;
      const randomRegister =
        registerPool[Math.floor(Math.random() * registerPool.length)];
      if (
        randomRegister !== correctChoice &&
        !choices.includes(randomRegister)
      ) {
        choices.push(randomRegister);
      }
    }
  }

  return choices;
}

const challenges = generateChallenges(10); // Generate 10 challenges

const output = JSON.stringify(challenges, null, 2);

fs.writeFileSync("challenges.json", output);

console.log("Challenges have been generated and saved to challenges.json");
