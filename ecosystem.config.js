module.exports = {
  apps : [{
    name: 'marschan',
    script: 'index.js',

    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    'exec_mode': 'fork',
    env: {
      MODE: 1,
      VERSION: 'Superior'
    }
  }]
};
