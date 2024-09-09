import React from "react";
import type { Preview } from "@storybook/react";
import { Nunito } from "next/font/google";
import clsx from "clsx";
import "../src/app/globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito",
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div className={clsx("font-sans", nunito.variable)}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
