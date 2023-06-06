/**
 * Generates an array of data items with dates and randomly generated prices.
 */
const data = generateData(20);

// Get the chart canvas element by its ID
const canvas = document.getElementById("chartCanvas");
// Get the 2D rendering context of the canvas
const context = canvas.getContext("2d");

const chartWidth = canvas.width;
const chartHeight = canvas.height;

const margin = 40;
const plotWidth = chartWidth - 2 * margin;
const plotHeight = chartHeight - 2 * margin;

// Calculate the minimum and maximum price values
const prices = data.map((item) => item.price);
const minPrice = Math.min(...prices);
const maxPrice = Math.max(...prices);

// Calculate the minimum and maximum dates
const dates = data.map((item) => new Date(item.date));
const minDate = new Date(Math.min(...dates));
const maxDate = new Date(Math.max(...dates));

// Calculate the number of data points and the step size
const numPoints = data.length;
const stepSize = plotWidth / (numPoints - 1);

// Calculate the moving average
const movingAverage = [];
const days = 20;
for (let i = 0; i < numPoints; i++) {
  let sum = 0;
  let count = 0;
  for (let j = Math.max(0, i - days + 1); j <= i; j++) {
    sum += data[j].price;
    count++;
  }
  movingAverage.push(sum / count);
}

// Enable scrolling using the mouse
let scrollOffset = 0;
let isDragging = false;
let dragStartX = 0;

canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("mouseup", handleMouseUp);
canvas.addEventListener("mouseout", handleMouseOut);

canvas.addEventListener(
  "wheel",
  (event) => {
    const { ctrlKey } = event;
    if (ctrlKey) {
      event.preventDefault();
      return;
    }
  },
  { passive: false }
);

function handleMouseDown(event) {
  isDragging = true;
  dragStartX = event.clientX;
}

function handleMouseMove(event) {
  if (isDragging) {
    const dragDistance = event.clientX - dragStartX;
    scrollOffset += dragDistance;
    drawChart();
    dragStartX = event.clientX;
  }
}

function handleMouseUp() {
  isDragging = false;
}

function handleMouseOut() {
  isDragging = false;
}

function drawChart() {
  context.clearRect(0, 0, chartWidth, chartHeight);

  // Draw the axes
  context.beginPath();
  context.moveTo(margin, margin);
  context.lineTo(margin, chartHeight - margin);
  context.lineTo(chartWidth - margin, chartHeight - margin);
  context.stroke();

  // Draw the y-axis labels - price
  const numLabels = 5;
  const labelStep = plotHeight / numLabels;
  const priceRange = maxPrice - minPrice;
  const priceStep = priceRange / numLabels;
  for (let i = 0; i <= numLabels; i++) {
    const label = (maxPrice - i * priceStep).toFixed(2);
    const y = margin + i * labelStep;
    context.fillText(label, 10, y);
  }

  // Draw the x-axis labels - date
  const numLabelsxAxis = 10;
  const dateRange = maxDate - minDate;
  const dateStep = dateRange / numLabelsxAxis;
  for (let i = 0; i <= numLabelsxAxis; i++) {
    const date = new Date(minDate.getTime() + i * dateStep);
    const label = date.toLocaleDateString();
    const x = margin + i * labelStep;
    context.fillText(label, x, chartHeight - 10);
  }

  // Plot the closing prices
  context.beginPath();
  context.strokeStyle = "#0000FF";
  for (let i = 0; i < numPoints; i++) {
    const x = margin + i * stepSize + scrollOffset;
    const y =
      chartHeight -
      margin -
      (data[i].price - minPrice) * (plotHeight / priceRange);
    if (i === 0) {
      context.moveTo(x, y);
    } else {
      context.lineTo(x, y);
    }
  }
  context.stroke();

  // Plot the moving average
  context.beginPath();
  context.strokeStyle = "#FFC0CB";
  for (let i = 0; i < numPoints; i++) {
    const x = margin + i * stepSize + scrollOffset;
    const y =
      chartHeight -
      margin -
      (movingAverage[i] - minPrice) * (plotHeight / priceRange);
    if (i === 0) {
      context.moveTo(x, y);
    } else {
      context.lineTo(x, y);
    }
  }
  context.stroke();
}

drawChart();
