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

transmogrifier
  .transmogrify(inputText, Schema)
  .then((result) => console.log(JSON.stringify(result, null, 2)))
  .catch((err) => console.error(err));
