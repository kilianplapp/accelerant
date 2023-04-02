const mouseData = [];
let lastMoveTime = 0;

function addMouseMovement(event) {
    const currentTime = Date.now();
    if (currentTime - lastMoveTime > 250) {
        lastMoveTime = currentTime
        const dataPoint = {
            x: event.clientX,
            y: event.clientY,
            timestamp: currentTime
          };
        mouseData.push(dataPoint);
    }

}

export async function startRecording(length) {
    document.addEventListener("mousemove", addMouseMovement)
    while (mouseData.length <= length) {
        await new Promise(resolve => setTimeout(resolve, 500))
    }
    document.removeEventListener("mousemove", addMouseMovement)
    return mouseData
}