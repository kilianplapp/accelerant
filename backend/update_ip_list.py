import csv
import json
import urllib.request

# Download CSV file from URL
response = urllib.request.urlopen("https://raw.githubusercontent.com/growlfm/ipcat/main/datacenters.csv")
lines = [l.decode('utf-8') for l in response.readlines()]
csv_reader = csv.reader(lines)

# Extract IP addresses from CSV file
ips = []
for row in csv_reader:
    ips.extend(row[0:2])

# Convert list of IP addresses to JSON format
ip_dict = {"ips": ips}
json_str = json.dumps(ip_dict)

# Write JSON to file
with open("ip_list.json", "w") as f:
    f.write(json_str)