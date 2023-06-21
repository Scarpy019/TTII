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
			name: 'Depo and things',
			nameLV: 'Depo un lietas'
		}, { include: Subsection });
	await depo.$create('subsection', {
		name: 'Chainsaws',
		nameLV: 'motorzagi'
	});
	await depo.$create('subsection', {
		name: 'Engine boats',
		nameLV: 'motorlaivas'
	});
	await depo.$create('subsection', {
		name: 'Engine engines',
		nameLV: 'motormotori'
	});
	logger.log(depo);
	await depo.save();

	const majlopi: Section = await Section.create(
		{
			name: 'Pets and farm',
			nameLV: 'Mājlopi un ferma'
		}, { include: Subsection });
	await majlopi.$create('subsection', {
		name: 'Livestock',
		nameLV: 'Mājlopi'
	});
	await majlopi.$create('subsection', {
		name: 'Grains',
		nameLV: 'Graudi'
	});
	await majlopi.$create('subsection', {
		name: 'Exotic animals',
		nameLV: 'Eksotiskie dzīvnieki'
	});
	await majlopi.$create('subsection', {
		name: 'Seeds',
		nameLV: 'Sēklas'
	});
	await majlopi.$create('subsection', {
		name: 'Tractors',
		nameLV: 'Traktori'
	});
	logger.log(majlopi);
	await majlopi.save();

	const transport: Section = await Section.create(
		{
			name: 'Transport and us',
			nameLV: 'Transports un mēs'
		}, { include: Subsection });
	await transport.$create('subsection', {
		name: 'Cars',
		nameLV: 'Autovāģi'
	});
	await transport.$create('subsection', {
		name: 'Pedal vehicles',
		nameLV: 'Minamie ar kājām'
	});
	await transport.$create('subsection', {
		name: 'Wheel using transport',
		nameLV: 'Ritenīš transports'
	});
	await transport.$create('subsection', {
		name: 'Public transport',
		nameLV: 'Publiskais transports'
	});
	await transport.$create('subsection', {
		name: 'Planes',
		nameLV: 'Lidmašīnas'
	});
	logger.log(transport);
	await transport.save();

	const darbs: Section = await Section.create(
		{
			name: 'Jobs n stuff',
			nameLV: 'Darba iespējas'
		}, { include: Subsection });
	await darbs.$create('subsection', {
		name: 'Full time work',
		nameLV: 'Pilntermiņa darbs'
	});
	await darbs.$create('subsection', {
		name: 'Contract work',
		nameLV: 'Algots darbs'
	});
	await darbs.$create('subsection', {
		name: 'Half time work',
		nameLV: 'Puslaika darbs'
	});
	await darbs.$create('subsection', {
		name: 'Professional job',
		nameLV: 'Profesionālais darbs'
	});
	logger.log(darbs);
	await darbs.save();

	const atdosana: Section = await Section.create(
		{
			name: 'No longer needed items',
			nameLV: 'Nevajadzīgās mantas'
		}, { include: Subsection });
	await atdosana.$create('subsection', {
		name: 'Unneeded or for donations items',
		nameLV: 'Nevajadzīgās & ziedojamās mantas'
	});
	logger.log(atdosana);
	await atdosana.save();
	// await sequelize.sync();

	// ----------Listings---------------
	// ---------------------------------
	const motorzagi: Subsection = (await depo.$get('subsections', { where: { nameLV: 'motorzagi' } }))[0];
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

	const motorlaivas: Subsection = (await depo.$get('subsections', { where: { nameLV: 'motorlaivas' } }))[0];
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
