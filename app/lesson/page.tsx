export default function Page() {
  const challenges = [
    {
      type: "gap_fill",
      translation: "Copy the value from Rm to Rn",
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
      hiddenIndex: 0,
      correctIndex: 2,
    },
    {
      type: "translate",
      prompt: [
        {
          value: "mov",
          type: "operation",
          hint: "MOV Rm Rn: Copy value from Rm to Rn.",
        },
        { value: "r0", type: "register", hint: "Register r0" },
        { value: "r4", type: "register", hint: "Register r4" },
      ],
      choices: [
        { value: "mov", type: "operation" },
        { value: "r0", type: "register" },
        { value: "r4", type: "operation" },
        { value: "jump", type: "operation" },
        { value: "value", type: "operation" },
        { value: "r4", type: "operation" },
      ],
    },
    {
      type: "reverse_translate",
      prompt: [
        { value: "Copy", hint: null },
        { value: "from", hint: null },
        { value: "r0", hint: "Register r0" },
        { value: "to", hint: null },
        { value: "r4", hint: "Register r4" },
      ],
      choices: [
        { value: "mov", type: "operation" },
        { value: "r0", type: "register" },
        { value: "r4", type: "operation" },
        { value: "jump", type: "operation" },
        { value: "value", type: "operation" },
        { value: "r4", type: "operation" },
      ],
    },
  ];

  return <div />;
}
