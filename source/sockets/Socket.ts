import { Server } from 'socket.io';
import { authenticateSocket } from './Authentication.js';
import { logger } from '../lib/Logger.js';

/**
 * Socket.IO socket for use in controllers
 */

export const io = new Server<ClientToServerEvents, ServerToClientEvents, any, SocketData>(); // There does not seem to be a better way to expose the socket.io server to controllers other than to export the server itself

io.on('connection', (socket) => {
	logger.log('A user connected to socket');
	socket.data.userId = null; // We do not know who this is yet.
	// Handle authentication event
	socket.on('authenticate', (token) => {
		const resp = authenticateSocket(socket, token);
		return resp;
	});
});
