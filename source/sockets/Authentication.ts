import type { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { authorization as config } from '../config.js';

/**
 * Socket.io logic for authenticating socket connections and placing them in respective rooms
 *
 * Assumption: Client will eventually authenticate themselves
 */

export function authenticateSocket (socket: Socket<ClientToServerEvents, ServerToClientEvents, any, SocketData>, token: string): string {
	const authData = jwt.verify(token, config.secret, { clockTimestamp: Date.now() / 1000 });
	if (typeof authData === 'string' || authData.sub === undefined) return 'Invalid Token';
	void socket.join(authData.sub); // Token valid, join the corresponding room. Voided because for some reason Socket.IO types are weird.
	socket.data.userId = authData.sub; // Bind the user identity to the socket data
	return 'Success';
}
