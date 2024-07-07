# Game Server Management API

This is a simple API for managing game servers, built with Node.js and Express. It allows you to list active game servers and update their status via heartbeat messages.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Endpoints](#endpoints)
  - [GET /servers](#get-servers)
  - [POST /heartbeat](#post-heartbeat)
- [Server Removal](#server-removal)
- [Dependencies](#dependencies)
- [License](#license)

## Installation

1. Clone the repository:

```sh
git clone https://github.com/yourusername/server-list.git
```

2. Navigate to the project directory:

```sh
cd gameserver-api
```

3. Install the dependencies:

```sh
npm install
```

4. Start the server:

```sh
node index.js
```

## Usage

After starting the server, it will run on `http://localhost:7071`. You can interact with the API using tools like Postman or curl.

## Endpoints

### GET /servers

Retrieves the list of active game servers.

**Request:**

```http
GET /servers HTTP/1.1
Host: localhost:7071
```

**Response:**

```json
[
  {
    "id": 1,
    "name": "Server 1",
    "ip": "192.168.1.1",
    "port": "1235",
    "region": "Europe",
    "description": "Welcome to server 1!",
    "players": "10",
    "ping": "1",
    "map": "Underworld",
    "lastHeartbeat": 1
  },
  {
    "id": 2,
    "name": "Server 2",
    "ip": "192.168.1.2",
    "port": "1234",
    "region": "America",
    "description": "Welcome to server 2!",
    "players": "0",
    "ping": "2",
    "map": "World",
    "lastHeartbeat": 1
  }
]
```

### POST /heartbeat

Updates the status of a game server or adds a new server if it doesn't exist.

**Request:**

```http
POST /heartbeat HTTP/1.1
Host: localhost:7071
Content-Type: application/json

{
  "id": 1,
  "name": "Server 1",
  "port": "1235",
  "description": "Welcome to server 1!",
  "players": "10",
  "map": "Underworld"
}
```

**Response:**

- **200 OK** if the server status is updated.
- **201 Created** if a new server is added.

## Server Removal

Inactive servers are automatically removed from the list. A server is considered inactive if it doesn't send a heartbeat within 61 seconds. This check is performed every 61 seconds.

## Dependencies

- [express](https://www.npmjs.com/package/express): Fast, unopinionated, minimalist web framework for Node.js.
- [ping](https://www.npmjs.com/package/ping): A simple wrapper for ping.

Install these dependencies using npm:

```sh
npm install express ping
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Feel free to contribute to this project by submitting issues or pull requests. Your feedback and contributions are welcome!
