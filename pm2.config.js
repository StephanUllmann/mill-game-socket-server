export default {
  apps: [
    {
      name: 'mill socket',
      script: '/var/www/mill-game-socket-server/dist/index.js',
      interpreter: 'bun',
      env: {
        PATH: `${process.env.HOME}/.bun/bin:${process.env.PATH}`,
      },
    },
  ],
};
