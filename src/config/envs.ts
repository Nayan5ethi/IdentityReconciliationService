const environmentVariables = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  LOG_SQL: process.env.LOG_SQL,
  PORT: process.env.PORT ?? 8057,
  DATABASE_URL: process.env.DATABASE_URL,
};

export default environmentVariables;
