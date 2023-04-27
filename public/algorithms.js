import { loadSetS } from "./server.js";

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


function dAlgo(nodeSet)
{
    console.log("DALGO START"); 
    nodeSet.forEach(function(value) {
        console.log("DALGO: " + value);
        });
}


export { hello, fetchNode, fetchWay };