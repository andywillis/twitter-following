import { readFile, writeFile } from 'fs/promises';
import { XMLParser } from 'fast-xml-parser';

import rootname from '../../rootname';

import store from '../store';

const { dispatch, getState } = store;

const accountName = process.argv[2];

const parser = new XMLParser();

function sortByDate(arr) {
  return arr.sort((a, b) => {
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  });
}

async function processData(data) {
  if (data.length) {
    const [ head, ...tail ] = data;
    console.log(`Processing ${head.name}`);
    try {
      const res = await fetch(head.rss);
      if (res.ok) {
        const xml = await res.text();
        const obj = parser.parse(xml);
        if (obj?.rss?.channel?.item) {
          const payload = obj.rss.channel.item.map(item => {
            const { description: body, pubDate, 'dc:creator': author, link } = item;
            const timestamp = new Date(pubDate);
            return { author, timestamp, body, link };
          });
          dispatch({ type: 'mergeTweets', payload });
        } else {
          console.log(`No data found for ${head.name}`);
        }
      }
      setTimeout(() => processData(tail), 400);
    } catch (err) {
      console.error(err);
    }
  } else {
    console.log('Processing complete.');
    const { tweets } = getState();
    console.dir(tweets, { depth: null });
    const sorted = sortByDate(tweets);
    console.dir(sorted, { depth: null });
    dispatch({ type: 'replaceTweets', payload: sorted });
    await writeFile(`${rootname}/data/${accountName}_sorted.json`, JSON.stringify(sorted));
    console.log('File saved');
  }
}

async function main() {
  const json = await readFile(`${rootname}/data/${accountName}_data.json`, 'utf8');
  const data = JSON.parse(json);
  processData(data);
}

main();
