export default {
  apps: [
    {
      name: 'mill socket',
      script: 'dist/index.js',
      cwd: '/var/www/mill-game-socket-server/',
      interpreter: 'bun',
      env: {
        PATH: `${process.env.HOME}/.bun/bin:${process.env.PATH}`,
      },
    },
  ],
};
