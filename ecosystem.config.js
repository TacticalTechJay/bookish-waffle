module.exports = {
  apps : [{
    name: 'Beta-Bot',
    script: 'src',

    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    'exec_mode': 'fork',
    env: {
      DEVELOPMENT: true
    }
  }]
};
