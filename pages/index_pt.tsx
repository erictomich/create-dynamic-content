import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { useState, FormEvent } from "react";


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [itemInput, setItemInput] = useState("");
  const [result, setResult] = useState();

  

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item: itemInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setItemInput("");
    } catch(error: any) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <>
      <Head>
        <title>OpenAI Quickstart</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Create a table of contents</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="item"
            placeholder="Enter an subject"
            value={itemInput}
            onChange={(e) => setItemInput(e.target.value)}
          />
          <input type="submit" value="Generate" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </>
  )
}
