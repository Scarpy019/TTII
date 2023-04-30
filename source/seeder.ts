import { CreateOptions, Optional } from "sequelize";
import { Bid, Listing, Log, Section, Subsection, User, UserLog } from "./models";
import { sys } from "typescript";
import { sequelize } from "./sequelizeSetup";
import {v4 as uuidv4} from 'uuid';
import { BidInput } from "./models/Bid";

export async function seedAll(){
    // -------User and UserLog-------
    // ------------------------------
    let user_boi = await User.create({
        id: uuidv4(),
        username:"xXx_boi_xXx",
        email:"boi@boi.boi",
        password:"boiboi",
        access:"boi"
    });
    let user_2 = await User.create({
        id: uuidv4(),
        username:"gurl",
        email:"gurl@boi.boi",
        password:"gurlgurl",
        access:"client"
    });
    await user_boi.$create("log",{
        id:uuidv4(),
        log:<Log>{action:'GET'}
    });
    await user_2.$create("log",{
        id:uuidv4(),
        log:<Log>{action:'POST'}
    });
    await user_boi.$create("log",{
        id:uuidv4(),
        log:<Log>{action:'PUT'}
    });
    await user_boi.$create("log",{
        id:uuidv4(),
        log:<Log>{action:'DELETE'}
    });
    await user_boi.save();
    await user_2.save();
    
    
    // -----Section and Subsection-------
    // ----------------------------------
    let depo:Section = await Section.create({
        name:"Depo and things"
    },{include:Subsection});
    await depo.$create('subsection',{
        name:"motorzagi"
    });
    await depo.$create('subsection',{
        name:"motorlaivas"
    });
    await depo.$create('subsection',{
        name:"motormotori"
    });
    console.log(depo.toJSON());
    await depo.save();
    //await sequelize.sync();

    // ----------Listings---------------
    // ---------------------------------

    //(await depo.$get('subsections',{where:{name:"motorzagi"}}))[0];
    let motorzagi:Subsection = (await depo.$get('subsections',{where:{name:"motorzagi"}}))[0];
    let chainsaw = await Listing.create({
        id:uuidv4(),
        title:"Big chonky chainsaw",
        body: "Selling big chonky chainsaw :)) Get it for cheap!!!! Brand old",
        start_price: 2000,
        status:"open",
        subsectionId:motorzagi.id,
        userId:user_2.id
    });

    let motorlaivas:Subsection = (await depo.$get('subsections',{where:{name:"motorlaivas"}}))[0];
    await Listing.create({
        id:uuidv4(),
        title:"Big chonky boat motor",
        body: "Selling big chonky motor :(( Get it for cheap (not)!!!! Brand.",
        start_price: 3126,
        status:"available",
        subsectionId:motorlaivas.id,
        userId:user_boi.id
    });

    // ---------Bids--------------
    // ---------------------------

    let user = (await User.findOne({where:{username:"xXx_boi_xXx"}}));
    await Bid.create({
        bid_amount:420,
        listingId:chainsaw.id,
        userId: user.id
    });
    
    

    await sequelize.sync();
}


if(sys.args.includes('--seed')){
    //clear all tables
    sequelize.sync({force:true}).then(()=>
        //seed
        seedAll().then(()=>
            //sync in case it isn't synced
            sequelize.sync().then(()=>console.log("Done"))
        )
    );
}