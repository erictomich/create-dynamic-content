import { Configuration, OpenAIApi } from "openai";
import fs, { readFileSync, writeFileSync } from 'fs';

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

    console.log(req.query)
    const file = req.query.file || '';
    if (file.trim().length === 0) {
        res.status(400).json({
        error: {
            message: "Please enter a valid item",
        }
        });
        return;
    }

    const fileName = './data/'+file+'.json'
  

  console.log(file)
  
var text = file;

  try {
    fs.access(fileName, fs.constants.F_OK, async (err) => {
        if (err) {
            console.error(`O arquivo não existe`);
            return;
        }

        var contentFile = JSON.parse(readFileSync(fileName, 'utf-8')); 



        console.log(contentFile);

        var finaliza = 0;
        var textTitle = "";
        for (const content of contentFile.contents) {
            for (const submodule of content.submodules) {
              if (!('text' in submodule)) {
                textTitle = submodule.title;
                submodule.text = await generateText(submodule.title, contentFile.course, content.title);
                console.log(`Adicionado "text" para o submodule ${submodule.slug}`);
                finaliza = 1;
                break; // Para o loop aninhado após encontrar a primeira ocorrência sem o atributo "text"
                
              }
            }
            console.log('finaliza', finaliza);
            if(finaliza == 1) break;
          }
       
        writeFileSync(fileName, JSON.stringify(contentFile, null, 2), 'utf-8');
        console.log(JSON.stringify(contentFile));

        console.log(`O arquivo existe`);

        if (textTitle == "") { 
          console.log("fim")
          res.status(200).json({ status: "fim" });

        } else {
          res.status(200).json({ status: "continua", title: textTitle });
        }
        
    });

   
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

async function generateText(title: String, course: String, moduleTitle: String) {

    try {
      const response = await fetch("http://localhost:3000/api/generatecontent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item: title, course: course, moduleTitle: moduleTitle  }),
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
  

