# transmogrifier

![Scientific Progress Goes Boink](./docs/transmogrifier-zap.png)

Unstructured data goes in, structured data comes out. Sometimes comedically.

## What's this?

At the end of 2022, [Ian Bicking](https://ianbicking.org) shipped the hilariously weird [Infinite AI Array library](https://ianbicking.org/blog/2023/01/infinite-ai-array.html). Ian:

> Some ideas are dumb enough you just have to try them

Yup! And some dumb ideas are so great that you have to build more dumb things along the same lines.

`transmogrifier` is a TypeScript library that lets you:

1. Define a data structure
2. Call `transmogrify("some unstructured content", myDesiredDataStructure)`
3. Get data back

That's... it.

## Show me an example!

Sure thing, let's do this. Find some content to transmogrify:

```typescript
const inputText = `
On Tuesday, the CEO of Apple Inc., Tim Cook, announced the release of the 
new iPhone 12. The device features a sleek design and improved camera 
technology. Cook stated that the iPhone 12 will be available for purchase 
in stores and online starting on Friday, October 23rd.
`;
```

Then define whatever schema your heart desires:

```typescript
import { z } from "zod";

const Schema = z.object({
  companies: z.array(z.string()),
  products: z.array(z.string()),
  people: z.array(z.string()),
  dates: z.array(z.string()),
  events: z.array(z.string()),
});
```

Now turn the dial:

```typescript
import Transmogrifier from "transmogrifier";
const transmogrifier = new Transmogrifier(MY_OPEN_AI_API_KEY);
const result = await transmogrifier.transmogrify(inputText, Schema);
console.log(result);
```

Zap! Just like ~magic~science, you'll get something like this:

```json
{
  "companies": [
    "Apple Inc"
  ],
  "products": [
    "iPhone 12"
  ],
  "people": [
    "Tim Cook"
  ],
  "dates": [
    "Friday, October 23rd"
  ],
  "events": [
    "release of the new iPhone 12"
  ]
}
```

I mean, maybe you will! Try it and find out.
