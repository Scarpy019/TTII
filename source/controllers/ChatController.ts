import { Sequelize } from 'sequelize';
import { ChatMessage, MessageComponent, User } from '../models/index.js';
import { Controller } from './BaseController.js';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../lib/Logger.js';
import { headerConstants } from './config.js';

interface ChatMessageBody {
	messageId: string | null; // Null if ANNOUNCE, otherwise the messageid
	userId: string | null; // String if ANNOUNCE, otherwise null
	stage: 'ANNOUNCE' | 'KEY' | 'MESSAGE';
	content: string;
};

function isChatMessageBody (obj: any): obj is ChatMessageBody {
	const valid =
	// Verify that the stage is specified
	(('stage' in obj) && typeof obj.stage === 'string' && ['ANNOUNCE', 'KEY', 'MESSAGE'].includes(obj.stage)) &&
	// Verify that the message id is specified correctly
	(('messageId' in obj) &&
		// If ANNOUNCE, messageId should be null
		((obj.stage === 'ANNOUNCE' && obj.messageId === null) ||
		// If not ANNOUNCE, messageId should be string
		(obj.stage !== 'ANNOUNCE' && typeof obj.messageId === 'string'))) &&
	// Verify that the user id is specified correctly
	(('userId' in obj) &&
		// If ANNOUNCE, userId should be string
		((obj.stage === 'ANNOUNCE' && typeof obj.userId === 'string') ||
		// If not ANNOUNCE, userId should be null
		(obj.stage !== 'ANNOUNCE' && obj.userId === null))) &&
	// Verify that the request contains content field
	(('content' in obj) && typeof obj.content === 'string');
	return valid;
};

const chat = new Controller('chat');

chat.read = async (req, res) => {
	const user = res.locals.user;
	if (user === undefined || user === null) {
		res.sendStatus(403); // You should be signed in to access chat
		return;
	}
	const secondParty = req.query.userId;
	if (secondParty === undefined) {
		const messages = await ChatMessage.findAll({
			where: Sequelize.or({ senderId: user.id }, { receiverId: user.id })
		});
		const messageIds = messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()).map((msg) => msg.id);

		res.send(JSON.stringify(messageIds));
	} else {
		const messages = await ChatMessage.findAll({
			where: Sequelize.or({ senderId: user.id, receiverId: secondParty }, { senderId: secondParty, receiverId: user.id })
		});
		const messageIds = messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()).map((msg) => msg.id);

		res.send(JSON.stringify(messageIds)); // Send user all the messages they have received from that user
	}
};

chat.create = chat.handler(
	isChatMessageBody,
	async (req, res) => {
		// Verify that the request comes from someone who's actually logged in
		const user = res.locals.user;
		if (user === undefined || user === null) {
			res.sendStatus(403);
			return;
		}
		// If ANNOUNCE, that means we are making a new ChatMessage
		if (req.body.stage === 'ANNOUNCE') {
			// Quick content validation for ANNOUNCE
			if (req.body.content.split('|').length !== 2) {
				res.sendStatus(400);
				return;
			}
			const chatMessage = await ChatMessage.create({
				id: uuidv4(),
				senderId: user.id,
				receiverId: req.body.userId
			});
			await MessageComponent.create({
				id: uuidv4(),
				messageId: chatMessage.id,
				stage: 'ANNOUNCE',
				content: req.body.content
			});
			// TODO: Notify the recipient that a message has arrived via websocket or sth
			res.send(chatMessage.id); // ANNOUNCE successfully received, client can proceed with KEY
		} else {
			if (req.body.messageId === null) {
				// This exists mainly to shut up TypeScript, but might happen if isChatMessageBody breaks.
				logger.error(`MessageId undefined in chat message body despite message stage being ${req.body.stage}!`);
				res.sendStatus(500);
				return;
			}
			// Quick validation for the KEY stage, just in case someone attempts to send a malformed request that isn't an actual key part.
			if (req.body.stage === 'KEY') {
				if (req.body.content.split('|').length !== 2 || req.body.content.split('|')[0] !== user.id) {
					res.sendStatus(400);
					return;
				}
			}
			const chatMessage = await ChatMessage.findByPk(req.body.messageId);
			if (chatMessage === undefined || chatMessage === null) {
				res.sendStatus(400);
				return;
			}
			await MessageComponent.create({
				id: uuidv4(),
				messageId: chatMessage.id,
				stage: req.body.stage,
				content: req.body.content
			});
			res.sendStatus(200);
		}
	}
);

const message = chat.subcontroller('message', ['id']);

message.read = async (req, res) => {
	const user = res.locals.user;
	if (user === undefined || user === null) {
		res.sendStatus(403); // You should be signed in to access chat
		return;
	}
	const stage = req.query.stage;
	if (stage === null || typeof stage !== 'string' || !['ANNOUNCE', 'KEY', 'MESSAGE'].includes(stage)) {
		res.sendStatus(400);
		return;
	}
	const chatMessage = await ChatMessage.findByPk(req.params.id);
	if (chatMessage === undefined || chatMessage === null) {
		res.sendStatus(400);
		return;
	}
	if (chatMessage.senderId !== user.id && chatMessage.receiverId !== user.id) {
		res.sendStatus(403);
		return;
	}
	const stageMessages = await MessageComponent.findAll({
		where: {
			messageId: chatMessage.id,
			stage
		}
	});
	if (stage === 'ANNOUNCE' || stage === 'MESSAGE') {
		if (stageMessages.length === 0) {
			res.sendStatus(404); // Not found, hopefully the client will understand that it might appear later
		} else {
			res.send(stageMessages[0].content);
		}
	} else {
		if (stageMessages.length === 0) {
			res.sendStatus(404); // Not found, hopefully the client will understand that it might appear later
			return;
		}
		const otherKey = stageMessages.find(msg => !msg.content.includes(user.id)); // Find the key sent by the other user, if any
		if (otherKey === undefined) {
			res.sendStatus(404); // Not found, hopefully the client will understand that it might appear later
		} else {
			res.send(otherKey.content);
		}
	}
};

const conversation = chat.subcontroller('conversation', ['id']);

conversation.read = async (req, res) => {
	// Verify that the request comes from someone who's actually logged in
	const user = res.locals.user;
	if (user === undefined || user === null) {
		res.sendStatus(403);
		return;
	}
	const secondParty = req.params.id;
	const messages = await ChatMessage.findAll({
		where: Sequelize.or({ senderId: user.id, receiverId: secondParty }, { senderId: secondParty, receiverId: user.id })
	});
	const sortedMessages = messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
	const messageData: any[] = [];
	for (const msg of sortedMessages) {
		if (msg.senderId === null) continue;
		const user = await User.findByPk(msg.senderId);
		if (user === null) continue;
		const returnObj = { id: msg.id, author: user.username };
		messageData.push(returnObj);
	}
	res.render('pages/chat/view.ejs', { constants: headerConstants, userstatus_name: user.username, userstatus_page: `/user/profile/${user.id}`, messages: messageData, recipient: req.params.id });
};
