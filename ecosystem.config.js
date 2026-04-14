// PM2 ecosystem config for production
export default {
  apps: [
    {
      name: 'kargic-admin',
      script: './server.js',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      max_memory_restart: '500M',
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      watch: false, // Set to true to restart on file changes during development
      ignore_watch: ['node_modules', 'dist', 'logs'],
      max_restarts: 10,
      min_uptime: '10s',
      listen_timeout: 3000,
    },
  ],
};
