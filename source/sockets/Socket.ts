import { Server } from 'socket.io';
import { authenticateSocket } from './Authentication.js';
import { logger } from '../lib/Logger.js';

export const io = new Server<ClientToServerEvents, ServerToClientEvents, any, SocketData>();

io.on('connection', (socket) => {
	logger.log('A user connected to socket');
	socket.data.userId = null; // We do not know who this is yet.
	socket.on('authenticate', (token) => {
		logger.log(token);
		const resp = authenticateSocket(socket, token);
		logger.log(resp);
		return resp;
	});
});
