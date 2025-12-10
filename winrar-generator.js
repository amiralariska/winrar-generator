#!/usr/bin/env node
var AdmZip = require("adm-zip");
var chalk = require('chalk');
var gradient = require('gradient-string');
var program = require('commander');
var fs = require('fs');
var path = require('path');
var inquirer = require('inquirer');

var version = program.version(`${chalk.hex('#00f')('0.1.1')}
${gradient('#f0f', '#00f', '#0f0')('Winrar Generator Tool')}`, '-v, --version', 'display the version');
program.parse(process.argv);
console.log(gradient('#f0f', '#00f', '#0f0')('Welcome to Winrar Generator Tool!'));

var winrargenerator = inquirer.prompt([{
    name: 'extractorcompress',
    message: 'What action do you want to perform?',
    type: 'list',
    choices: ["Extract", "Archive folder", "Archive file"]
}]).then(({ extractorcompress }) => {
    var contents = fs.readdirSync(".");
    inquirer.prompt([{
        name: 'inputFilename',
        message: `Which file or folder do you want to ${extractorcompress}?`,
        type: 'list',
        choices: contents,
    }]).then(({ inputFilename }) => {
        if (extractorcompress === "Extract") {
            extract(inputFilename);
        } else {
            inquirer.prompt([{
                name: 'archiveFormat',
                message: 'Which archive format do you want to use?',
                type: 'list',
                choices: [".zip", ".rar"]
            }]).then(({ archiveFormat }) => {
                if (extractorcompress === "Archive folder") {
                    archivefolder(inputFilename, archiveFormat);
                }
                if (extractorcompress === "Archive file") {
                    archivefile(inputFilename, archiveFormat);
                }
            });
        }
    });
});

function extract(filename) {
    const { name } = path.parse(filename);
    const OutputFilename = `${name}`;
    const zip = new AdmZip(`./${filename}`);
    zip.extractAllTo(`./${OutputFilename}`);
    console.log(chalk.green(`Extracted ${filename} to ${OutputFilename}`));
}

function archivefolder(foldername, format) {
    const folderPath = `./${foldername}`;
    if (!fs.lstatSync(folderPath).isDirectory()) {
        console.log(chalk.red(`${foldername} is not a folder.`));
        return;
    }

    const { name } = path.parse(foldername);
    const OutputFilename = `${name}${format}`;
    const zip = new AdmZip();

    // Add the folder's contents to the archive
    zip.addLocalFolder(folderPath, name); // The second argument ensures the folder structure is preserved
    zip.writeZip(`./${OutputFilename}`);

    console.log(chalk.green(`Archived folder ${foldername} to ${OutputFilename}`));
}

function archivefile(filename, format) {
    const filePath = `./${filename}`;
    if (!fs.lstatSync(filePath).isFile()) {
        console.log(chalk.red(`${filename} is not a file.`));
        return;
    }

    const { name } = path.parse(filename);
    const OutputFilename = `${name}${format}`;
    const zip = new AdmZip();

    // Add the file to the archive
    zip.addLocalFile(filePath);
    zip.writeZip(`./${OutputFilename}`);

    console.log(chalk.green(`Archived file ${filename} to ${OutputFilename}`));
}