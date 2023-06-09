import * as env from 'env-var';

import dotenv = require('dotenv');
dotenv.config();

export default Object.freeze({
  APP_PORT: env.get('APP_PORT').default(3000).asInt(),
  NATS_URL: env.get('NATS_URL').required().asString(),
  JWT_SECRET: env.get('JWT_SECRET').required().asString(),
  ECRYPTED_SECRET: env.get('ECRYPTED_SECRET').required().asString(),
  JWT_EXPIRES_IN: env.get('JWT_EXPIRES_IN').default('3d').asString(),
  NATS_SERVICE: 'NATS_SERVICE',
  AUDIT_EVENT: {
    CREATED: 'audit.created',
    UPDATED: 'audit.updated',
    DELETED: 'audit.deleted',
  },
  NATS_CA: env.get('NATS_CA').required().asString(),
  NATS_KEY: env.get('NATS_KEY').required().asString(),
  NATS_CERT: env.get('NATS_CERT').required().asString(),
});
