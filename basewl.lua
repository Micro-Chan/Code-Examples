const http = require('http')
const hostname = '0.0.0.0'
const port = 9837;
const { MongoClient } = require("mongodb");


const url = "mongodb+srv://root:.iosucksLOL@whitelist.14ppa.mongodb.net/Whitelist?retryWrites=true&w=majority";
const client = new MongoClient(url);


const server = http.createServer((req, res) => {
    let result = "ai9efj"
    try{
        const { headers } = req;
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        })
        
        req.on('end', () => {
            async function run() {
                //parse json
                data = JSON.parse(data) 

                //time
                const d = new Date();
                let time = Math.round(d.getTime() / 1000); 

                //uid
                let sui = headers['syn-fingerprint']
                if (sui === undefined) {
                    sui = headers['krnl-fingerprint']
                }
                console.log("HWID is "+sui)

                //timechecking
                let timematch = false
                if ((time - data.ostime) < 3) {
                    timematch = true
                }
                
                //getting id
                let key = data.key
                key = key.slice(0,-6);
                key = key.substring(6);

                //size check
                let size = Object.keys(data).length;

                //connect
                client.connect();
                console.log("Connected correctly to server");

                //retrieving entry, checking hwid
                const database = client.db("whitelist");
                const collection = database.collection("whitelisted")
                const query = { duid: key };
                const options = {
                  projection: { hwid: 1, lastchange: 1 },
                };
                const entry = await collection.findOne(query, options);
                let hwidallow = true
                if (entry.hwid != sui) {
                    if ((time - Number(lastchange)) > 86400) {
                        collection.updateOne(
                            { duid: key },
                            { $set: { hwid: sui, lastchange: time} }
                        )
                    } else {  hwidallow = false  }
                }

                //returning
                if (timematch && found == 1 && size == 3 && hwidallow) {
                    collection.updateOne(
                        { duid: key },
                        { $push: { IPs: data.haship } }
                    )
                    result = "xaea12"
                } 

                //hwid change time
                if (!hwidallow) {
                    result = "hwidgay"
                }


                console.log("---------------------------")
            }
        run().catch(console.dir)
        })  
    } catch (err) {
        console.log(err.stack)
    } 
    finally {
        res.end(result)
    }
})

server.listen(port,hostname, () => {
    console.log('Server running')
    console.log("---------------------------")
})
