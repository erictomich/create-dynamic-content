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
  return `Crie uma estrutura de tópicos para um curso chamado "${capitalizedItem}". Use dentro da estrutura JSON: "curso": "${capitalizedItem}". Você pode criar quantas seções precisar para se aprofundar no assunto. Use o formato JSON. Crie até 10 módulos.
  
  { 
    "course": "Economia",
    "slug": "economia",
    "contents": [
        {
           "module": 1,
           "title": "Introdução à Economia",
           "slug": "introducao-a-economia",
           "submodules": [
              {
                 "submodule": "A",
                 "title": "O que é Economia?",
                 "slug": "o-que-e-economia"
              },
              {
                "submodule": "B",
                "title": "Princípios básicos de economia",
                "slug": "principios-basicos-de-economia"
             }
           ]
        },
        {
          "module": 2,
          "title": "Microeconomia",
          "slug": "microeconomia",
          "submodules": [
             {
                "submodule": "A",
                "title": "Oferta e demanda",
                "slug": "oferta-e-demanda"
             },
             {
               "submodule": "B",
               "title": "Estruturas de Mercado",
               "slug": "estruturas-de-mercado"
             },
             {
               "submodule": "C",
               "title": "Comportamento do consumidor",
               "slug": "comportamento-do-consumidor"
             }

          ]
       },
       {
        "module": 3,
        "title": "Macroeconomia",
        "slug": "macroeconomia",
        "submodules": [
           {
              "submodule": "A",
              "title": "Crescimento econômico",
              "slug": "crescimento-economico"
           },
           {
             "submodule": "B",
             "title": "Dinheiro e banco",
             "slug": "dinheiro-e-banco"
           },
           {
             "submodule": "C",
             "title": "Inflação e Desemprego",
             "slug": "inflacao-e-desemprego"
           }

          ]
      }

    ]
  }
 

  { 
    "course": "Saúde",
    "slug": "saude", 
      "contents": [ 
        { "module": 1,
         "title": "Introdução à Saúde",
         "slug": "introducao-a-saude", 
         "submodules": [ 
           { "submodule": "A", 
            "title": "Saúde básica",
            "slug": "saude-basica" 
           }, 
           { "submodule": "B", 
            "title": "Saúde e bem estar", 
            "slug": "saude-e-bem-estar" 
           }, { 
             "submodule": "C", 
             "title": "Nutrição e Dieta", 
             "slug": "nutricao-e-dieta" 
           } 
         ] 
        }, 
        { "module": 2, 
         "title": "Exercício e condicionamento físico", 
         "slug": "exercicio-e-condicionamento-fisico", 
         "submodules": [ 
           { "submodule": "A", 
            "title": "Tipos de exercício", 
            "slug": "tipos-de-exercicio" 
           }, { "submodule": "B", 
               "title": "Benefícios do exercício",
               "slug": "beneficios-do-exercicio" 
              }, 
           { "submodule": "C", 
            "title": "Exercício e Perda de peso", 
            "slug": "exercicio-e-perda-de-peso" 
           } 
         ] 
        }, 
        { "module": 3, 
         "title": "Vida Saudável", 
         "slug": "vida-saudavel", 
         "submodules": [ 
           { "submodule": "A", 
            "title": "Gerenciamento de Estresse", 
            "slug": "gerenciamento-de-estresse" 
           }, 
           { "submodule": "B", 
            "title": "Dormir e descansar", 
            "slug": "dormir-e-descansar" 
           }, 
           { "submodule": "C", 
            "title": "Abuso de substâncias", 
            "slug": "abuso-de-substancias" 
           } 
         ] 
        } 
      ] 
}

   `;
}

async function generateText(title: String) {

  try {
    const response = await fetch("http://localhost:3000/api/generatecontent_pt", {
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
