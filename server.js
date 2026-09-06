import express from 'express';
import http from 'node:http';
import { Server } from 'socket.io';
import { randomInt } from 'node:crypto';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;
const rooms = new Map();
const colors = ['#ff4757','#2ed573','#1e90ff','#ffa502','#a55eea','#00d2d3','#ff6b81','#eccc68'];
const games = ['Stoppa på 10.00','Quiz Battle','Färgfeed','Bomben','Mini-race','Copycat','Rött ljus / grönt ljus','Prickskytten','Chicken','Växla!','Hal is','Hajen kommer','Väggen','Kanonduell','Helikoptern','Radiobilsfotboll'];

app.use(express.static('public'));
app.get('/health', (_, res) => res.json({ ok: true, rooms: rooms.size }));

function code() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let value = '';
  do { value = Array.from({length: 5}, () => chars[randomInt(chars.length)]).join(''); } while (rooms.has(value));
  return value;
}
function publicRoom(room) {
  return { code: room.code, phase: room.phase, players: room.players.map(({id,...p}) => p), voteOptions: room.voteOptions };
}
function emitRoom(room) { io.to(room.code).emit('room:update', publicRoom(room)); }
function findPlayer(room, socketId) { return room.players.find(p => p.id === socketId); }

io.on('connection', socket => {
  socket.on('host:create', (_, reply = () => {}) => {
    const roomCode = code();
    const room = { code: roomCode, hostId: socket.id, phase: 'lobby', players: [], voteOptions: [], votes: new Map() };
    rooms.set(roomCode, room); socket.join(roomCode); socket.data.roomCode = roomCode; socket.data.role = 'host';
    reply({ ok: true, room: publicRoom(room) }); emitRoom(room);
  });

  socket.on('player:join', ({ roomCode, name }, reply = () => {}) => {
    const key = String(roomCode || '').trim().toUpperCase(); const room = rooms.get(key);
    if (!room) return reply({ ok:false, error:'Lobbyn finns inte.' });
    if (room.players.length >= 8) return reply({ ok:false, error:'Lobbyn är full.' });
    const cleanName = String(name || 'Spelare').trim().slice(0,18) || 'Spelare';
    const player = { id: socket.id, name: cleanName, color: colors[room.players.length], score: 0, voted: false };
    room.players.push(player); socket.join(key); socket.data.roomCode = key; socket.data.role = 'player';
    reply({ ok:true, player: { name:player.name, color:player.color }, room:publicRoom(room) }); emitRoom(room);
  });

  socket.on('host:startVote', (_, reply = () => {}) => {
    const room = rooms.get(socket.data.roomCode); if (!room || room.hostId !== socket.id) return;
    room.phase = 'voting'; room.votes.clear(); room.players.forEach(p => p.voted = false);
    room.voteOptions = [...games].sort(() => Math.random() - .5).slice(0,3);
    emitRoom(room); reply({ok:true});
  });

  socket.on('player:vote', ({ game }, reply = () => {}) => {
    const room = rooms.get(socket.data.roomCode); const player = room && findPlayer(room, socket.id);
    if (!room || !player || room.phase !== 'voting' || !room.voteOptions.includes(game)) return;
    room.votes.set(socket.id, game); player.voted = true; emitRoom(room); reply({ok:true});
    if (room.players.length && room.votes.size === room.players.length) {
      const counts = Object.fromEntries(room.voteOptions.map(g => [g,0])); for (const vote of room.votes.values()) counts[vote]++;
      const max = Math.max(...Object.values(counts)); const tied = room.voteOptions.filter(g => counts[g] === max);
      const winner = tied[randomInt(tied.length)]; room.phase = 'selected'; io.to(room.code).emit('vote:result', { winner, counts }); emitRoom(room);
    }
  });

  socket.on('disconnect', () => {
    const room = rooms.get(socket.data.roomCode); if (!room) return;
    if (room.hostId === socket.id) { io.to(room.code).emit('room:closed'); rooms.delete(room.code); return; }
    room.players = room.players.filter(p => p.id !== socket.id); room.votes.delete(socket.id); emitRoom(room);
  });
});

server.listen(PORT, '0.0.0.0', () => console.log(`Partybox running on :${PORT}`));
