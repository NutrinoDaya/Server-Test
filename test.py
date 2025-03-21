import requests

url = "http://172.27.22.58:8084/archive"
data = {"name": "Laptop", "description": "A high-end laptop", "price": 1500.99}

response = requests.post(url, json=data)
print(response.json())  # Should print the received item
