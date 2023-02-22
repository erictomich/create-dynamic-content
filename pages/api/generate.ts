import { Configuration, OpenAIApi } from "openai";
import fs from 'fs';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req: any, res: any) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const item = req.body.item || '';
  if (item.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid item",
      }
    });
    return;
  }

  try {
    console.log("iniciando a construção...");
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(item),
      temperature: 0.6,
      max_tokens: 2000,
    });

    var text = completion.data.choices[0].text;

    console.log(text);

    let json = JSON.parse(text);

    salvarArquivo(json);


    // json.contents = json.contents.map(async content => {
       
    //     content.submodules = await Promise.all(content.submodules.map(async submodule => {

    //         submodule.text = await generateText(submodule.title);
    //         console.log(submodule.text);

    //       return submodule;
    //     }));
    //     return content;
       
    // });



    // let structureOfTitles = [];

    // json.contents.forEach(content => {
    //   content.submodules = content.submodules.forEach(submodule => {
    //     structureOfTitles.push(submodule.title);
    //   });
    // });
    



    

    res.status(200).json({ result: text });
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

function salvarArquivo(content: any) {
  const fileName = `./data/${content.slug}.json`;
  const data = JSON.stringify(content, null, 2);
  
  fs.writeFile(fileName, data, function(err) {
    if (err) {
      console.error(err);
      return;
    }
  
    console.log(`Arquivo ${fileName} salvo com sucesso.`);
  });
}

function generatePrompt(item: any) {
  const capitalizedItem =
    item[0].toUpperCase() + item.slice(1).toLowerCase();
  return `Create a table of contents for a course called "${capitalizedItem}". You can create as many sections as you need to go deeper into the subject. Use JSON format. Create up to 10 modules.
  
  { 
    "course": "Economics",
    "slug": "economics",
    "contents": [
        {
           "module": 1,
           "title": "Introduction to Economics",
           "slug": "introduction-to-economics",
           "submodules": [
              {
                 "submodule": "A",
                 "title": "What is Economics?",
                 "slug": "what-is-economics"
              },
              {
                "submodule": "B",
                "title": "Basic Principles of Economics",
                "slug": "basic-principles-of-economics"
             }
           ]
        },
        {
          "module": 2,
          "title": "Microeconomics",
          "slug": "microeconomics",
          "submodules": [
             {
                "submodule": "A",
                "title": "Supply and Demand ",
                "slug": "supply-and-demand"
             },
             {
               "submodule": "B",
               "title": "Market Structures",
               "slug": "market-structures"
             },
             {
               "submodule": "C",
               "title": "Consumer Behavior",
               "slug": "consumer-behavior"
             }

          ]
       },
       {
        "module": 3,
        "title": "Macroeconomics",
        "slug": "macroeconomics",
        "submodules": [
           {
              "submodule": "A",
              "title": "Economic Growth",
              "slug": "economic-growth "
           },
           {
             "submodule": "B",
             "title": "Money and Banking",
             "slug": "money-and-banking"
           },
           {
             "submodule": "C",
             "title": "Inflation and Unemployment",
             "slug": "inflation-and-unemployment"
           }

          ]
      }

    ]
  }
 

  { 
    "course": "Health",
    "slug": "health", 
      "contents": [ 
        { "module": 1,
         "title": "Introduction to Health",
         "slug": "introduction-to-health", 
         "submodules": [ 
           { "submodule": "A", 
            "title": "Health Basics",
            "slug": "health-basics" 
           }, 
           { "submodule": "B", 
            "title": "Health and Wellness", 
            "slug": "health-and-wellness" 
           }, { 
             "submodule": "C", 
             "title": "Nutrition and Diet", 
             "slug": "nutrition-and-diet" 
           } 
         ] 
        }, 
        { "module": 2, 
         "title": "Exercise and Fitness", 
         "slug": "exercise-and-fitness", 
         "submodules": [ 
           { "submodule": "A", 
            "title": "Types of Exercise", 
            "slug": "types-of-exercise" 
           }, { "submodule": "B", 
               "title": "Benefits of Exercise",
               "slug": "benefits-of-exercise" 
              }, 
           { "submodule": "C", 
            "title": "Exercise and Weight Loss", 
            "slug": "exercise-and-weight-loss" 
           } 
         ] 
        }, 
        { "module": 3, 
         "title": "Healthy Living", 
         "slug": "healthy-living", 
         "submodules": [ 
           { "submodule": "A", 
            "title": "Stress Management", 
            "slug": "stress-management" 
           }, 
           { "submodule": "B", 
            "title": "Sleep and Rest", 
            "slug": "sleep-and-rest" 
           }, 
           { "submodule": "C", 
            "title": "Substance Abuse", 
            "slug": "substance-abuse" 
           } 
         ] 
        } 
      ] 
}
   `;
}

async function generateText(title: String) {

  try {
    const response = await fetch("http://localhost:3000/api/generatecontent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ item: title }),
    });

    const data = await response.json();
    if (response.status !== 200) {
      throw data.error || new Error(`Request failed with status ${response.status}`);
    }

    return data.result;
  } catch(error) {
    // Consider implementing your own error handling logic here
    console.error(error);
  }

}
