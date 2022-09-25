const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { token } = require('./config.json');
const { MongoClient } = require("mongodb");
const scriptlink = "https://mindustry.me/sugon/loader.lua"


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
    const myArray = text.split(" ");


    //rewhitelist for old buyers 
    if (myArray[0] == "!rewhitelist" || myArray[0] == "!Rewhitelist") {
        if (member.roles.cache.has("870660011121061900")) {       //check for old buyer role
            if (member.roles.cache.has("1023171996097454161")) {         //check for whitelisted role
                return "You are already whitelisted!"
            } else {
                if  (myArray.length == 2) {
                    async function run() {
                        try {
                            const database = mclient.db("whitelist");
                            const collection = database.collection("whitelisted");
                            const d = new Date();
                            const time = Math.round(d.getTime() / 1000); 
                            const str = String(time)
                            // create a document to insert
                            const doc = {
                                duid: String(message.author.id),
                                hwid: myArray[2],
                                IPs: [],
                                lastchange: str
                            }
                            const result = await collection.insertOne(doc);
                            console.log(`A document was inserted with the _id: ${result.insertedId}`);
                            } finally {
                            await mclient.close();
                        }
                    }
                    member.roles.add("1023171996097454161");
                    run().catch(console.dir);
                    const key = String(message.author.id)
                    return("Successfully rewhitelisted! Your script is: ```_G.key = \"324554" + key + "623217\"\nloadstring(game:HttpGet(" + scriptlink + "))```")
                } else {  return "Invalid syntax!"  }
            }
        }   else {
            return "You are not an old buyer!"
        }
    }

    //normal whitelist
    if (myArray[0] == "!whitelist" || myArray[0] == "!Whitelist") {
        //check for whitelisted role
        if (member.roles.cache.has("1023171996097454161")) {         
            return "You are already whitelisted!"
        } else {
            if  (myArray.length == 3) {
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
                    const options = { upsert: true };
                    const updateDoc = {
                        $set: {
                          used: "true"
                        },
                    };
                    async function run() {
                        try {
                            const g = await coll.updateOne(filter, updateDoc, options);
                            const collection = database.collection("whitelisted");
                            const d = new Date();
                            const time = Math.round(d.getTime() / 1000); 
                            const str = String(time)
                            // create a document to insert
                            const doc = {
                                duid: String(message.author.id),
                                hwid: myArray[2],
                                IPs: [],
                                lastchange: str
                            }
                            const result = await collection.insertOne(doc);
                            console.log(`A document was inserted with the _id: ${result.insertedId}`);
                            } finally {
                            await mclient.close();
                        }
                    }
                    member.roles.add("1023171996097454161");
                    run().catch(console.dir);
                    const key = String(message.author.id)
                    return("Successfully whitelisted! Your script is: ```_G.key = \"324554" + key + "623217\"\nloadstring(game:HttpGet(" + scriptlink + "))```")
                } else {  return "Invalid key!"  }
            } else {  return "Invalid syntax!"  }
        }

    }



    //test
    if (myArray[0] == "test") {
        return "Bot is working!"
    }

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
                member.send(parser(message,member))
            }
        }
        run()
    }
})
