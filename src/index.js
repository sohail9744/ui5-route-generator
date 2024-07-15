const fs = require('fs-extra');
const path = require('path');
const { exit } = require('process');
const getJSController = require('./routing/controller');
const getTSController = require('./routing/controllerTs');
const getViewContent = require('./routing/view');
const { readJsonFile, updateAndWriteJsonFile } = require('./routing/manifest');
const { promptUser, promptUserWithArrowKeys } = require('./promptsHelper');
const { setupFragment } = require('./fragment');

const redText = (text) => `\x1b[31m${text}\x1b[0m`;
const greenText = (text) => `\x1b[32m${text}\x1b[0m`;


//Mohammad Sohail: if you want to see path you can comment out

// console.log('Fragment Directory Path :)', path.resolve(__dirname, '../../../')) //development mode
// const basePath = path.resolve(__dirname, '../../../'); // development mode
const basePath = path.resolve(__dirname, '../../../'); // production

const controllerPath = path.join(basePath, 'webapp', 'controller');
const viewPath = path.join(basePath, 'webapp', 'view');
const manifestPath = path.join(basePath, 'webapp', 'manifest.json');


async function getManifestJson(manifestPath) {
    try {
        return await readJsonFile(manifestPath);
    } catch (error) {
        console.error(redText(`Manifest file is not there!!`));
        throw error; // Throw the error to be caught by the caller
    }
}

async function main() {
    const options = ['Create Route', 'Fragment Setup'];
    let message = "Please select an option:"
    const selectedOption = await promptUserWithArrowKeys(options, 0, message);

    switch (selectedOption?.trim()?.toLowerCase()) {
        case 'create route':
            await createRoute();
            break;
        case 'formatter setup':
            console.log('Formatter setup in progress');
            break;
        case 'fragment setup':
            await setupFragment();
            break;
        default:
            console.error(redText('Invalid option selected.'));
            break;
    }
}

async function createRoute() {
    const fileName = await promptUser('View & Controller Name?', 'helper');
    if (!fileName) {
        console.error(redText("please write the file name -> 'npm run create <fileName>'"));
        exit(1); // Exit the script with an error code
    }

    const useTypeScript = await promptUser('Do you want to use TypeScript? (y/n): ', 'y') === 'y';
    const fileExtension = useTypeScript ? 'ts' : 'js';
    const otherExtension = useTypeScript ? 'js' : 'ts';

    let manifestJson = await getManifestJson(manifestPath);
    const appId = manifestJson['sap.app']['id'];

    const controllerFilePath = path.join(controllerPath, `${fileName}.controller.${fileExtension}`);
    const otherControllerFilePath = path.join(controllerPath, `${fileName}.controller.${otherExtension}`);
    const viewFilePath = path.join(viewPath, `${fileName}.view.xml`);

    // Create the directories if they don't exist
    if (!fs.existsSync(controllerPath)) {
        fs.mkdirSync(controllerPath, { recursive: true });
    }

    if (!fs.existsSync(viewPath)) {
        fs.mkdirSync(viewPath, { recursive: true });
    }

    // Write the content to the dynamically created JavaScript/TypeScript files in the specified directories
    // Check if the controller file already exists
    if (fs.existsSync(controllerFilePath) || fs.existsSync(otherControllerFilePath)) {
        console.error(redText(`Controller file already exists.`));
    } else {
        // Get the content from content.js by calling the exported function and passing the file name
        const controllerContent = useTypeScript ? getTSController(fileName, appId) : getJSController(fileName, appId);

        fs.writeFileSync(controllerFilePath, controllerContent);
        console.log(greenText(`Controller file added successfully!! -> '${controllerFilePath}'`));
    }

    // Check if the view file already exists
    if (fs.existsSync(viewFilePath)) {
        console.error(redText(`View file already exists!! -> '${viewFilePath}'`));
    } else {
        const viewDirFiles = await listFiles(viewPath);
        updateAndWriteJsonFile(fileName, manifestPath, viewDirFiles);
        // Get the view content and write it to the file
        const viewContent = getViewContent(fileName, appId);
        fs.writeFileSync(viewFilePath, viewContent);
        console.log(greenText(`View file added successfully!! -> '${viewFilePath}'`));
    }
}

function listFiles(directoryPath) {
    return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(files);
        });
    });
}

main();
