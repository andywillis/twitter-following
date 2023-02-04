import 'dotenv/config';

import { app, port, server } from './service/express';

import routes from './routes/index';

import data from '../data/data.json' assert { type: 'json' };

app.get('/endpoint', await routes.default(data));
app.get('*', routes.root());

server.listen(port, () => {
  console.log(`http server running on port ${port}`);
});
