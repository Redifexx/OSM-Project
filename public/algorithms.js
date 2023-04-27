const hello = 'hello!';
//Retrieve all nodeIDs from Database and store in set
//Create tables
//Run chosen 

const osmFetchNode = "https://api.openstreetmap.org/api/0.6/node/";
function fetchNode(id)
{
    return fetch(osmFetchNode + id, {
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