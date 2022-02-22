module.exports = {
  apps: [
    {
      name: 'aora-base-app',
      script: 'dist/main.js',
      exec_mode: 'cluster',
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
