<p align="center">
  <a href="" target="blank"><img src="./public/logo.svg" width="320" alt="Vechr Logo" /></a>
</p>

# Edit your `.env` file
```
APP_PORT=3000
JWT_SECRET=secretvechr
ECRYPTED_SECRET=usersecret
JWT_EXPIRES_IN=3d
NATS_URL=nats://nats-server:4222
DB_URL="postgresql://Vechr:123@postgres-db:5432/audit-db?schema=public&connect_timeout=300"
```

# Running Audit Service
```bash
yarn install
yarn prisma:sync
yarn db:migrate
yarn db:studio
yarn watch
```

# Build Image for Production
```bash
chmod +x ./docker/build.sh
./docker/build.sh
```