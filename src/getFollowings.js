/* eslint-disable key-spacing */
import fs from 'fs';
import getTwitterFollowings from 'get-twitter-followings';

import rootname from '../../rootname';

const tokens = {
  consumer_key:         'HdqJYC0OGegfjv5TfpVXKGNOT',
  consumer_secret:      '6Ljn8kx2oKUIpt6ksopNUGoPH8WRsofSSLdVPgPE8yftTRSgr9',
  access_token:         '545502855-1km3Jq9FPeKyhFtxuBr9cTIPgz28ri7B9oe7iScH',
  access_token_secret:  'HbSyj06d7atoYBftIj7yFKFJyGqhgedoOqeXRVSui6dNn',
};

const accountname = process.argv[2];

const followings = await getTwitterFollowings(tokens, accountname);
const data = JSON.stringify(followings, null, 2);
fs.writeFileSync(`${rootname}/data/${accountname}_followings.json`, data);
console.log('Data written');
