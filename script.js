// Global variables for zoom and pan
let xMin = -10;
let xMax = 10;
let yMin = -10;
let yMax = 10;

let isPanning = false;
let startPan = { x: 0, y: 0 };

// Reference to the canvas element
const canvas = document.getElementById('graphCanvas');

function drawGraph() {
    // Get the user-entered equation
    const equationInput = document.getElementById('equation').value;

    // Compile the equation
    let equation;
    try {
        equation = math.compile(equationInput);
    } catch (error) {
        alert('Invalid equation. Please check your input.');
        return;
    }

    // Get the canvas context
    const ctx = canvas.getContext('2d');

    // Clear the previous graph
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate scale factors
    const scaleX = canvas.width / (xMax - xMin);
    const scaleY = canvas.height / (yMax - yMin);

    // Draw gridlines and axes
    drawGridlines(ctx, scaleX, scaleY);
    drawAxes(ctx, scaleX, scaleY);

    // Plot the equation
    ctx.beginPath();
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;

    let firstPoint = true;
    for (let pixelX = 0; pixelX <= canvas.width; pixelX++) {
        // Convert pixel x-coordinate to mathematical x-coordinate
        const x = xMin + (pixelX / canvas.width) * (xMax - xMin);

        // Evaluate the equation at x
        let y;
        try {
            y = equation.evaluate({ x: x });
        } catch (error) {
            firstPoint = true;
            continue;
        }

        // Skip if y is not finite
        if (!isFinite(y)) {
            firstPoint = true;
            continue;
        }

        // Convert mathematical y-coordinate to pixel y-coordinate
        const pixelY = canvas.height - ((y - yMin) * scaleY);

        // If the point is outside the canvas, skip drawing it
        if (pixelY < 0 || pixelY > canvas.height) {
            firstPoint = true;
            continue;
        }

        // Draw the point
        if (firstPoint) {
            ctx.moveTo(pixelX, pixelY);
            firstPoint = false;
        } else {
            ctx.lineTo(pixelX, pixelY);
        }
    }
    ctx.stroke();
}

function drawGridlines(ctx, scaleX, scaleY) {
    ctx.beginPath();
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;

    // Determine grid spacing
    const xGridSpacing = calculateGridSpacing(xMin, xMax);
    const yGridSpacing = calculateGridSpacing(yMin, yMax);

    // Vertical gridlines
    for (let x = Math.ceil(xMin / xGridSpacing) * xGridSpacing; x <= xMax; x += xGridSpacing) {
        const pixelX = (x - xMin) * scaleX;
        ctx.moveTo(pixelX, 0);
        ctx.lineTo(pixelX, canvas.height);
    }

    // Horizontal gridlines
    for (let y = Math.ceil(yMin / yGridSpacing) * yGridSpacing; y <= yMax; y += yGridSpacing) {
        const pixelY = canvas.height - (y - yMin) * scaleY;
        ctx.moveTo(0, pixelY);
        ctx.lineTo(canvas.width, pixelY);
    }

    ctx.stroke();
}

function drawAxes(ctx, scaleX, scaleY) {
    ctx.beginPath();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;

    // X-axis
    const yZero = canvas.height - (-yMin) * scaleY;
    ctx.moveTo(0, yZero);
    ctx.lineTo(canvas.width, yZero);

    // Y-axis
    const xZero = (-xMin) * scaleX;
    ctx.moveTo(xZero, 0);
    ctx.lineTo(xZero, canvas.height);

    ctx.stroke();

    // Draw axis labels
    ctx.fillStyle = '#000000';
    ctx.font = '10px Arial';

    // X-axis labels
    const xGridSpacing = calculateGridSpacing(xMin, xMax);
    for (let x = Math.ceil(xMin / xGridSpacing) * xGridSpacing; x <= xMax; x += xGridSpacing) {
        const pixelX = (x - xMin) * scaleX;
        ctx.fillText(x.toFixed(2), pixelX + 2, yZero - 2);
    }

    // Y-axis labels
    const yGridSpacing = calculateGridSpacing(yMin, yMax);
    for (let y = Math.ceil(yMin / yGridSpacing) * yGridSpacing; y <= yMax; y += yGridSpacing) {
        const pixelY = canvas.height - (y - yMin) * scaleY;
        ctx.fillText(y.toFixed(2), xZero + 2, pixelY - 2);
    }
}

function calculateGridSpacing(min, max) {
    const range = max - min;
    const roughGridSize = range / 10;
    const exponent = Math.floor(Math.log10(roughGridSize));
    const fraction = roughGridSize / Math.pow(10, exponent);
    let niceFraction;

    if (fraction <= 1) {
        niceFraction = 1;
    } else if (fraction <= 2) {
        niceFraction = 2;
    } else if (fraction <= 5) {
        niceFraction = 5;
    } else {
        niceFraction = 10;
    }

    return niceFraction * Math.pow(10, exponent);
}

// Event listeners for zoom and pan

// Zooming
canvas.addEventListener('wheel', function (event) {
    event.preventDefault();

    const zoomFactor = 1.1;
    const { offsetX, offsetY, deltaY } = event;

    // Get mouse position in terms of coordinate system
    const mouseX = xMin + (offsetX / canvas.width) * (xMax - xMin);
    const mouseY = yMin + ((canvas.height - offsetY) / canvas.height) * (yMax - yMin);

    if (deltaY < 0) {
        // Zoom in
        xMin = mouseX + (xMin - mouseX) / zoomFactor;
        xMax = mouseX + (xMax - mouseX) / zoomFactor;
        yMin = mouseY + (yMin - mouseY) / zoomFactor;
        yMax = mouseY + (yMax - mouseY) / zoomFactor;
    } else {
        // Zoom out
        xMin = mouseX + (xMin - mouseX) * zoomFactor;
        xMax = mouseX + (xMax - mouseX) * zoomFactor;
        yMin = mouseY + (yMin - mouseY) * zoomFactor;
        yMax = mouseY + (yMax - mouseY) * zoomFactor;
    }
    drawGraph();
});

// Panning
canvas.addEventListener('mousedown', function (event) {
    isPanning = true;
    startPan = { x: event.clientX, y: event.clientY };
    canvas.style.cursor = 'grabbing';
});

canvas.addEventListener('mousemove', function (event) {
    if (isPanning) {
        const dx = event.clientX - startPan.x;
        const dy = event.clientY - startPan.y;
        const scaleX = (xMax - xMin) / canvas.width;
        const scaleY = (yMax - yMin) / canvas.height;

        xMin -= dx * scaleX;
        xMax -= dx * scaleX;
        yMin += dy * scaleY;
        yMax += dy * scaleY;

        startPan = { x: event.clientX, y: event.clientY };
        drawGraph();
    }
});

canvas.addEventListener('mouseup', function () {
    isPanning = false;
    canvas.style.cursor = 'grab';
});

canvas.addEventListener('mouseleave', function () {
    isPanning = false;
    canvas.style.cursor = 'grab';
});