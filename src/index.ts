import { Configuration, OpenAIApi } from "openai";
import { z } from "zod";
import { createTypeAlias, printNode, zodToTs } from "zod-to-ts";

// For now, require that all transmogrifications be to an object
const ExampleObjectSchema = z.object({});

// TODO: Make this configurable
const OPENAI_MODEL = "text-davinci-003";

/** Unstructured text goes in; structured data comes out. Sometimes comedically. */
class Transmogrifier {
  private client: OpenAIApi;

  constructor(openAIAPIKey?: string) {
    const apiKey = openAIAPIKey ?? process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "No OpenAI API key provided. Pass it into the constructor or set the OPENAI_API_KEY environment variable."
      );
    }
    const configuration = new Configuration({
      apiKey,
    });
    this.client = new OpenAIApi(configuration);
  }

  private zodSchemaToTypescript(schema: z.ZodObject<{}>): string {
    const { node } = zodToTs(schema);
    const typeAlias = createTypeAlias(node, "ExpectedOutputType");
    return printNode(typeAlias);
  }

  private buildPrompt(text: string, schema: z.ZodObject<{}>): string {
    const typescript = this.zodSchemaToTypescript(schema);
    return `
Consider the following typescript type:

${typescript}

Now, please extract relevant information from the following text. Return a well-formatted JSON file that matches the above type:

${text}
`;
  }

  public async transmogrify<T extends z.ZodObject<{}>>(
    text: string,
    schema: T
  ): Promise<z.infer<T>> {
    const prompt = this.buildPrompt(text, schema);
    const response = await this.client.createCompletion({
      model: OPENAI_MODEL,
      prompt,
      max_tokens: 2048,
    });
    const maybeOutput = response.data.choices[0].text;
    if (!maybeOutput) throw new Error("No output from OpenAI");
    try {
      // we asked for JSON; see if we can parse it
      return schema.parse(JSON.parse(maybeOutput));
    } catch (e) {
      // sometimes GPT-3 returns a Javascript literal object instead of JSON
      // so do some awful eval() magic to try to parse it
      try {
        const iife = `(function() { const data = ${maybeOutput};\nreturn data; })()`;
        return schema.parse(eval(iife));
      } catch (e) {
        throw new Error(
          `OpenAI returned a response that could not be parsed as JSON or evaluated as Javascript: ${maybeOutput}`
        );
      }
    }
  }
}

export default Transmogrifier;
