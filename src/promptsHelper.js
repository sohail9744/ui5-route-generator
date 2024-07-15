const prompts = require('prompts');
const fs = require('fs');
const path = require('path');

async function promptUser(query, defaultValue = '') {
    const response = await prompts({
        type: 'text',
        name: 'answer',
        message: query,
        initial: defaultValue
    });

    return response.answer.trim();
}

async function promptUserWithArrowKeys(options, defaultIndex = 0, message) {
    const response = await prompts({
        type: 'select',
        name: 'selectedOption',
        message: message,
        choices: options.map((option, index) => ({
            title: option,
            value: option,
            selected: index === defaultIndex
        }))
    });

    return response.selectedOption;
}

async function listFiles(directory) {
    return new Promise((resolve, reject) => {
        fs.readdir(directory, (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        });
    });
}

module.exports = {
    promptUser,
    promptUserWithArrowKeys,
    listFiles
};
