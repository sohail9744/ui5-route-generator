const fs = require('fs');
const path = require('path');
const { promptUserWithArrowKeys, listFiles } = require('../promptsHelper');
const { readJsonFile } = require('../routing/manifest');
const getFragmentContent = require('./template'); // Import the function to get fragment content

const redText = (text) => `\x1b[31m${text}\x1b[0m`;
const greenText = (text) => `\x1b[32m${text}\x1b[0m`;

//Mohammad Sohail: You can un comment and see the paths
// console.log('Route Directory Path :)', path.resolve(__dirname, '../../..')) // development
// const basePath = path.resolve(__dirname, '../../../..'); // development
const basePath = path.resolve(__dirname, '../../..'); // production

const controllerPath = path.join(basePath, 'webapp', 'controller');
const fragmentPath = path.join(basePath, 'webapp', 'fragment'); // Path for fragment directory
const manifestPath = path.join(basePath, 'webapp', 'manifest.json');

async function setupFragment() {
    const controllerFiles = await listFiles(controllerPath);
    const message = "Please select a file:"
    const selController = await promptUserWithArrowKeys(controllerFiles, 0, message);

    const fragmentFilePath = path.join(fragmentPath, `${selController?.split('.')[0]}.fragment.xml`);

    // Create the fragment directory if it doesn't exist
    if (!fs.existsSync(fragmentPath)) {
        fs.mkdirSync(fragmentPath, { recursive: true });
    }

    // Check if the fragment file already exists
    if (fs.existsSync(fragmentFilePath)) {
        console.error(redText(`Fragment file already exists!! -> '${fragmentFilePath}'`));
    } else {
        try {
            // Get the fragment content and write it to the file
            const fragmentContent = getFragmentContent(selController);
            fs.writeFileSync(fragmentFilePath, fragmentContent);
            console.log(greenText(`Fragment file added successfully!! -> '${fragmentFilePath}'`));

            // Add the method to open the fragment in the selected controller
            const controllerFilePath = path.join(controllerPath, selController);

            let manifestJson = await readJsonFile(manifestPath);
            const appId = manifestJson['sap.app']['id'];

            if (!appId) {
                console.error(redText(`Could not find 'appId' in manifest.json.`));
                return;
            }

            addOpenFragmentMethod(controllerFilePath, selController, appId);
            console.log(greenText(`Fragment added successfully! Use the 'onOpenFragment()' function in '${controllerFilePath}' to open it.`));
        } catch (error) {
            console.error(redText(`Error setting up fragment: ${error.message}`));
        }
    }
}

function addOpenFragmentMethod(controllerFilePath, viewName, appId) {
    const controllerName = viewName.split('.')[0];
    const fragmentPath = `${appId}.fragment.${controllerName}`;

    const openFragmentTS = `
    public onOpenFragment(): void {
        let fragmentDialog;
        if (!fragmentDialog) {
            /**
             * ↓ Import the library for Fragment ↓
             * import Fragment from "sap/ui/core/Fragment"; 
             * import Dialog from "sap/m/Dialog";
             */
            fragmentDialog = Fragment.load({
                id: this.getView()?.getId(),
                name: "${fragmentPath}",
                controller: this
            }).then((oDialog) => {
                (oDialog as Dialog).open();
            });
        }
    }
`;

    const openFragmentJS = `
    onOpenFragment: function() {
        if (!this._${controllerName}) {
            this._${controllerName} = Fragment.load({
                /**
                 * ↓ Import the library for Fragment ↓
                 * "sap/ui/core/Fragment"; 
                 * "sap/m/Dialog";
                 */
                id: this.getView()?.getId(),
                name: "${fragmentPath}",
                controller: this
            }).then(function (oDialog) {
                oDialog.open();
            });
        }
    },
`;

    try {
        let controllerContent = fs.readFileSync(controllerFilePath, 'utf8');

        // Check for TypeScript controller import
        const isTypeScript = controllerFilePath.endsWith('.ts');

        // Check if Controller.extend exists or use TypeScript approach
        let extendIndex = controllerContent.indexOf('Controller.extend');
        if (extendIndex === -1 && isTypeScript) {
            // TypeScript scenario: Insert after import statement and class declaration
            extendIndex = controllerContent.indexOf('class');
            if (extendIndex !== -1) {
                const classDeclarationEnd = controllerContent.indexOf('{', extendIndex);
                if (classDeclarationEnd !== -1) {
                    controllerContent = `${controllerContent.slice(0, classDeclarationEnd + 1)}${openFragmentTS}\n${controllerContent.slice(classDeclarationEnd + 1)}`;
                } else {
                    console.error(redText(`Cannot find class declaration '{' in ${controllerFilePath}`));
                    return;
                }
            } else {
                console.error(redText(`Cannot find class declaration 'class' in ${controllerFilePath}`));
                return;
            }
        } else if (extendIndex !== -1) {
            // JavaScript scenario: Insert before the opening bracket '{' after Controller.extend
            const insertPosition = controllerContent.indexOf('{', extendIndex);
            if (insertPosition !== -1) {
                controllerContent = `${controllerContent.slice(0, insertPosition + 1)}${openFragmentJS}${controllerContent.slice(insertPosition + 1)}`;
            } else {
                console.error(redText(`Cannot find opening bracket '{' after Controller.extend in ${controllerFilePath}`));
                return;
            }
        } else {
            console.error(redText(`Cannot find BaseController.extend in ${controllerFilePath}. Consider adding import statement and class extension for TypeScript.`));
            return;
        }

        // Write back the modified content to the controller file
        fs.writeFileSync(controllerFilePath, controllerContent);
    } catch (error) {
        console.error(redText(`Error writing to ${controllerFilePath}: ${error.message}`));
    }
}

module.exports = {
    setupFragment
};
