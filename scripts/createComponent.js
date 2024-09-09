const fs = require("fs");
const path = require("path");

function createComponent(componentName) {
  const componentDir = path.join(
    process.cwd(),
    "src/components",
    componentName,
  );

  // Create component directory
  fs.mkdirSync(componentDir, { recursive: true });

  // Create component file
  const componentContent = `import styles from './${componentName}.module.css';

export interface ${componentName}Props {
  // Add your props here
}

export function ${componentName}({}: Readonly<${componentName}Props>) {
  return (
    <div className={styles.root}>
      <h1>${componentName}</h1>
    </div>
  );
};
`;
  fs.writeFileSync(
    path.join(componentDir, `${componentName}.tsx`),
    componentContent,
  );

  // Create CSS module file
  const cssContent = `.root {
  /* Add your styles here */
}
`;
  fs.writeFileSync(
    path.join(componentDir, `${componentName}.module.css`),
    cssContent,
  );

  // Create story file
  const storyContent = `import { Meta, StoryObj } from "@storybook/react";
import { ${componentName} } from './';

const meta = {
  title: "Components/${componentName}",
  component: ${componentName},
  tags: ["autodocs"],
} satisfies Meta<typeof ${componentName}>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add your props here
  },
};
`;
  fs.writeFileSync(
    path.join(componentDir, `${componentName}.stories.tsx`),
    storyContent,
  );

  // Create test file
  const testContent = `import { expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ${componentName} } from "./";

it("renders the list of choices", () => {
  render(<${componentName}/>);

  // Add your test here
});
`;
  fs.writeFileSync(
    path.join(componentDir, `${componentName}.test.tsx`),
    testContent,
  );

  // Create index file
  const indexContent = `export { ${componentName} } from './${componentName}';
`;
  fs.writeFileSync(path.join(componentDir, "index.ts"), indexContent);

  console.log(`Component ${componentName} created successfully!`);
}

// Get component name from command line argument
const componentName = process.argv[2];

if (!componentName) {
  console.error("Please provide a component name");
  process.exit(1);
}

createComponent(componentName);
