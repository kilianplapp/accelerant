input = input("Enter the accelerant string: ")
import matplotlib.pyplot as plt
import math
import base64
import json
def deobfuscate(obfuscated_str):
    key = "1KxIeFm2bC5xxEk89XGLVwRuDIRCqq0xlQRfYmiWkGXOPzFFsITZwp5RwMe6RWtn"
    result = ''
    decoded_str = base64.b64decode(obfuscated_str).decode('utf-8')
    for i in range(len(decoded_str)):
        key_char = key[i % len(key)]
        key_int = ord(key_char)
        result += chr(key_int ^ ord(decoded_str[i]))
    return result

def calculate_velocity(data):
    velocities = []
    for i in range(1, len(data)):
        dx = data[i]['x'] - data[i-1]['x']
        dy = data[i]['y'] - data[i-1]['y']
        dt = data[i]['timestamp'] - data[i-1]['timestamp']
        velocity = math.sqrt(dx**2 + dy**2) / dt
        velocities.append(velocity)
    return velocities

def graph_velocity(data):
    velocities = calculate_velocity(data)
    timestamps = [data[i]['timestamp'] for i in range(1, len(data))]

    plt.plot(timestamps, velocities)
    plt.xlabel('Time')
    plt.ylabel('Velocity')
    plt.show()

def graph_mouse_data(data):
    xs = [d['x'] for d in data]
    ys = [d['y'] for d in data]
    timestamps = [d['timestamp'] for d in data]

    plt.scatter(xs, ys, label='Mouse Movements')
    plt.xlabel('Time')
    plt.ylabel('Coordinate')
    plt.legend()
    plt.show()

accelerant = json.loads(deobfuscate(input))
print('\n')
with open('accelerant.json', 'w') as f:
    json.dump(accelerant, f, indent=4)
print(accelerant)
graph_mouse_data(accelerant['msmv'])
graph_velocity(accelerant['msmv'])
calculate_velocity(accelerant['msmv'])