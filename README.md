# transmogrifier

![Scientific Progress Goes Boink](./docs/transmogrifier-zap.png)

Unstructured data goes in, structured data comes out. Sometimes comedically.

## What's this?

`transmogrifier` is a TypeScript library that lets you:

1. Define a schema
2. Call `transmogrify("some unstructured content", myDesiredSchema)`
3. Get data back

That's... it.

## Show me an example!

Sure thing, let's do this. Find some content to transmogrify:

```typescript
const inputText = `
On Tuesday, the CEO of Apple Inc., Tim Cook, announced the release of the 
new iPhone 12. The device features a sleek design and improved camera 
technology. Cook stated that the iPhone 12 will be available for purchase 
in stores and online starting on Friday, October 23rd. Google spokesperson
Alberto Chase reminds customers that Pixel phones have long had superior
photographic hardware and software.
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
    "Apple Inc", "Google"
  ],
  "products": [
    "iPhone 12", "Pixel"
  ],
  "people": [
    "Tim Cook", "Alberto Chase"
  ],
  "dates": [
    "Friday, October 23rd"
  ],
  "events": [
    "release of the new iPhone 12"
  ]
}
```

You can use all the niceties of Zod and Typescript:

```typescript
// Zod can infer a static type
type SchemaType = z.infer<typeof Schema>;

// When calling transmogrify(...) you'll either get data matching the expected type, or an exception
const result: SchemaType = await transmogrifier.transmogrify(inputText, Schema);
```


### Colophon

One nice thing about the `transmogrify()` method is that it has a nice type contract: either you get back a thing that is _known_ at runtime to match your target schema (and, thanks to the magic of TypeScript and Zod, the equivalent compile-time type too), or an exception is raised. If you get data back, it's the right shape.

I threw this together in like 30 minutes. I haven't packaged it, published it to `npm`, polished it, or anything else. It's basically (`src/index.ts`) and nothing else.
