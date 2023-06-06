/**
 * Generates an array of objects containing a formatted date and a random price
 * for the past n days, including the current day.
 *
 * @param {number} n - The number of days to generate data for.
 * @return {Array} An array of objects containing date and price properties.
 */

function generateData(n) {
  const currentDate = new Date();
  const data = [];

  for (let i = 0; i <= n; i++) {
    const date = new Date(currentDate.getTime() - i * 24 * 60 * 60 * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    data.push({
      date: formattedDate,
      price: getRandomPrice(),
    });
  }

  return data;
}

/**
 * Generates a random price within the specified range.
 *
 * @param {number} min - The minimum price value (default: 10).
 * @param {number} max - The maximum price value (default: 30).
 * @returns {number} A random price between the minimum and maximum values.
 */

function getRandomPrice(min = 10, max = 30) {
  return parseInt(Math.random() * (max - min) + min);
}
