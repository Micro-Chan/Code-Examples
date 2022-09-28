const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { token } = require('./config.json');
const { MongoClient } = require("mongodb");
const scriptlink = "https://mindustry.me/sugon/loader.lua"
const RandomOrg = require('random-org');
var random = new RandomOrg({ apiKey: '2566475e-44aa-4a06-9a53-4875b95ee981' });


const url = "mongodb+srv://root:.iosucksLOL@whitelist.14ppa.mongodb.net/Whitelist?retryWrites=true&w=majority";
const mclient = new MongoClient(url);

// Create a new client instance
const client = new Client({ 
    intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent] ,

    partials: [Partials.Message, 
    Partials.Channel, 
    Partials.Reaction] 
});

// When the client is ready, run this code (only once)
client.once('ready', () => { 
	console.log('Ready!');
});




//Command
function parser(message,member) {
    let text = message.content
    let tempArray = text.split(" ");
    tempArray[0] = tempArray[0].toLowerCase()
    const myArray = tempArray
    


    //rewhitelist for old buyers 
    if (myArray[0] == "!rewhitelist") {
        if (member.roles.cache.has("870660011121061900")) {       //check for old buyer role
            if (member.roles.cache.has("1023171996097454161")) {         //check for whitelisted role
                return "You are already whitelisted!"
            } else {
                if  (myArray.length == 1) {
                    async function run() {
                        try {
                            const collection = database.collection("whitelisted");
                            //create a key and check if it exists
                            let tempkey = "a"
                            let keycheck = 0
                            do{
                                tempkey = await random.generateStrings({  n: 1, length: 18, characters: "abcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()"  })
                                keycheck = await collection.countDocuments({key: tempkey}, { limit: 1 })
                            } while (keycheck == 1)
                            const scriptkey = tempkey


                            // create a document to insert
                            const doc = {
                                duid: String(message.author.id),
                                hwid: "a",
                                IPs: [],
                                lastchange: 1,
                                key: scriptkey
                            }
                            const result = await collection.insertOne(doc);
                            console.log(`A document was inserted with the _id: ${result.insertedId}`);
                            } finally {
                            await mclient.close();
                        }
                    }
                    member.roles.add("1023171996097454161");
                    run().catch(console.dir);
                    return("Successfully whitelisted! Your script is: ```_G.key = \"" + scriptkey + "\"\nloadstring(game:HttpGet(" + scriptlink + "))```")
                } else {  return "Invalid syntax!"  }
            }
        }   else {
            return "You are not an old buyer!"
        }
    }

    //normal whitelist
    if (myArray[0] == "!whitelist") {
        //check for whitelisted role
        if (member.roles.cache.has("1023171996097454161")) {         
            return "You are already whitelisted!"
        } else {
            if  (myArray.length == 2) {
                const database = mclient.db("whitelist");
                const coll = database.collection("keys")
                let keyfound = 0
                function found(){ keyfound = 1  }
                coll.countDocuments({key: myArray[1]})
                .then(found())
                .catch()
                console.log(keyfound)
                if (keyfound == 1) {
                    const filter = { key: myArray[1] };
                    const updateDoc = {
                        $set: {
                          used: "true"
                        },
                    };
                    async function run() {
                        try {
                            coll.updateOne(filter, updateDoc);
                            const collection = database.collection("whitelisted");
                            //create a key and check if it exists
                            let tempkey = "a"
                            let keycheck = 0
                            do{
                                tempkey = await random.generateStrings({  n: 1, length: 18, characters: "abcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()"  })
                                keycheck = await collection.countDocuments({key: tempkey}, { limit: 1 })
                            } while (keycheck == 1)
                            const scriptkey = tempkey
                            
                            // create a document to insert
                            const doc = {
                                duid: String(message.author.id),
                                hwid: "a",
                                IPs: [],
                                lastchange: 1,
                                key: scriptkey
                            }
                            const result = await collection.insertOne(doc);
                            console.log(`A document was inserted with the _id: ${result.insertedId}`);
                            } finally {
                            await mclient.close();
                        }
                    }
                    member.roles.add("1023171996097454161");
                    run().catch(console.dir);
                    return("Successfully whitelisted! Your script is: ```_G.key = \"" + scriptkey + "\"\nloadstring(game:HttpGet(" + scriptlink + "))```")
                } else {  return "Invalid key!"  }
            } else {  return "Invalid syntax!"  }
        }

    }

    //reset key
    if (myArray[0] == "!newkey") {
        if (member.roles.cache.has("1023171996097454161")) {         //check for whitelisted role
            if  (myArray.length == 1) {
                async function run() {
                    try {
                        const collection = database.collection("whitelisted");
                        //create a key and check if it exists
                        let tempkey = "a"
                        let keycheck = 0
                        do{
                            tempkey = await random.generateStrings({  n: 1, length: 18, characters: "abcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()"  })
                            keycheck = await collection.countDocuments({key: tempkey}, { limit: 1 })
                        } while (keycheck == 1)
                        const scriptkey = tempkey
                        const query = {  duid: message.author.id  }
                        collection.updateOne(
                            query,
                            { $set: { key: scriptkey} }
                        )

                        } finally {
                        await mclient.close();
                    }
                }
                member.roles.add("1023171996097454161");
                run().catch(console.dir);
                return("Successfully changed! Your script is: ```_G.key = \"" + scriptkey + "\"\nloadstring(game:HttpGet(" + scriptlink + "))```")
            } else {  return "Invalid syntax!"  }
        } else {  return "You are not whitelisted!"  }
    }


    //test
    if (myArray[0] == "test") {
        return "Bot is working!"
    } else {  return "none"  }

}









// Login to Discord with your client's token
client.login(token);

client.on("messageCreate", (message) => {
    console.log("[" + message.author.tag +"]: " + message.content)
    if (!message.guild && !message.author.bot) {
        async function run(){
            var check = false
            function memberIn() {
                check = true
            }
            const guild = await client.guilds.fetch("870654004311494686")
            guild.members.fetch(message.author.id) 
            .then(memberIn())
            .catch()
            if (check) {
                const member =  await guild.members.fetch(message.author.id)
                const tosend = parser(message,member)
                if (tosend != "none") {  member.send(tosend)  }
            }
        }
        run()
    }
})
