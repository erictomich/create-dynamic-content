import type {
  NextPage,
  GetServerSideProps
} from "next";

import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'




const SlugPage: NextPage = (props: any) => {
  const router = useRouter()
 
  const { slug } = router.query;

  const [dados, setDados] = useState(['inicio'])

  console.log("slug", slug);

  var file = slug;

  useEffect(() => {
    const intervalo = setInterval(() => {
      if(file === undefined) clearInterval(intervalo);

      fetch('/api/generateTexts_pt?file='+file)
        .then(res => res.json())
        .then(res => {
          // Trata as informações retornadas da API
          setDados(dadosAntigos => [...dadosAntigos, res.title])
          if (res.status === 'fim') {
            clearInterval(intervalo)
          }
        })
        .catch(err => {
          console.error(err)
          setDados(dadosAntigos => [...dadosAntigos, "fim"])
          clearInterval(intervalo)
        })
    }, 10000) // Intervalo em milissegundos entre cada chamada

    return () => clearInterval(intervalo)
  }, [])

  return (
    // Renderiza as informações tratadas da API
    <ul>
      {dados.map((dado, index) => (
        <li key={index}>{dado}</li>
      ))}
    </ul>
  )
}

  export const getServerSideProps: GetServerSideProps = async (context) => {
    const { slug } = context.query;
  
    console.log(slug);

    return {
      props: { slug },
    };
  };

export default SlugPage;