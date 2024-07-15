const fs = require('fs');
const path = require('path');

// Function to update package.json
function updatePackageJson() {
    try {
        console.log('Directory', __dirname)
        const packageJsonPath = path.resolve(__dirname, '../../../', 'package.json'); // Adjust path as needed
        console.log('Directory in package.json', packageJsonPath)
        const packageJson = require(packageJsonPath);

        // Modify scripts section to add your script
        if (!packageJson.scripts) {
            packageJson.scripts = {};
        }
        packageJson.scripts['ui5-route-generator'] = 'node ./node_modules/ui5-route-generator/dist/bundle.js';

        // Write back to package.json
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    } catch (error) {

    }
}

updatePackageJson();
