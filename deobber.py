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

def check_mm(mouse_events, speed_limit=5, acceleration_limit=5):
    # Check for suspiciously high mouse speed
    speed_limit_breaks = 0
    for i in range(1, len(mouse_events)):
        dx = mouse_events[i]['x'] - mouse_events[i-1]['x']
        dy = mouse_events[i]['y'] - mouse_events[i-1]['y']
        dt = mouse_events[i]['timestamp'] - mouse_events[i-1]['timestamp']
        distance = math.sqrt(dx**2 + dy**2)
        speed = distance / dt
        print("Speed: " + str(speed))
        if speed > speed_limit:
            speed_limit_breaks += 1
        
    acceleration_limit_breaks = 0
    for i in range(2, len(mouse_events)):
        dx1 = mouse_events[i-1]['x'] - mouse_events[i-2]['x']
        dy1 = mouse_events[i-1]['y'] - mouse_events[i-2]['y']
        dt1 = mouse_events[i-1]['timestamp'] - mouse_events[i-2]['timestamp']
        distance1 = math.sqrt(dx1**2 + dy1**2)
        speed1 = distance1 / dt1
        
        dx2 = mouse_events[i]['x'] - mouse_events[i-1]['x']
        dy2 = mouse_events[i]['y'] - mouse_events[i-1]['y']
        dt2 = mouse_events[i]['timestamp'] - mouse_events[i-1]['timestamp']
        distance2 = math.sqrt(dx2**2 + dy2**2)
        speed2 = distance2 / dt2
        
        acceleration = (speed2 - speed1) / dt2
        acceleration = abs(acceleration)
        print("Acceleration: " + str(acceleration))
        if acceleration > acceleration_limit:
            acceleration_limit_breaks += 1
    return [speed_limit_breaks, acceleration_limit_breaks]

accelerant = json.loads(deobfuscate(input))
print('\n')
with open('accelerant.json', 'w') as f:
    json.dump(accelerant, f, indent=4)
print(accelerant)
graph_mouse_data(accelerant['msmv'])
graph_velocity(accelerant['msmv'])
calculate_velocity(accelerant['msmv'])
print(check_mm(accelerant['msmv']))
