const express = require('express');
const app = express();
const port = 7071;
const ping = require('ping');


const gameServers = [
  { id: 1, name: 'Server 1', ip: '192.168.1.1', port: '1235', region: 'Europe', description: 'Welcome to server 1!', players: '10', ping: '1', map: 'Underworld', lastHeartbeat: 1 },
  { id: 2, name: 'Server 2', ip: '192.168.1.2', port: '1234', region: 'America', description: 'Welcome to server 2!', players: '0', ping: '2', map: 'World', lastHeartbeat: 1 },
];

const getIPAddress = async () => {
  try {
    const ipResponse = await fetch('https://httpbin.org/ip');
    const ipData = await ipResponse.json();
    const ip_address = ipData.origin || 'Unknown';
    return ip_address;
  } catch (error) {
    console.error('Error fetching IP information:', error);
    return "Unkown";
  }
};

const getRegion = async (ipAddress) => {
  try {
    const ipurl = `https://ipinfo.io/${ipAddress}/json`;
    const regionResponse = await fetch(ipurl);
    const regionData = await regionResponse.json();
    const region = regionData.region || 'Unknown';
    return region;
  } catch (error) {
    console.error('Error fetching region by IP:', error);
    return 'Unknown';
  }
};


const removeServer = () => {
  const now = new Date();
  const inactiveThreshold = 61 * 1000;

  for (let i = gameServers.length - 1; i >= 0; i--) {
    const server = gameServers[i];
    if (server.lastHeartbeat && now - server.lastHeartbeat >= inactiveThreshold) {
      console.log("Removing the following server:\n" + JSON.stringify(gameServers[i], null, 2));
      gameServers.splice(i, 1);
    }
  }
};

setInterval(removeServer, 61 * 1000);


app.get('/servers', (req, res) => {
  res.json(gameServers.slice(0, 10)).toString("base64");
});

app.post('/heartbeat', express.json(), async (req, res) => {
  const { id, name, port, description, players, map } = req.body;
  var ip = await getIPAddress()
  const serverIndex = gameServers.findIndex(
    (server) => server.id === id && server.name === name && server.ip === ip
  );

  if (serverIndex !== -1) {
    gameServers[serverIndex].lastHeartbeat = new Date();
    const pingResult = await ping.promise.probe(ip);
    gameServers[serverIndex].players = players
    if (pingResult.alive) {
      gameServers[serverIndex].ping = pingResult.time;
    } else {
      gameServers.splice(serverIndex, 1);
    }
    res.status(200).send(String(id));
  } else {
    var ip = await getIPAddress()
    var region = await getRegion(ip)
    const pingResult = await ping.promise.probe(ip);
    var biggest_Id = 0
    var new_id
    for (let i = gameServers.length - 1; i >= 0; i--) {
      if (gameServers[i].id > biggest_Id) {
        biggest_Id = gameServers[i].id
      }
    }
    new_id = biggest_Id + 1
    gameServers.push({
      id: new_id,
      name: name,
      ip: ip,
      port: port,
      region: region,
      description: description,
      players: players,
      map: map,
      ping: pingResult.alive ? pingResult.time : -1,
      lastHeartbeat: new Date(),
    });
    gameServers.sort((a, b) => b.lastHeartbeat - a.lastHeartbeat);
    console.log("Added the following server:\n" + JSON.stringify(gameServers[0], null, 2))
    res.status(201).send(String(new_id));
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
