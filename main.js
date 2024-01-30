const { MongoClient } = require('mongodb');
const { execSync } = require('child_process');

async function insertData() {
    try {
        const macAddress = "e4-5f-01-f5-b5-46";

        // Function to get IP address from MAC address
        function getIpFromMac(targetMac) {
            try {
                const arpOutput = execSync('arp -a', { encoding: 'utf-8' });
                const match = arpOutput.match(new RegExp(`(\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b).*${escapeRegExp(targetMac)}`));
                if (match) {
                    return match[1];
                }
            } catch (error) {
                console.error(error.message);
            }
            return null;
        }

        // Function to escape special characters in a string
        function escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }

        const ipAddress = getIpFromMac(macAddress);

        if (!ipAddress) {
            console.log(`No IP address found for MAC address ${macAddress}`);
            return;
        }

        console.log(`The IP address associated with MAC address ${macAddress} is: ${ipAddress}`);

        const mongo_uri = `mongodb://${ipAddress}:27017/swayam`;
        const client = new MongoClient(mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true });

        try {
            await client.connect();

            const db = client.db('swayam');
            const collection = db.collection('kiosk');

            const data_to_insert = {
                "name": "Aryan",
                "height": "180",
                "phone": "1234567890",
                "gender": "Male",
                "dob": "2000-09-14",

            };

            const result = await collection.insertOne(data_to_insert);

            console.log(`Document inserted with _id: ${result.insertedId}`);
        } finally {
            await client.close();
        }
    } catch (error) {
        console.error(error.message);
    }
}

insertData();
