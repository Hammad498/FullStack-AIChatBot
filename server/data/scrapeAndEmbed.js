import {DataAPIClient} from '@datastax/astra-db-ts';
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import puppeteer from 'puppeteer';
import { embeddingModel } from '../utils/embedUtils.js';
import db from '../config/astraClient.js';
import dotenv from "dotenv";
import os from 'os';
dotenv.config();


const {ASTRA_DB_COLLECTION,} = process.env;


const jobData = [
  'https://remoteok.com/remote-dev-jobs',
  // 'https://en.wikipedia.org/wiki/Formula_One',
  // 'https://www.skysports.com/f1',
  // 'https://www.forbes.com/sites/brettknight/2024/12/10/formula-1s-highest-paid-drivers-2024/',
  // 'https://www.formula1.com/en/latest/article.2024-f1-calendar-confirmed-with-23-races-including-saudi-arabia-and-qatar.6Zz86Zz8'
];

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100,
});

const createCollection=async(similarityMetric='cosine')=>{
    try {
        const collection=await db.listCollections();
        if(!collection.some((c)=>c.name===ASTRA_DB_COLLECTION)){
            await db.createCollection(ASTRA_DB_COLLECTION,{
                vector:{dimension:1536,metric:similarityMetric}
            });
            console.log("Collection created");
        }else{
            console.log("Already existed!")
        };

    } catch (error) {
        console.log("Error while creating collection!");
    }
};



const scrapePage = async (url) => {
  console.log(`---> Scraping ${url}...`);
  
  const loader = new PuppeteerWebBaseLoader(url, {
    puppeteer,
    launchOptions: { 
      headless: "new", 
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
        `--user-data-dir=${os.tmpdir()}/puppeteer_profile`
      ],
      timeout: 120000, 
    },
    gotoOptions: { waitUntil: 'domcontentloaded', timeout: 120000 },
    evaluate: async (page) => {
      await new Promise(resolve => setTimeout(resolve, 5000));
      return await page.evaluate(() => document.body.innerText);
    },
  });

  try {
    const content = (await loader.scrape())?.trim() ?? '';
    console.log(`Scraped ${content.length} characters from ${url}`);
    return content;
  } catch (error) {
    console.error(` Error scraping ${url}: ${error.message}`);
    return '';
  }
};

const loadSampleData = async () => {
  const collection = await db.collection(ASTRA_DB_COLLECTION);
  
  for (const url of jobData ) {
    console.log(` Processing ${url}...`);
    
    try {
      const content = await scrapePage(url);
      if (!content || content.length < 50) continue;

      const chunks = await splitter.splitText(content);
      if (chunks.length === 0) continue;

      console.log(` Extracted ${chunks.length} chunks from ${url}`);

      for (const chunk of chunks) {
        try {
          const embedding = await embeddingModel.embedQuery(chunk);
          await collection.insertOne({
            vector: embedding, 
            text: chunk,
            source: url
          });
        } catch (error) {
          console.error(` Error inserting chunk: ${error.message}`);
        }
      }
    } catch (error) {
      console.error(` Error processing ${url}: ${error.message}`);
    }
  }
  console.log(" All data processed and stored successfully!");
};

const main = async () => {
  try {
    await createCollection();
    await loadSampleData();
    console.log(" Process completed successfully!");
  } catch (error) {
    console.error(" Error in main process:", error);
  }

};


main();