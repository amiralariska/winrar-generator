#!/usr/bin/env node
var AdmZip = require("adm-zip");
var chalk = require('chalk');
var gradient = require('gradient-string');
var program = require('commander');
var fs = require('fs');
var path = require('path');
var inquirer = require('inquirer');

var version = program.version(`${chalk.hex('#00f')('0.0.2')}
${gradient('#f0f', '#00f', '#0f0')('Winrar Generator')}`, '-v, --version', 'display the version');
program.parse(process.argv);
console.log(gradient('#f0f', '#00f', '#0f0')('Welcome to Winrar Generator'));
var winrargenerator = inquirer.prompt([{
	name: 'extractorcompress',
	message: 'what action do you want to perform',
	type: 'list',
	choices: ["Extract", "Archive folder", "Archive file"]
}]).then(({ extractorcompress }) => {
	var contents = fs.readdirSync(".");
	inquirer.prompt([{
		name: 'inputFilename',
		message: `Which file do you want to ${extractorcompress}`,
		type: 'list',
		choices: contents,
	}]).then(({ inputFilename }) => {
		if (extractorcompress === "Extract") extract(inputFilename);
		if (extractorcompress === "Archive folder") archivefolder(inputFilename);
		if (extractorcompress === "Archive file") archivefile(inputFilename);
	})
})
function extract(filename){
	const {name} = path.parse(filename);
	const OutputFilename = `${name}`;
	const zip = new AdmZip(`./${filename}`);
	zip.extractAllTo(`./${OutputFilename}`);
}
function archivefolder(filename){
	const {name} = path.parse(filename);
	const OutputFilename = `${name}.rar`;
	const zip = new AdmZip();
	zip.addLocalFolder(`./${filename}`);
	zip.writeZip(`./${OutputFilename}`);
}
function archivefile(filename){
	const {name} = path.parse(filename);
	const OutputFilename = `${name}.rar`;
	const zip = new AdmZip();
	zip.addLocalFile(`./${filename}`);
	zip.writeZip(`./${OutputFilename}`);
}