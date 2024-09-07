const rooms: { [key: string]: string[] } = {};

const server = Bun.serve<{ name: string; room: string }>({
  fetch(req, server) {
    const room = req.url.split('/').at(-1)?.split('?')[0];
    // const room = new URL(req.url).searchParams.get('room');
    const name = new URL(req.url).searchParams.get('name');
    if (!room) return new Response('Specify a room', { status: 500 });
    if (!name) return new Response('Specify a name', { status: 500 });
    const success = server.upgrade(req, {
      data: { room, name },
    });
    if (success) return undefined;

    return new Response('Upgrade failed', { status: 500 });
  },
  websocket: {
    publishToSelf: false,
    open(ws) {
      // console.log(ws);
      const { room, name } = ws.data;

      let msg = '';
      if (rooms[room] && rooms[room].length === 2) {
        ws.close(4000, `Room '${room}' is full.`);
      }
      if (rooms[room] && rooms[room].length === 1) {
        rooms[room].push(name);
        msg = `1-${room}-${rooms[room][0]}-${rooms[room][1]}`;
      }
      if (!rooms[room] || rooms[room].length === 0) {
        rooms[room] = [name];
        msg = `0-${room}-${rooms[room][0]}`;
      }

      ws.subscribe(room);
      server.publish(room, msg);
    },
    message(ws, message) {
      const { room } = ws.data;
      // the server re-broadcasts incoming messages to everyone
      server.publish(room, message);
    },
    close(ws) {
      const { room, name } = ws.data;
      // rooms[room] = rooms[room].filter((n) => n !== name);
      rooms[room] = [];
      const msg = '9-' + name + ' has left the chat.';
      server.publish(room, msg);
      ws.unsubscribe(room);
    },
  },
});

console.log(`Listening on ${server.hostname}:${server.port}`);
