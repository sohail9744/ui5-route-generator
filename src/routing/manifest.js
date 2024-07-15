const fs = require('fs');

function readJsonFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      try {
        const jsonData = JSON.parse(data);
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    });
  });
}

function writeJsonFile(filePath, data) {
  return new Promise((resolve, reject) => {
    const jsonContent = JSON.stringify(data, null, 2);
    fs.writeFile(filePath, jsonContent, 'utf8', (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve('Data updated successfully! On JSON FILE...');
    });
  });
}

function updateRouting(viewName, jsonData, viewDirFiles) {
  let routing = jsonData["sap.ui5"].routing;
  let routes = routing.routes;
  let existViewNumber = viewDirFiles?.filter(file => !file.includes('App'))
  routes.push({
    "name": "Route" + viewName,
    "pattern": existViewNumber.length == 0 ? "" : viewName,
    "target": ["Target" + viewName]
  });

  routing.targets["Target" + viewName] = {
    "viewType": "XML",
    "transition": "slide",
    "clearControlAggregation": false,
    "viewId": viewName,
    "viewName": viewName
  };
  return jsonData;
}

async function updateAndWriteJsonFile(viewName, filePathRoute, viewDirFiles) {
  try {
    let jsonDataRoute = await readJsonFile(filePathRoute);
    jsonDataRoute = await updateRouting(viewName, jsonDataRoute, viewDirFiles);
    const returnValueRute = await writeJsonFile(filePathRoute, jsonDataRoute);
    return returnValueRute
  } catch (error) {
    console.error(error);
  }
}

// Usage
// const returnValue = updateAndWriteJsonFile(filePathManifest2, 'Home232');

module.exports = {
  readJsonFile,
  updateAndWriteJsonFile
};