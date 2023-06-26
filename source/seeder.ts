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
	await userBoi.$create('log', {
		id: uuidv4(),
		log: { action: 'GET', path: '/' } satisfies Log
	});
	await userBoi.$create('log', {
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
	const user2 = await User.create({
		id: uuidv4(),
		username: 'gurl',
		email: 'gurl@boi.boi',
		password: await bcrypt.hash('gurlgrul', 12),
		access: 'client'
	});
	await user2.$create('log', {
		id: uuidv4(),
		log: { action: 'GET', path: '/' } satisfies Log
	});
	await user2.$create('log', {
		id: uuidv4(),
		log: { action: 'POST', path: '/' } satisfies Log
	});
	await user2.$create('log', {
		id: uuidv4(),
		log: { action: 'PUT', path: '/' } satisfies Log
	});
	await user2.$create('log', {
		id: uuidv4(),
		log: { action: 'DELETE', path: '/' } satisfies Log
	});
	await user2.save();
	const user3 = await User.create({
		id: uuidv4(),
		username: 'administrators',
		email: 'admin@admin.user',
		password: await bcrypt.hash('neuzlauzisietmani', 12),
		access: 'admin'
	});
	await user3.$create('log', {
		id: uuidv4(),
		log: { action: 'GET', path: '/' } satisfies Log
	});
	await user3.$create('log', {
		id: uuidv4(),
		log: { action: 'POST', path: '/' } satisfies Log
	});
	await user3.$create('log', {
		id: uuidv4(),
		log: { action: 'PUT', path: '/' } satisfies Log
	});
	await user3.$create('log', {
		id: uuidv4(),
		log: { action: 'DELETE', path: '/' } satisfies Log
	});
	await user3.save();
	const user4 = await User.create({
		id: uuidv4(),
		username: 'Delfi-komentetajs',
		email: 'delfi@delfi.lv',
		password: await bcrypt.hash('nelauzams', 12),
		access: 'client'
	});
	await user4.$create('log', {
		id: uuidv4(),
		log: { action: 'GET', path: '/' } satisfies Log
	});
	await user4.$create('log', {
		id: uuidv4(),
		log: { action: 'POST', path: '/' } satisfies Log
	});
	await user4.$create('log', {
		id: uuidv4(),
		log: { action: 'PUT', path: '/' } satisfies Log
	});
	await user4.$create('log', {
		id: uuidv4(),
		log: { action: 'DELETE', path: '/' } satisfies Log
	});
	await user4.save();

	const user5 = await User.create({
		id: uuidv4(),
		username: 'EmmaBraveSoul23',
		email: 'EmmaBraveSoul23@hotmail.lv',
		password: await bcrypt.hash('mmmmmmmmmSecuritymmmmm', 12),
		access: 'client'
	});
	await user5.$create('log', {
		id: uuidv4(),
		log: { action: 'GET', path: '/' } satisfies Log
	});
	await user5.$create('log', {
		id: uuidv4(),
		log: { action: 'POST', path: '/' } satisfies Log
	});
	await user5.$create('log', {
		id: uuidv4(),
		log: { action: 'PUT', path: '/' } satisfies Log
	});
	await user5.$create('log', {
		id: uuidv4(),
		log: { action: 'DELETE', path: '/' } satisfies Log
	});
	await user5.save();
	const user6 = await User.create({
		id: uuidv4(),
		username: 'NoahGentleSpirit8',
		email: 'NoahGentleSpirit8@hotmail.lv',
		password: await bcrypt.hash('NoahGentleSpirit8', 12),
		access: 'client'
	});
	await user6.$create('log', {
		id: uuidv4(),
		log: { action: 'GET', path: '/' } satisfies Log
	});
	await user6.$create('log', {
		id: uuidv4(),
		log: { action: 'POST', path: '/' } satisfies Log
	});
	await user6.$create('log', {
		id: uuidv4(),
		log: { action: 'PUT', path: '/' } satisfies Log
	});
	await user6.$create('log', {
		id: uuidv4(),
		log: { action: 'DELETE', path: '/' } satisfies Log
	});
	await user6.save();
	const user7 = await User.create({
		id: uuidv4(),
		username: 'LiamDaringAdventurer57',
		email: 'LiamDar@inbox.lv',
		password: await bcrypt.hash('Liam12345678', 12),
		access: 'client'
	});
	await user7.$create('log', {
		id: uuidv4(),
		log: { action: 'GET', path: '/' } satisfies Log
	});
	await user7.$create('log', {
		id: uuidv4(),
		log: { action: 'POST', path: '/' } satisfies Log
	});
	await user7.$create('log', {
		id: uuidv4(),
		log: { action: 'PUT', path: '/' } satisfies Log
	});
	await user7.$create('log', {
		id: uuidv4(),
		log: { action: 'DELETE', path: '/' } satisfies Log
	});
	await user7.save();
	const user8 = await User.create({
		id: uuidv4(),
		username: 'BenjaminWiseExplorer81',
		email: 'benjamin.rich@gmail.com',
		password: await bcrypt.hash('RichestRich', 12),
		access: 'client'
	});
	await user8.$create('log', {
		id: uuidv4(),
		log: { action: 'GET', path: '/' } satisfies Log
	});
	await user8.$create('log', {
		id: uuidv4(),
		log: { action: 'POST', path: '/' } satisfies Log
	});
	await user8.$create('log', {
		id: uuidv4(),
		log: { action: 'PUT', path: '/' } satisfies Log
	});
	await user8.$create('log', {
		id: uuidv4(),
		log: { action: 'DELETE', path: '/' } satisfies Log
	});
	await user8.save();
	const user9 = await User.create({
		id: uuidv4(),
		username: 'EthanSilentWatcher99',
		email: 'ethanthewatcher@gmail.com',
		password: await bcrypt.hash('iamalwayswatching', 12),
		access: 'client'
	});
	await user9.$create('log', {
		id: uuidv4(),
		log: { action: 'GET', path: '/' } satisfies Log
	});
	await user9.$create('log', {
		id: uuidv4(),
		log: { action: 'POST', path: '/' } satisfies Log
	});
	await user9.$create('log', {
		id: uuidv4(),
		log: { action: 'PUT', path: '/' } satisfies Log
	});
	await user9.$create('log', {
		id: uuidv4(),
		log: { action: 'DELETE', path: '/' } satisfies Log
	});
	await user9.save();
	const user10 = await User.create({
		id: uuidv4(),
		username: 'NarvesenCienitajs',
		email: 'narveseeeens@gmail.com',
		password: await bcrypt.hash('narvitissss', 12),
		access: 'client'
	});
	await user10.$create('log', {
		id: uuidv4(),
		log: { action: 'GET', path: '/' } satisfies Log
	});
	await user10.$create('log', {
		id: uuidv4(),
		log: { action: 'POST', path: '/' } satisfies Log
	});
	await user10.$create('log', {
		id: uuidv4(),
		log: { action: 'PUT', path: '/' } satisfies Log
	});
	await user10.$create('log', {
		id: uuidv4(),
		log: { action: 'DELETE', path: '/' } satisfies Log
	});
	await user10.save();
	const user11 = await User.create({
		id: uuidv4(),
		username: 'DuracelSponsoretais',
		email: 'duracel@hotmail.com',
		password: await bcrypt.hash('ManGarsoDuracelBaterijasTasIrGarsigakasNoVisamBaterijam----', 12),
		access: 'client'
	});
	await user11.$create('log', {
		id: uuidv4(),
		log: { action: 'GET', path: '/' } satisfies Log
	});
	await user11.$create('log', {
		id: uuidv4(),
		log: { action: 'POST', path: '/' } satisfies Log
	});
	await user11.$create('log', {
		id: uuidv4(),
		log: { action: 'PUT', path: '/' } satisfies Log
	});
	await user11.$create('log', {
		id: uuidv4(),
		log: { action: 'DELETE', path: '/' } satisfies Log
	});
	await user11.save();
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

	// -------- Depo and things --------

	const motorzagi: Subsection = (await depo.$get('subsections', { where: { nameLV: 'motorzagi' } }))[0];
	const motorlaivas: Subsection = (await depo.$get('subsections', { where: { nameLV: 'motorlaivas' } }))[0];
	const motormotori: Subsection = (await depo.$get('subsections', { where: { nameLV: 'motormotori' } }))[0];

	const test1 = await Listing.create({
		id: uuidv4(),
		title: 'Big chonky boat motor',
		body: 'Selling big chonky motor :(( Get it for cheap (not)!!!! Brand.',
		start_price: 3126,
		status: 'open',
		subsectionId: motorlaivas.id,
		userId: userBoi.id,
		is_draft: false
	});

	await Listing.create({
		id: uuidv4(),
		title: 'Professional Chainsaw for Heavy-Duty Cutting',
		body: 'Selling a professional chainsaw suitable for heavy-duty cutting tasks. Perfect for loggers and professional arborists.',
		start_price: 500,
		status: 'open',
		subsectionId: motorzagi.id,
		userId: user2.id,
		is_draft: false
	});

	await Listing.create({
		id: uuidv4(),
		title: 'Compact Chainsaw for Home and Garden Use',
		body: 'Selling a compact and lightweight chainsaw ideal for home and garden use. Perfect for trimming trees and cutting firewood.',
		start_price: 150,
		status: 'open',
		subsectionId: motorzagi.id,
		userId: user3.id,
		is_draft: false
	});

	await Listing.create({
		id: uuidv4(),
		title: 'Speedy Motorboat with Sleek Design',
		body: 'Selling a speedy motorboat with a sleek and modern design. Perfect for water sports enthusiasts and thrill-seekers.',
		start_price: 10000,
		status: 'open',
		subsectionId: motorlaivas.id,
		userId: user4.id,
		is_draft: false
	});

	await Listing.create({
		id: uuidv4(),
		title: 'Reliable Fishing Boat with Outboard Engine',
		body: 'Selling a reliable fishing boat equipped with a powerful outboard engine. Ideal for passionate anglers and fishing enthusiasts.',
		start_price: 8000,
		status: 'open',
		subsectionId: motorlaivas.id,
		userId: user5.id,
		is_draft: false
	});

	await Listing.create({
		id: uuidv4(),
		title: 'High-Performance Engine for Industrial Applications',
		body: 'Selling a high-performance engine suitable for various industrial applications. Designed to deliver reliable power and efficiency.',
		start_price: 2000,
		status: 'open',
		subsectionId: motormotori.id,
		userId: user6.id,
		is_draft: false
	});

	await Listing.create({
		id: uuidv4(),
		title: 'Compact Engine for Small Machinery',
		body: 'Selling a compact engine perfect for powering small machinery and equipment. Ideal for compact construction projects and DIY enthusiasts.',
		start_price: 500,
		status: 'open',
		subsectionId: motormotori.id,
		userId: user7.id,
		is_draft: false
	});

	// -------- Majlopi n ferma --------

	const majlopii: Subsection = (await majlopi.$get('subsections', { where: { nameLV: 'Mājlopi' } }))[0];
	const grains: Subsection = (await majlopi.$get('subsections', { where: { nameLV: 'Graudi' } }))[0];
	const exoticAnimals: Subsection = (await majlopi.$get('subsections', { where: { nameLV: 'Eksotiskie dzīvnieki' } }))[0];
	const seeds: Subsection = (await majlopi.$get('subsections', { where: { nameLV: 'Sēklas' } }))[0];
	const tractors: Subsection = (await majlopi.$get('subsections', { where: { nameLV: 'Traktori' } }))[0];

	await Listing.create({
		id: uuidv4(),
		title: 'Healthy Dairy Cows for Sale',
		body: 'Selling healthy dairy cows bred for high milk production. Suitable for dairy farmers and milk processing facilities.',
		start_price: 1500,
		status: 'open',
		subsectionId: majlopii.id,
		userId: user8.id,
		is_draft: false
	});

	await Listing.create({
		id: uuidv4(),
		title: 'Pedigree Show Chickens',
		body: 'Selling pedigree show chickens with impressive bloodlines. Perfect for poultry enthusiasts and breeders.',
		start_price: 50,
		status: 'open',
		subsectionId: majlopii.id,
		userId: user9.id,
		is_draft: false
	});

	await Listing.create({
		id: uuidv4(),
		title: 'Organic Wheat Grain for Baking and Cooking',
		body: 'Selling high-quality organic wheat grain ideal for baking and cooking purposes. Enjoy the natural goodness of freshly ground wheat.',
		start_price: 2,
		status: 'open',
		subsectionId: grains.id,
		userId: user10.id,
		is_draft: false
	});

	await Listing.create({
		id: uuidv4(),
		title: 'Nutritious Barley Grain for Animal Feed',
		body: 'Selling nutritious barley grain suitable for animal feed. Ensure your livestock receives optimal nutrition with this high-quality feed.',
		start_price: 1.5,
		status: 'open',
		subsectionId: grains.id,
		userId: user11.id,
		is_draft: false
	});

	await Listing.create({
		id: uuidv4(),
		title: 'Colorful Macaw Parrot',
		body: 'Selling a stunning and colorful Macaw parrot. A great companion for bird lovers and those looking for a beautiful addition to their home.',
		start_price: 2000,
		status: 'open',
		subsectionId: exoticAnimals.id,
		userId: user2.id,
		is_draft: false
	});

	await Listing.create({
		id: uuidv4(),
		title: 'Exotic Reptiles Collection',
		body: 'Selling a collection of exotic reptiles including snakes, lizards, and turtles. Perfect for reptile enthusiasts and collectors.',
		start_price: 500,
		status: 'open',
		subsectionId: exoticAnimals.id,
		userId: user3.id,
		is_draft: false
	});

	await Listing.create({
		id: uuidv4(),
		title: 'Organic Vegetable Seeds Pack',
		body: 'Selling a pack of organic vegetable seeds containing a variety of nutritious and flavorful vegetables. Start your own organic garden today.',
		start_price: 10,
		status: 'open',
		subsectionId: seeds.id,
		userId: user4.id,
		is_draft: false
	});

	await Listing.create({
		id: uuidv4(),
		title: 'Rare Flower Seeds Collection',
		body: 'Selling a collection of rare flower seeds that will add beauty and uniqueness to any garden. Perfect for gardening enthusiasts and florists.',
		start_price: 15,
		status: 'open',
		subsectionId: seeds.id,
		userId: user5.id,
		is_draft: false
	});

	await Listing.create({
		id: uuidv4(),
		title: 'Heavy-Duty Tractor with Front Loader',
		body: 'Selling a heavy-duty tractor equipped with a front loader. Perfect for agricultural and construction tasks requiring robust power and versatility.',
		start_price: 25000,
		status: 'open',
		subsectionId: tractors.id,
		userId: user6.id,
		is_draft: false
	});

	await Listing.create({
		id: uuidv4(),
		title: 'Compact Tractor for Small-Scale Farming',
		body: 'Selling a compact tractor ideal for small-scale farming and landscaping. Enjoy the convenience and efficiency of this versatile machine.',
		start_price: 15000,
		status: 'open',
		subsectionId: tractors.id,
		userId: user7.id,
		is_draft: false
	});

	// -------- Transports --------
	const cars: Subsection = (await transport.$get('subsections', { where: { nameLV: 'Autovāģi' } }))[0];
	const pedalVehicles: Subsection = (await transport.$get('subsections', { where: { nameLV: 'Minamie ar kājām' } }))[0];
	const wheelTransport: Subsection = (await transport.$get('subsections', { where: { nameLV: 'Ritenīš transports' } }))[0];
	const publicTransport: Subsection = (await transport.$get('subsections', { where: { nameLV: 'Publiskais transports' } }))[0];
	const planes: Subsection = (await transport.$get('subsections', { where: { nameLV: 'Lidmašīnas' } }))[0];

	await Listing.create({
		id: uuidv4(),
		title: 'Luxury Sedan with Premium Features',
		body: 'Selling a luxurious sedan with premium features and top-notch performance. Experience comfort and elegance on the road.',
		start_price: 50000,
		status: 'open',
		subsectionId: cars.id,
		userId: user8.id,
		is_draft: false
	});

	await Listing.create({
		id: uuidv4(),
		title: 'Compact Electric Car for Eco-Friendly Commuting',
		body: 'Selling a compact electric car perfect for eco-friendly commuting. Save money on fuel and reduce your carbon footprint with this efficient vehicle.',
		start_price: 30000,
		status: 'open',
		subsectionId: cars.id,
		userId: user9.id,
		is_draft: false
	});

	await Listing.create({
		id: uuidv4(),
		title: 'Pedal-Powered Go-Kart for Kids',
		body: 'Selling a pedal-powered go-kart designed for kids. Provide hours of outdoor fun and excitement with this safe and entertaining vehicle.',
		start_price: 100,
		status: 'open',
		subsectionId: pedalVehicles.id,
		userId: user10.id,
		is_draft: false
	});

	await Listing.create({
		id: uuidv4(),
		title: 'Adult Pedal Tricycle for Fitness and Recreation',
		body: 'Selling an adult pedal tricycle suitable for fitness and recreation purposes. Enjoy outdoor rides while getting exercise and fresh air.',
		start_price: 300,
		status: 'open',
		subsectionId: pedalVehicles.id,
		userId: user11.id,
		is_draft: false
	});

	await Listing.create({
		id: uuidv4(),
		title: 'Mountain Bike for Off-Road Adventures',
		body: 'Selling a high-performance mountain bike built for off-road adventures. Conquer challenging trails and enjoy the thrill of mountain biking.',
		start_price: 800,
		status: 'open',
		subsectionId: wheelTransport.id,
		userId: user2.id,
		is_draft: false
	});

	await Listing.create({
		id: uuidv4(),
		title: 'City Commuter Bike for Urban Mobility',
		body: 'Selling a stylish and practical city commuter bike perfect for urban mobility. Beat the traffic and enjoy a convenient and eco-friendly way of commuting.',
		start_price: 500,
		status: 'open',
		subsectionId: wheelTransport.id,
		userId: user3.id,
		is_draft: false
	});

	await Listing.create({
		id: uuidv4(),
		title: 'City Bus for Public Transportation Services',
		body: 'Selling a well-maintained city bus suitable for public transportation services. Provide reliable and comfortable rides to commuters in your city.',
		start_price: 50000,
		status: 'open',
		subsectionId: publicTransport.id,
		userId: user4.id,
		is_draft: false
	});

	await Listing.create({
		id: uuidv4(),
		title: 'Vintage Tram Car for Tourist Attractions',
		body: 'Selling a vintage tram car perfect for tourist attractions and historical tours. Take your visitors on a nostalgic ride through the city.',
		start_price: 100000,
		status: 'open',
		subsectionId: publicTransport.id,
		userId: user5.id,
		is_draft: false
	});

	await Listing.create({
		id: uuidv4(),
		title: 'Private Jet for Luxury Air Travel',
		body: 'Selling a private jet offering luxury air travel for business or personal use. Experience convenience, comfort, and unparalleled style in the sky.',
		start_price: 2000000,
		status: 'open',
		subsectionId: planes.id,
		userId: user4.id,
		is_draft: false
	});

	await Listing.create({
		id: uuidv4(),
		title: 'Single-Engine Aircraft for Recreational Flying',
		body: 'Selling a single-engine aircraft perfect for recreational flying and flight training. Take to the skies and fulfill your dreams of becoming a pilot.',
		start_price: 100000,
		status: 'open',
		subsectionId: planes.id,
		userId: user5.id,
		is_draft: false
	});

	// -------- Darba piedavajumi --------
	const fullTimeWork: Subsection = (await darbs.$get('subsections', { where: { nameLV: 'Pilntermiņa darbs' } }))[0];
	const contractWork: Subsection = (await darbs.$get('subsections', { where: { nameLV: 'Algots darbs' } }))[0];
	const halfTimeWork: Subsection = (await darbs.$get('subsections', { where: { nameLV: 'Puslaika darbs' } }))[0];
	const professionalJob: Subsection = (await darbs.$get('subsections', { where: { nameLV: 'Profesionālais darbs' } }))[0];

	await Listing.create({
		id: uuidv4(),
		title: 'Full-Time Graphic Designer',
		body: 'We are hiring a full-time graphic designer to join our creative team. Must have strong skills in Adobe Creative Suite.',
		start_price: 0,
		status: 'open',
		subsectionId: fullTimeWork.id,
		userId: user2.id,
		is_draft: false
	});
	await Listing.create({
		id: uuidv4(),
		title: 'Senior Software Engineer',
		body: 'We are seeking a skilled senior software engineer to join our development team. Strong expertise in JavaScript and Node.js required.',
		start_price: 0,
		status: 'open',
		subsectionId: fullTimeWork.id,
		userId: user8.id,
		is_draft: false
	});

	await Listing.create({
		id: uuidv4(),
		title: 'Marketing Coordinator',
		body: 'Looking for a marketing coordinator to assist in the planning and execution of marketing campaigns. Previous experience in digital marketing preferred.',
		start_price: 0,
		status: 'open',
		subsectionId: fullTimeWork.id,
		userId: user9.id,
		is_draft: false
	});

	await Listing.create({
		id: uuidv4(),
		title: 'Contract Web Developer',
		body: 'Looking for a skilled web developer to work on a contract basis. Must have experience with HTML, CSS, and JavaScript.',
		start_price: 0,
		status: 'open',
		subsectionId: contractWork.id,
		userId: user3.id,
		is_draft: false
	});
	await Listing.create({
		id: uuidv4(),
		title: 'Freelance Graphic Designer',
		body: 'Seeking a talented freelance graphic designer for various design projects. Proficiency in Adobe Creative Suite is a must.',
		start_price: 0,
		status: 'open',
		subsectionId: contractWork.id,
		userId: user10.id,
		is_draft: false
	});

	await Listing.create({
		id: uuidv4(),
		title: 'Contract Content Writer',
		body: 'We are hiring a contract content writer to create engaging and informative articles. Strong writing and research skills required.',
		start_price: 0,
		status: 'open',
		subsectionId: contractWork.id,
		userId: user11.id,
		is_draft: false
	});

	await Listing.create({
		id: uuidv4(),
		title: 'Part-Time Administrative Assistant',
		body: 'We are seeking a part-time administrative assistant to support our office operations. Strong organizational skills required.',
		start_price: 0,
		status: 'open',
		subsectionId: halfTimeWork.id,
		userId: user4.id,
		is_draft: false
	});
	await Listing.create({
		id: uuidv4(),
		title: 'Customer Service Representative',
		body: 'Join our team as a customer service representative, providing support and assistance to our valued customers. Excellent communication skills required.',
		start_price: 0,
		status: 'open',
		subsectionId: halfTimeWork.id,
		userId: user2.id,
		is_draft: false
	});

	await Listing.create({
		id: uuidv4(),
		title: 'Social Media Assistant',
		body: 'We are seeking a part-time social media assistant to help manage our social media accounts. Familiarity with major social media platforms is essential.',
		start_price: 0,
		status: 'open',
		subsectionId: halfTimeWork.id,
		userId: user2.id,
		is_draft: false
	});

	await Listing.create({
		id: uuidv4(),
		title: 'Professional Marketing Manager',
		body: 'Join our team as a professional marketing manager and drive our brand strategy. Minimum 5 years of experience required.',
		start_price: 0,
		status: 'open',
		subsectionId: professionalJob.id,
		userId: user5.id,
		is_draft: false
	});
	await Listing.create({
		id: uuidv4(),
		title: 'Senior Financial Analyst',
		body: 'We are hiring a senior financial analyst to support our financial planning and analysis. Strong analytical and problem-solving skills required.',
		start_price: 0,
		status: 'open',
		subsectionId: professionalJob.id,
		userId: user4.id,
		is_draft: false
	});

	await Listing.create({
		id: uuidv4(),
		title: 'Human Resources Manager',
		body: 'Join our team as a human resources manager and oversee all HR activities. Minimum 7 years of HR management experience required.',
		start_price: 0,
		status: 'open',
		subsectionId: professionalJob.id,
		userId: userBoi.id,
		is_draft: false
	});
	// -------- Ziedojamas mantas --------

	const unneededItems: Subsection = (await atdosana.$get('subsections', { where: { nameLV: 'Nevajadzīgās & ziedojamās mantas' } }))[0];
	await Listing.create({
		id: uuidv4(),
		title: 'Gently Used Sofa',
		body: 'Giving away a gently used sofa in excellent condition. Neutral color, comfortable seating.',
		start_price: 0,
		status: 'open',
		subsectionId: unneededItems.id,
		userId: user6.id,
		is_draft: false
	});

	await Listing.create({
		id: uuidv4(),
		title: 'Donation: Children\'s Clothing',
		body: 'Offering a donation of children\'s clothing in various sizes. Good condition, suitable for boys and girls.',
		start_price: 0,
		status: 'open',
		subsectionId: unneededItems.id,
		userId: user7.id,
		is_draft: false
	});
	// ---------Bids--------------
	// ---------------------------

	const user = (await User.findOne({ where: { username: 'xXx_boi_xXx' } }));
	if (user == null) return;

	await Bid.create({
		bid_amount: 420,
		listingId: test1.id,
		userId: user.id
	});

	// -------Media----------
	// ----------------------

	await Media.create({
		uuid: '0e906ca0-d978-45c2-ad05-30bf16074e31',
		orderNumber: 1,
		extension: '.jpg',
		listingId: test1.id
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
