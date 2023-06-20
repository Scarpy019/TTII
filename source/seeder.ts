import { Bid, Listing, type Log, Section, Subsection, User, Media, UserAccess } from './models/index.js';
import ts from 'typescript';
import { sequelize } from './sequelizeSetup.js';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { logger } from './lib/Logger.js';
const sys = ts.sys;
export async function seedAll (): Promise<void> {
	// -------User and UserLog-------
	// ------------------------------
	const clientAccess = await UserAccess.create({
		access: 'client',
		client_access: true,
		hide_posts: false,
		timeout_user: false,
		category_admin: false,
		ban_user: false
	});
	await clientAccess.save();
	const moderatorAccess = await UserAccess.create({
		access: 'moderator',
		client_access: true,
		hide_posts: true,
		timeout_user: true,
		category_admin: false,
		ban_user: false
	});
	await moderatorAccess.save();
	const adminAccess = await UserAccess.create({
		access: 'admin',
		client_access: true,
		hide_posts: true,
		timeout_user: true,
		category_admin: true,
		ban_user: true
	});
	await adminAccess.save();
	const userBoi = await User.create({
		id: uuidv4(),
		username: 'xXx_boi_xXx',
		email: 'boi@boi.boi',
		password: await bcrypt.hash('boiboi', 12),
		access: 'client'
	});
	const user2 = await User.create({
		id: uuidv4(),
		username: 'gurl',
		email: 'gurl@boi.boi',
		password: await bcrypt.hash('gurlgrul', 12),
		access: 'client'
	});
	const user3 = await User.create({
		id: uuidv4(),
		username: 'administrators',
		email: 'admin@admin.user',
		password: await bcrypt.hash('neuzlauzisietmani', 12),
		access: 'admin'
	});
	const user4 = await User.create({
		id: uuidv4(),
		username: 'Delfi-komentetajs',
		email: 'delfi@delfi.lv',
		password: await bcrypt.hash('nelauzams', 12),
		access: 'client'
	});
	await userBoi.$create('log', {
		id: uuidv4(),
		log: { action: 'GET', path: '/' } satisfies Log
	});
	await user2.$create('log', {
		id: uuidv4(),
		log: { action: 'POST', path: '/' } satisfies Log
	});
	await userBoi.$create('log', {
		id: uuidv4(),
		log: { action: 'PUT', path: '/' } satisfies Log
	});
	await userBoi.$create('log', {
		id: uuidv4(),
		log: { action: 'DELETE', path: '/' } satisfies Log
	});
	await userBoi.save();
	await user2.save();
	await user3.save();
	await user4.save();

	// -----Section and Subsection-------
	// ----------------------------------
	const depo: Section = await Section.create(
		{
			name: 'Depo and things'
		}, { include: Subsection });
	await depo.$create('subsection', {
		name: 'motorzagi'
	});
	await depo.$create('subsection', {
		name: 'motorlaivas'
	});
	await depo.$create('subsection', {
		name: 'motormotori'
	});
	logger.log(depo);
	await depo.save();

	const majlopi: Section = await Section.create(
		{
			name: 'Mājlopi un ferma'
		}, { include: Subsection });
	await majlopi.$create('subsection', {
		name: 'Mājlopi'
	});
	await majlopi.$create('subsection', {
		name: 'Graudi'
	});
	await majlopi.$create('subsection', {
		name: 'Eksotiskie dzīvnieki'
	});
	await majlopi.$create('subsection', {
		name: 'Sēklas'
	});
	await majlopi.$create('subsection', {
		name: 'Traktori'
	});
	logger.log(majlopi);
	await majlopi.save();

	const transport: Section = await Section.create(
		{
			name: 'Transports un mēs'
		}, { include: Subsection });
	await transport.$create('subsection', {
		name: 'Autovāģi'
	});
	await transport.$create('subsection', {
		name: 'Minamie ar kājām'
	});
	await transport.$create('subsection', {
		name: 'Ritenīš transports'
	});
	await transport.$create('subsection', {
		name: 'Publiskais transports'
	});
	await transport.$create('subsection', {
		name: 'Lidmašīnas'
	});
	logger.log(transport);
	await transport.save();

	const darbs: Section = await Section.create(
		{
			name: 'Darba iespējas'
		}, { include: Subsection });
	await darbs.$create('subsection', {
		name: 'Pilntermiņa darbs'
	});
	await darbs.$create('subsection', {
		name: 'Algots darbs'
	});
	await darbs.$create('subsection', {
		name: 'Puslaika darbs'
	});
	await darbs.$create('subsection', {
		name: 'Profesionālais darbs'
	});
	logger.log(darbs);
	await darbs.save();

	const atdosana: Section = await Section.create(
		{
			name: 'Nevajadzīgās mantas'
		}, { include: Subsection });
	await atdosana.$create('subsection', {
		name: 'Nevajadzīgās & ziedojamās mantas'
	});
	logger.log(atdosana);
	await atdosana.save();
	// await sequelize.sync();

	// ----------Listings---------------
	// ---------------------------------
	const motorzagi: Subsection = (await depo.$get('subsections', { where: { name: 'motorzagi' } }))[0];
	const chainsaw = await Listing.create({
		id: uuidv4(),
		title: 'Big chonky chainsaw',
		body: 'Selling big chonky chainsaw :)) Get it for cheap!!!! Brand old',
		start_price: 2000,
		status: 'open',
		subsectionId: motorzagi.id,
		userId: user2.id,
		is_draft: false
	});

	const motorlaivas: Subsection = (await depo.$get('subsections', { where: { name: 'motorlaivas' } }))[0];
	await Listing.create({
		id: uuidv4(),
		title: 'Big chonky boat motor',
		body: 'Selling big chonky motor :(( Get it for cheap (not)!!!! Brand.',
		start_price: 3126,
		status: 'available',
		subsectionId: motorlaivas.id,
		userId: userBoi.id,
		is_draft: false
	});

	// ---------Bids--------------
	// ---------------------------

	const user = (await User.findOne({ where: { username: 'xXx_boi_xXx' } }));
	if (user == null) return;

	await Bid.create({
		bid_amount: 420,
		listingId: chainsaw.id,
		userId: user.id
	});

	// -------Media----------
	// ----------------------

	await Media.create({
		uuid: '0e906ca0-d978-45c2-ad05-30bf16074e31',
		extension: '.jpg',
		listingId: chainsaw.id
	});

	await sequelize.sync();
}

if (sys.args.includes('--seed')) {
	// clear all tables
	void sequelize.sync({ force: true }).then(() => {
		// seed
		void seedAll().then(async () => {
			// sync in case it isn't synced
			void sequelize.sync().then(() => { logger.info('Done'); });
		});
	});
}
