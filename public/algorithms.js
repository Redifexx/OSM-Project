const hello = 'hello!';
//Retrieve all nodeIDs from Database and store in set
//Create tables
//Run chosen 

const osmFetchNode = "https://api.openstreetmap.org/api/0.6/node/";
var nodes = {
    source: null,
    destintation: null
};
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
        return result;
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

export { hello, fetchNode, fetchWay };