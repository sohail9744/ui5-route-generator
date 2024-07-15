# Auto Generates SAPUI5 Routing and Fragment Setup

> :wave: This is a **community project** and there is no official support for this package! Feel free to use it, open issues, contribute, and help answering questions.
>  
A utility npm package for generating routes and setting up fragments in SAPUI5 applications.

## Features

- Automatically generates SAPUI5 routes.
- Automatically generates Fragment for your projects and add a onOpenFragment() function in selected controller to open it ;)

## Contribution

> Please check [CONTRIBUTING.MD](https://github.com/sohail9744/ui5-route-generator/blob/main/CONTRIBUTING.MD) file everything is step by step :) don't worry! you can do it

## [Installation](https://github.com/sohail9744/ui5-route-generator/blob/main/CONTRIBUTING.MD)

Install `ui5-route-generator` as a development dependency using npm:

```bash
npm install ui5-route-generator -D
```
[OR]
```bash
npm install ui5-route-generator --save --dev
```

> :warning: **Tooling Compatibility**
The tool will work when you open the project terminal with the path set to the project root directory, or else it will not work!

cd /path/to/pmProject
user: pmProject $ npm run ui5-route-generator

# Generating Routes

```bash
npm run ui5-route-generator
```
## Output on your Terminal

```bash
? Please select an option: › - Use arrow-keys. Return to submit.
❯   create route
    Fragment Setup

? View & Controller Name? › View4
? Do you want to use TypeScript? (y/n):  › y

Controller file added successfully!! -> '/home/user/projects/project1/webapp/controller/View4.controller.ts'
View file added successfully!! -> '/home/user/projects/project1/webapp/view/View4.view.xml'
```

# Generating Fragment

```bash
npm run ui5-route-generator
```
## Output on your Terminal

```bash
? Please select an option: › - Use arrow-keys. Return to submit.
    create route
❯   Fragment Setup

? Please select a file: › `// List of controllers user need to select`
❯   App.controller.js
    View1.controller.js
    View3.controller.ts
    View4.controller.ts
    helper.controller.js
    wasim.controller.js

Fragment file added successfully!! -> '/home/user/projects/project1/webapp/fragment/App.fragment.xml'
Fragment added successfully! Use the 'onOpenFragment()' function in '/home/user/projects/project1/webapp/controller/App.controller.js' to open it.
```

## 📢 Call for Community Support
> 🚀 This project relies on the #JavaScript and developer #community for support and contributions. As there is no official support for this package, we need your help to make it better! It's time to contribute! 💪

## Contributing
Contributions are welcome! Please read the Contribution Guidelines for details on how to contribute to this project. Whether it's reporting a bug, suggesting new features, or submitting a pull request, your input is invaluable.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

### Author
- Acknowledgements
- Built with ❤️ by [Sohail Khan](https://www.linkedin.com/in/sohail9744/)
- Maintainer: [Sohail Khan](https://www.linkedin.com/in/sohail9744/) + #Community
- Inspired by the need to simplify SAPUI5 project setup
