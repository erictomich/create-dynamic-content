import React from 'react'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import * as S from './styles'
import { ImprimeTexto }  from '../../components/RenderText'
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { jsx, javascript } from "react-syntax-highlighter/dist/cjs/languages/prism";
import { CopyToClipboard } from "react-copy-to-clipboard";
import MyHtmlComponent from '../../components/MyHtmlComponent';

import type {
    NextPage,
    GetServerSideProps
  } from "next";
 


const ContentDataPage: NextPage = ({ slug , data } : any) => {
  
  data = JSON.parse(data);
  
  return (
    <div>
      <S.Title>{data.course}</S.Title>
      {data.contents.map((module: any, index: any) => (
        <div key={index}>
          <S.ModuleTitle>Module {module.module}: {module.title}</S.ModuleTitle>
          {module.submodules.map((submodule: any, index: any) => (
            <S.ModuleContent key={index}>
              <S.SubModuleTitle>{submodule.submodule}: {submodule.title}</S.SubModuleTitle>
              <S.SubModuleContent><ImprimeTexto textoInteiro={highlightCode(submodule.text)} /></S.SubModuleContent>
            </S.ModuleContent>
          ))}
        </div>
      ))}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { slug } = context.query;

    const response = await fetch('http://localhost:3000/api/getcourse?course='+slug);
    const data = await response.json();

    console.log(JSON.parse(data));

    return {
      props: { slug, data },
    };
  };

  
  function CopyButton({ code }: any) {
    const [copied, setCopied] = useState(false);
  
    function handleCopy() {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  
    return (
      <S.CopyButton>
        <CopyToClipboard text={code} onCopy={handleCopy}>
          <button>{copied ? "Copiado!" : "Copiar"}</button>
        </CopyToClipboard>
      </S.CopyButton>
    );
  }
  
  function CodeBlock({ language, code }: any) {
    const [copied, setCopied] = useState(false);
  
    function handleCopy() {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  
    return (
      <S.CopyContainer>
        <CopyButton code={code} key={`copy`} />
        <SyntaxHighlighter language={language} style={materialDark}>
          {code}
        </SyntaxHighlighter>
      </S.CopyContainer>
    );
  }

  function highlightCode(text: any) {
  const codeRegex = /<code\s+language="([^"]+)">([\s\S]*?)<\/code>/g;

  // Busca todas as ocorrências das tags <code> usando matchAll
  const matches = [...text.matchAll(codeRegex)];

  // Cria um array de objetos contendo a linguagem e o código de cada trecho de código encontrado
  const codeBlocks = matches.map((match) => {
    const language = match[1];
    const code = match[2];
    return { language, code };
  });

  // Cria os elementos SyntaxHighlighter a partir do array de objetos
  return text.split(codeRegex).map((part: any, index: any) => {
    if (index % 2 === 1) {
      const i = Math.floor(index / 2);
      const codeBlock = codeBlocks[i];
      if (codeBlock) {
        const { language, code } = codeBlock;
        return <CodeBlock key={index} language={language} code={code} />;
      }
    }

    
    return <MyHtmlComponent htmlString={part} />;
  });
}
  

  export default ContentDataPage; 