module.exports = (fileName, appId) => {
  return `
sap.ui.define([
  "sap/ui/core/mvc/Controller"
],
function (Controller) {
  "use strict";

  return Controller.extend("${appId}.controller.${fileName}", {
      onInit: function () {
        
      }
  });
});
`;
};
