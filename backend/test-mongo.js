const { MongoClient } = require('mongodb');
const uri = 'mongodb://rahuldropyhub_db_user:Wouchify%402026@ac-focxzaz-shard-00-00.shilkmv.mongodb.net:27017,ac-focxzaz-shard-00-01.shilkmv.mongodb.net:27017,ac-focxzaz-shard-00-02.shilkmv.mongodb.net:27017/wouchify?ssl=true&replicaSet=atlas-1qzite-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0';

const client = new MongoClient(uri, { 
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
  socketTimeoutMS: 5000
});

client.on('serverHeartbeatStarted', event => console.log('Heartbeat Started:', event.connectionId));
client.on('serverHeartbeatSucceeded', event => console.log('Heartbeat Succeeded:', event.connectionId));
client.on('serverHeartbeatFailed', event => console.log('Heartbeat Failed:', event.connectionId, event.failure?.message || event.failure));

async function run() {
  try {
    console.log('Connecting...');
    await client.connect();
    console.log('Successfully connected to Atlas!');
    await client.close();
  } catch (err) {
    console.error('Connection failed:', err.message);
  }
}
run();
