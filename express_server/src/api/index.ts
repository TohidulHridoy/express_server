import serverless from 'serverless-http';
import app from '../app';

const handler = serverless(app) as unknown;

export default handler;
module.exports = handler;
