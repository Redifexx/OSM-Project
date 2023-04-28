import fs from 'fs';

function readAirportsFromFile(filepath) {
  // Read the file contents into a string
  const data = fs.readFileSync(filepath, 'utf-8');

  // Split the data string by line breaks
  const lines = data.trim().split('\n');

  const names = [];
  const longitudes = [];
  const latitudes = [];

  // Loop through each line and extract the airport name, longitude, and latitude
  for (let i = 0; i < lines.length; i++) {
    const fields = lines[i].split(',');

    const name = fields[1].replace(/"/g, ''); // remove quotes from the name
    const longitude = fields[6];
    const latitude = fields[7];

    // Add the results for each line to the arrays
    names.push(name);
    longitudes.push(longitude);
    latitudes.push(latitude);
  }

  // Return an object containing the arrays of airport names, longitudes, and latitudes
  return { names, longitudes, latitudes };
}

export default readAirportsFromFile;
