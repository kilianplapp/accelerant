const mouseData = [];
let lastMoveTime = 0;

function addMovement(event) {
    const currentTime = Date.now();
    if (currentTime - lastMoveTime > 250) {
        lastMoveTime = currentTime;
        const dataPoint = {
            x: event.pageX,
            y: event.pageY,
            timestamp: currentTime
        };
        mouseData.push(dataPoint);
    }
}

export async function startRecording(length) {
    document.addEventListener("mousemove", addMovement);
    document.addEventListener("touchmove", addMovement);
    while (mouseData.length <= length) {
        await new Promise(resolve => setTimeout(resolve, 500))
    }
    document.removeEventListener("mousemove", addMovement);
    document.removeEventListener("touchmove", addMovement);
    return mouseData;
}