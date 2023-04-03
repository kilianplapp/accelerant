import math
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
