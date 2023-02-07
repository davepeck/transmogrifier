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

Sure thing, let's do this. First, install it:

```
npm install transmogrifier
```

Then define the data structure you want. Maybe you want some kind of graph? Sure, no problem:

```typescript
import { z } from "zod";

const Entity = z.object({
  name: z.string(),
  kind: z.string(),
});

const Relationship = z.object({
  source: z.string(),
  target: z.string(),
  kind: z.string(),
});

const Graph = z.object({
  entities: z.array(Entity),
  relationships: z.array(Relationship),
});
```

Grab some data:

```typescript
const inputText = `
On Tuesday, the CEO of Apple Inc., Tim Cook, announced the release of the 
new iPhone 12. The device features a sleek design and improved camera 
technology. Cook stated that the iPhone 12 will be available for purchase 
in stores and online starting on Friday, October 23rd.
`;
```

And turn the dial:

```typescript
import Transmogrifier from "transmogrifier";
const transmogrifier = new Transmogrifier(MY_OPEN_AI_API_KEY);
const result = await transmogrifier.transmogrify(inputText, Graph);
console.log(result);
```

Zap! Just like magic, you'll get something like this:

```typescript
{
  entities: [
    {
      name: "Apple Inc.",
      kind: "company",
    },
    {
      name: "iPhone 12",
      kind: "product",
    },
    {
      name: "Tim Cook",
      kind: "person",
    },
    {
      name: "2020-10-23",
      kind: "date",
    },
  ],
  relationships: [
    {
      source: "Apple Inc.",
      target: "iPhone 12",
      kind: "released",
    },
    {
      source: "Tim Cook",
      target: "iPhone 12",
      kind: "announced",
    },
    {
      source: "Apple Inc.",
      target: "Tim Cook",
      kind: "CEO",
    },
  ],
}
```

I mean, maybe you will! Try it and find out.
