import { Bid, Listing, type Log, Section, Subsection, User, Media, ListingLink } from './models/index.js';
import ts from 'typescript';
import { sequelize } from './sequelizeSetup.js';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
const sys = ts.sys;
export async function seedAll (): Promise<void> {
	// -------User and UserLog-------
	// ------------------------------
	const userBoi = await User.create({
		id: uuidv4(),
		username: 'xXx_boi_xXx',
		email: 'boi@boi.boi',
		password: await bcrypt.hash('boiboi', 12),
		access: 'boi'
	});
	const user2 = await User.create({
		id: uuidv4(),
		username: 'gurl',
		email: 'gurl@boi.boi',
		password: await bcrypt.hash('gurlgrul', 12),
		access: 'client'
	});
	await userBoi.$create('log', {
		id: uuidv4(),
		log: { action: 'GET' } satisfies Log
	});
	await user2.$create('log', {
		id: uuidv4(),
		log: { action: 'POST' } satisfies Log
	});
	await userBoi.$create('log', {
		id: uuidv4(),
		log: { action: 'PUT' } satisfies Log
	});
	await userBoi.$create('log', {
		id: uuidv4(),
		log: { action: 'DELETE' } satisfies Log
	});
	await userBoi.save();
	await user2.save();

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
	console.log(depo.toJSON());
	await depo.save();
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
		userId: user2.id
	});

	const motorlaivas: Subsection = (await depo.$get('subsections', { where: { name: 'motorlaivas' } }))[0];
	await Listing.create({
		id: uuidv4(),
		title: 'Big chonky boat motor',
		body: 'Selling big chonky motor :(( Get it for cheap (not)!!!! Brand.',
		start_price: 3126,
		status: 'available',
		subsectionId: motorlaivas.id,
		userId: userBoi.id
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

	const cat = await Media.create({
		uuid: '0e906ca0-d978-45c2-ad05-30bf16074e31',
		extension: '.jpg'
	});
	await ListingLink.create({
		image_number: 1,
		listingId: chainsaw.id,
		mediaUUID: cat.uuid
	});

	await sequelize.sync();
}

if (sys.args.includes('--seed')) {
	// clear all tables
	void sequelize.sync({ force: true }).then(() => {
		// seed
		void seedAll().then(async () => {
			// sync in case it isn't synced
			void sequelize.sync().then(() => { console.log('Done'); });
		});
	});
}
