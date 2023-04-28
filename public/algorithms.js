import { getRandomValues } from "crypto";
import { loadSetS, runQuery } from "./server.js";
import haversine from 'haversine';
import { Console } from "console";

const hello = 'hello!';
const osmFetchNode = "https://api.openstreetmap.org/api/0.6/node/";
var nodes = {
    source: null,
    destintation: null
};
const nodeSet = new Set();

function fetchNode(source, destination)
{
    nodes.source = source;
    nodes.destintation = destination;
    return fetch(osmFetchNode + source, {
        headers: {
          Accept: "application/xml",
      }})
      .then((response) => response.text())
      .then((result) => {
        console.log("ALGO: " + result);
        console.log("algo checkpoint");
        return loadSetS(nodeSet)
        .then(nodeSet => {
            dAlgo(nodeSet);
            return result;
        });
      })
      .catch((error) => {
        console.error(error);
    });
}


console.log("ALGO START: " + nodes.source);
console.log("ALGO END: " + nodes.destination);

const osmFetchWay = "https://api.openstreetmap.org/api/0.6/way/";
function fetchWay(id)
{
    return fetch(osmFetchWay + id, {
        headers: {
          Accept: "application/xml",
      }})
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error(error);
      });
}


async function dAlgo(nodeSet)
{
    console.log("DALGO START"); 
    let map = new Map();

    //Initialize Map for Dijkstra's
    nodeSet.forEach(function(value) {
        map.set(value, {dist: -1, pre: -1})
    });

    /*
    nodeSet.forEach(function(value) {
        var source = value;
        for (let [key, value_] of map) {
            if (key != source)
            {
                var query = 'SELECT way_id FROM GPEREZCOLON.WAYNODES WHERE node_id = ' + source + ' UNION SELECT way_id FROM GPEREZCOLON.WAYNODES WHERE node_id = ' + key;
                var result = runQuery(query).then(result => {  return result; });
                var promise = runQuery(query).then(result => {
                    if (result.length != 0)
                    {
                        return getWayLength(result);
                    }
                });
                value_.dist = promise;
            }
        }
    });
    */
}

async function getWayLength(way_id)
{
    let wayNodes = [];
    var nodeQuery = await runQuery('SELECT node_id FROM GPEREZCOLON.WAYNODES WHERE way_id = ' + way_id);
    for (let i = 0; i < nodeQuery.rows.length; i++)
    {
        wayNodes.push(nodeQuery[i]);
    }
    let length = 0;
    for (let i = 0; i < wayNodes.length - 1; i++)
    {
        const nd1 = wayNodes[i];
        const nd2 = wayNodes[i+1];
        const { lat: nd1Lat, lon: nd1Lon } = await runQuery('SELECT LAT, LON FROM GPEREZCOLON.UFDATA WHERE ID = ' + nd1);
        const { lat: nd2Lat, lon: nd2Lon } = await runQuery('SELECT LAT, LON FROM GPEREZCOLON.UFDATA WHERE ID = ' + nd2);
        const distance = haversine( { lat: nd1Lat, lon: nd1Lon }, { lat: nd2Lat, lon: nd2Lon }, { unit: km });
        length += distance;
    }
    console.log("Length between nodes: " + length);
    return length;
}

export { hello, fetchNode, fetchWay };