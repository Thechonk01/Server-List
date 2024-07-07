import requests
import json
import random
import time

server_data = {
    "id": -1,
    "name": input("Please input server name:"),
    "port": input("Please input your port:"),
    "description": input("Please input description:"),
    "players": random.randint(1, 10),
    "map": input("Please input map:"),
}

url = "http://localhost:7071/heartbeat"  

while True:
    try:
        response = requests.post(url, json=server_data)

        if response.status_code == 200:
            print("Heartbeat received successfully")
        elif response.status_code == 201:
            server_data["id"] = int(response.text)
            print("Server added with heartbeat")
        else:
            print("Error:", response.status_code)
        print(server_data)
        time.sleep(5)
    except KeyboardInterrupt:
        print("Stopping...")
        time.sleep(3)
        break
    except:
        print("Error")
