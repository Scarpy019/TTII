import { CreateOptions, Optional } from "sequelize";
import { Listing, ListingModel, Log, Section, Subsection, User, UserLog } from "./models";
import { sys } from "typescript";
import { sequelize } from "./sequel";
import {v4 as uuidv4} from 'uuid';

export async function seedAll(){
    // -------User and UserLog-------
    // ------------------------------
    let user_boi = await User.create({
        id: uuidv4(),
        username:"xXx_boi_xXx",
        email:"boi@boi.boi",
        access:"boi"
    });
    let user_2 = await User.create({
        id: uuidv4(),
        username:"gurl",
        email:"gurl@boi.boi",
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
    });
    await depo.$create('subsection',{
        name:"motorzagi"
    });
    await depo.$create('subsection',{
        name:"motorlaivas"
    });
    await depo.$create('subsection',{
        name:"motormotori"
    });
    await depo.save();
    //await sequelize.sync();

    // ----------Listings---------------
    // ---------------------------------
    let motorzagi:Subsection = (await depo.$get('subsections',{where:{name:"motorzagi"}}))[0];
    let chainsaw:Listing = await Listing.build(<ListingModel>{
        title:"Big chonky chainsaw",
        body: "Selling big chonky chainsaw :)) Get it for cheap!!!! Brand old",
        start_price: 2000
    });
    await chainsaw.$set('subsection',motorzagi);
    await chainsaw.$set('user',user_2);
    await chainsaw.save();

    let motorlaivas:Subsection = (await depo.$get('subsections',{where:{name:"motorlaivas"}}))[0];
    let motorb:Listing = await Listing.build(<ListingModel>{
        title:"Big chonky boat motor",
        body: "Selling big chonky motor :(( Get it for cheap (not)!!!! Brand.",
        start_price: 3126
    });
    await motorb.$set('subsection',motorlaivas);
    await motorb.$set('user',user_boi);
    await motorb.save();

    await sequelize.sync();
}


if(sys.args.includes('--seed')){
    sequelize.sync({force:true}).then(()=>
        seedAll().then(()=>
            sequelize.sync().then(()=>console.log("Done"))
        )
    );
}