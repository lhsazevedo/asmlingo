const fs = require('fs');

function generateChallenges(count) {
  const challenges = [];
  const registers = ['r0', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9', 'r10', 'r11', 'r12', 'r13', 'r14', 'r15'];

  for (let i = 0; i < count; i++) {
    const instructionType = Math.random();
    if (instructionType < 0.25) {
      challenges.push(generateRegisterMoveChallenge(registers));
    } else if (instructionType < 0.5) {
      challenges.push(generateImmediateMoveChallenge(registers));
    } else if (instructionType < 0.75) {
      challenges.push(generateRegisterAddChallenge(registers));
    } else {
      challenges.push(generateImmediateAddChallenge(registers));
    }
  }

  return challenges;
}

function generateRegisterMoveChallenge(registers) {
  const sourceReg = registers[Math.floor(Math.random() * registers.length)];
  const destReg = registers[Math.floor(Math.random() * registers.length)];
  
  const fillableIndex = Math.floor(Math.random() * 3);
  const correctChoice = fillableIndex === 0 ? "mov" : (fillableIndex === 1 ? sourceReg : destReg);

  const distractors = generateChoices(fillableIndex, correctChoice);
  const correctIndex = Math.floor(Math.random() * 3);
  distractors.splice(correctIndex, 0, correctChoice);

  return {
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
}

function generateImmediateMoveChallenge(registers) {
  const destReg = registers[Math.floor(Math.random() * registers.length)];
  const immediateValue = Math.floor(Math.random() * 256) - 128; // Signed byte: -128 to 127
  const immediateHex = `#0x${(immediateValue & 0xFF).toString(16).padStart(2, '0')}`;
  
  const fillableIndex = Math.floor(Math.random() * 3);
  const correctChoice = fillableIndex === 0 ? "mov" : (fillableIndex === 1 ? immediateHex : destReg);

  const distractors = generateChoices(fillableIndex, correctChoice, true);
  const correctIndex = Math.floor(Math.random() * 3);
  distractors.splice(correctIndex, 0, correctChoice);

  return {
    type: "gap-fill",
    translation: `Copy the immediate value ${immediateHex} to ${destReg.toUpperCase()}`,
    prompt: [
      {
        value: "mov",
        type: "operation",
        hint: "MOV #imm,Rn: Copy immediate signed byte to register Rn.",
      },
      { value: immediateHex, type: "immediate", hint: "Immediate value" },
      { value: destReg, type: "register", hint: `Register ${destReg}` },
    ],
    choices: distractors,
    fillableIndex: fillableIndex,
    correctIndex: correctIndex,
  };
}

function generateRegisterAddChallenge(registers) {
  const sourceReg = registers[Math.floor(Math.random() * registers.length)];
  const destReg = registers[Math.floor(Math.random() * registers.length)];
  
  const fillableIndex = Math.floor(Math.random() * 3);
  const correctChoice = fillableIndex === 0 ? "add" : (fillableIndex === 1 ? sourceReg : destReg);

  const distractors = generateChoices(fillableIndex, correctChoice);
  const correctIndex = Math.floor(Math.random() * 3);
  distractors.splice(correctIndex, 0, correctChoice);

  return {
    type: "gap-fill",
    translation: `Add the value in ${sourceReg.toUpperCase()} to ${destReg.toUpperCase()}`,
    prompt: [
      {
        value: "add",
        type: "operation",
        hint: "ADD Rm,Rn: Add the contents of Rm to Rn and store the result in Rn.",
      },
      { value: sourceReg, type: "register", hint: `Register ${sourceReg}` },
      { value: destReg, type: "register", hint: `Register ${destReg}` },
    ],
    choices: distractors,
    fillableIndex: fillableIndex,
    correctIndex: correctIndex,
  };
}

function generateImmediateAddChallenge(registers) {
  const destReg = registers[Math.floor(Math.random() * registers.length)];
  const immediateValue = Math.floor(Math.random() * 256) - 128; // Signed byte: -128 to 127
  const immediateHex = `#0x${(immediateValue & 0xFF).toString(16).padStart(2, '0')}`;
  
  const fillableIndex = Math.floor(Math.random() * 3);
  const correctChoice = fillableIndex === 0 ? "add" : (fillableIndex === 1 ? immediateHex : destReg);

  const distractors = generateChoices(fillableIndex, correctChoice, true);
  const correctIndex = Math.floor(Math.random() * 3);
  distractors.splice(correctIndex, 0, correctChoice);

  return {
    type: "gap-fill",
    translation: `Add the immediate value ${immediateHex} to ${destReg.toUpperCase()}`,
    prompt: [
      {
        value: "add",
        type: "operation",
        hint: "ADD #imm,Rn: Add immediate signed byte to register Rn.",
      },
      { value: immediateHex, type: "immediate", hint: "Immediate value" },
      { value: destReg, type: "register", hint: `Register ${destReg}` },
    ],
    choices: distractors,
    fillableIndex: fillableIndex,
    correctIndex: correctIndex,
  };
}

function generateChoices(fillableIndex, correctChoice, isImmediate = false) {
  const instructions = ["mov", "sub", "and", "or", "xor", "not", "cmp", "jmp", "bra", "rts"];
  const registers = ['r0', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9', 'r10', 'r11', 'r12', 'r13', 'r14', 'r15'];
  const specialRegisters = ['pc', 'sp', 'sr', 'gbr', 'vbr', 'mach', 'macl', 'pr'];

  let choices = [];

  if (fillableIndex === 0) {
    // For instructions
    while (choices.length < 2) {
      const randomInstruction = instructions[Math.floor(Math.random() * instructions.length)];
      if (randomInstruction !== correctChoice && !choices.includes(randomInstruction)) {
        choices.push(randomInstruction);
      }
    }
  } else if (fillableIndex === 1 && isImmediate) {
    // For immediate values
    while (choices.length < 2) {
      const randomImmediate = `#0x${Math.floor(Math.random() * 256).toString(16).padStart(2, '0')}`;
      if (randomImmediate !== correctChoice && !choices.includes(randomImmediate)) {
        choices.push(randomImmediate);
      }
    }
  } else {
    // For registers
    while (choices.length < 2) {
      const useSpecialRegister = Math.random() < 0.3; // 30% chance to use a special register
      const registerPool = useSpecialRegister ? specialRegisters : registers;
      const randomRegister = registerPool[Math.floor(Math.random() * registerPool.length)];
      if (randomRegister !== correctChoice && !choices.includes(randomRegister)) {
        choices.push(randomRegister);
      }
    }
  }

  return choices;
}

const challenges = generateChallenges(10);

const output = JSON.stringify(challenges, null, 2);

fs.writeFileSync('challenges.json', output);

console.log('Challenges have been generated and saved to challenges.json');
