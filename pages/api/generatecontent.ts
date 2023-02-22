import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

const openai = new OpenAIApi(configuration);

export default async function(req: any, res: any) { 
    if (!configuration.apiKey) {
        res.status(500).json({
          error: {
            message: "OpenAI API key not configured, please follow instructions in README.md",
          }
        });
        return;
      }

    const item = req.body.item || '';
    const course = req.body.course || '';
    const moduleTitle = req.body.moduleTitle || '';
    if (item.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid item",
      }
    });
    return;
  }
  console.log(item)
  
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(item, course, moduleTitle),
      temperature: 0.6,
      max_tokens: 2000,
    });
    console.log(completion.data.choices[0].text )
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error: any) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(item: String, course: String, moduleTitle:String) {

  return `Considering the context of a course with the title "${course}". In Module "${moduleTitle}". Create a text with title "${item}". If there is a need to insert code examples, include the codes inside tag <code></code>. Example: <code language="php">$name = \"Teste\"; echo $name;</code>`;
}