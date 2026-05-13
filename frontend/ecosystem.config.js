module.exports = {
  apps: [
    {
      name: "kickcraft-frontend",
      script: "node_modules/.bin/next",
      args: "start -p 5005",
      env: {
        NODE_ENV: "production",
      },
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
    },
  ],
};
