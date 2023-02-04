import { readFile, writeFile } from 'fs/promises';

import rootname from '../../rootname';

const accountName = process.argv[2];

function getCondensedData(data) {
  return data.map(el => {
    return {
      name: el.screen_name,
      href: `https://nitter.lacontrevoie.fr/${el.screen_name}/with_replies`,
      rss: `https://nitter.lacontrevoie.fr/${el.screen_name}/with_replies/rss`,
      img: el.profile_image_url_https
    };
  });
}

async function main() {
  const json = await readFile(`${rootname}/data/${accountName}_followings.json`, 'utf8');
  const data = JSON.parse(json);
  const condensed = getCondensedData(data);
  const condensedJson = JSON.stringify(condensed);
  await writeFile(`${rootname}/data/${accountName}_data.json`, condensedJson);
  console.log('Write completed');
}

main();
