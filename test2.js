const fs = require('fs');
const Papa = require('papaparse');
const readline = require('readline');

// Load the file
const fileContents = fs.readFileSync('/Users/Krivichabra/Downloads/airports.dat.txt', 'utf8');

// Parse the file contents
const parsedData = Papa.parse(fileContents, {
    delimiter: ',',
    header: false,
    skipEmptyLines: true,
});

// Extract the IATA codes from the parsed data
const iataCodes = parsedData.data.map((row) => row[4]);

// Create a graph
const graph = {};
parsedData.data.forEach((row) => {
    const [_, __, ___, code1, code2] = row;
    if (code1 && code2) {
        if (!graph[code1]) graph[code1] = [];
        if (!graph[code2]) graph[code2] = [];
        const distance = getDistance(row); // calculate the distance between two airports
        graph[code1].push({ node: code2, distance });
        graph[code2].push({ node: code1, distance });
    }
});

// Get the distance between two airports based on their coordinates
function getDistance(row) {
    //const [_, __, ___, ____, ____, ____, lat1, lon1, ____, ____, ____, lat2, lon2, ____, ____] = row;
    const [_1, _2, _3, _4, _5, _6, lat1, lon1, _7, _8, _9, lat2, lon2, _10, _11] = row;
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

// Prompt the user to input source and destination airports
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question('Enter source airport: ', (source) => {
    rl.question('Enter destination airport: ', (destination) => {
        console.log(`Fastest route using BFS: ${bfs(graph, source, destination)}`);
        console.log(`Fastest route using DFS: ${dfs(graph, source, destination)}`);
        rl.close();
    });
});

// Breadth-first search algorithm
function bfs(graph, start, destination) {
    const queue = [{ node: start, path: [], distance: 0 }];
    const visited = new Set();
    while (queue.length > 0) {
        const { node, path, distance } = queue.shift();
        if (node === destination) {
            return `${path.join(' -> ')} -> ${destination} (distance: ${distance.toFixed(2)} km)`;
        }
        visited.add(node);
        for (const neighbor of graph[node]) {
            if (!visited.has(neighbor.node)) {
                const newPath = [...path, node];
                queue.push({ node: neighbor.node, path: newPath, distance: distance + neighbor.distance });
            }
        }
    }
    return 'No route found';
}

// Depth-first search algorithm
function dfs(graph, start, destination, visited = new Set(), path = [], distance = 0) {
    visited.add(start);
    path.push(start);
    if (start === destination) {
        //return ${path.join(' -> ')} (distance: ${distance.toFixed(2)} km);
        return path.join(' -> ') + ' (distance: ' + distance.toFixed(2) + ' km)';

    }
    for (const neighbor of graph[start]) {
        if (!visited.has(neighbor.node)) {
            const result = dfs(graph, neighbor.node, destination, visited, path, distance + neighbor.distance);
            if (result) {
                return result;
            }
        }
    }
    path.pop();
    return null;
}
