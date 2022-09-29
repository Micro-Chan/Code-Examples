const http = require('http')
const hostname = '0.0.0.0'
const port = 9837;
const { MongoClient } = require("mongodb");


const url = "mongodb+srv://root:.iosucksLOL@whitelist.14ppa.mongodb.net/Whitelist?retryWrites=true&w=majority";
const client = new MongoClient(url);


const server = http.createServer((req, res) => {
    try{
        const { headers } = req;
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        })
        
        req.on('end', () => {
            async function run() {
                let result = "waiegjd213f"
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
                if ((time - data.ostime) < 6) {
                    timematch = true
                }
                
                //getting script key
                const key = data.key

                //size check
                let size = Object.keys(data).length;

                //connect
                client.connect();
                console.log("Connected correctly to server");

                //retrieving entry, checking hwid
                const database = client.db("whitelist");
                const collection = database.collection("whitelisted")
                const query = { key: key };
                const options = {
                  projection: { hwid: 1, lastchange: 1 },
                };
                const entry = await collection.findOne(query, options);
                let hwidallow = true
                if (entry.hwid != sui) {
                    if ((time - Number(entry.lastchange)) > 86400) {
                        collection.updateOne(
                            query,
                            { $set: { hwid: sui, lastchange: time} }
                        )
                    } else {  hwidallow = false  }
                }



                //returning
                if (timematch && size == 3 && hwidallow) {
                    collection.updateOne(
                        query,
                        { $push: { IPs: data.haship } }
                    )
                    result = "xaea12"
                } 

                //hwid change time
                if (!hwidallow) {
                    result = "hwidgay"
                }

                console.log(result)
                console.log("---------------------------")
                res.end(result)
            }
        run().catch(console.dir)
        })  
    } catch (err) {
        console.log(err.stack)
    } 
    finally {

    }
})

server.listen(port,hostname, () => {
    console.log('Server running')
    console.log("---------------------------")
})
