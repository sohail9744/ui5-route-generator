// content.js
module.exports = (fileName, appId) => {
    return `import Controller from "sap/ui/core/mvc/Controller";

    /**
     * @namespace ${appId}.controller.${fileName}
     */
    export default class ${fileName} extends Controller {
    
        /*eslint-disable @typescript-eslint/no-empty-function*/
        public onInit(): void {
    
        }
    }
      `;
  };
  