#!/usr/bin/env node

import { z } from "zod";
import Transmogrifier from ".";

const Schema = z.object({
  companies: z.array(z.string()),
  products: z.array(z.string()),
  people: z.array(z.string()),
  dates: z.array(z.string()),
  events: z.array(z.string()),
});

const transmogrifier = new Transmogrifier();

const inputText = `
On Tuesday, the CEO of Apple Inc., Tim Cook, announced the release of the 
new iPhone 12. The device features a sleek design and improved camera 
technology. Cook stated that the iPhone 12 will be available for purchase 
in stores and online starting on Friday, October 23rd.
`;

const otherInputText = `
CEO Sundar Pichai told employees Monday the company is going to need all hands 
on deck to test Bard, its new ChatGPT rival. He also said Google will soon be 
enlisting help from partners to test an application programming interface, 
or API, that would let others access the same underlying technology.
`;

const run = async (text: string) => {
  try {
    const result = await transmogrifier.transmogrify(text, Schema);
    console.log(JSON.stringify(result, null, 2));
  } catch (e) {
    console.error(e);
  }
};

const runAll = async () => {
  await run(inputText);
  await run(otherInputText);
};

runAll().then(() => console.log("Done!"));
