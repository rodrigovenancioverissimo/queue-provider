const settings = {
  environment: process.env.NODE_ENV || 'development',
  aws: {
    endpoint: process.env.AWS_ENDPOINT || 'http://localstack:4566',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'accessKeyId',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'secretAccessKey',
    },
    region: process.env.AWS_REGION || 'us-east-1',
    accountId: process.env.AWS_ACCOUNT_ID || 'accountId',
  },
};

export default settings;
