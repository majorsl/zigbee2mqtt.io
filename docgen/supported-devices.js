/**
 * This script generates the supported devices page.
 */

const devices = require('zigbee2mqtt/node_modules/zigbee-shepherd-converters').devices;
const replaceByDash = [new RegExp('/', 'g'), new RegExp(':', 'g'), new RegExp(' ', 'g')];
const imageBase = '../images/devices/';

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

const vendorsCount = devices.map((d) => d.vendor).filter(onlyUnique).length;

let template = `# Supported devices

*NOTE: This file has been generated, do not edit this file manually!*

Currently **${devices.length}** devices are supported from **${vendorsCount}** different vendors.

In case you own a Zigbee device which is **NOT** listed here, please see
[How to support new devices](https://koenkk.github.io/zigbee2mqtt/how_tos/how_to_support_new_devices.html).

[DEVICES]
`;

const generateTable = (devices) => {
    let text = '';
    text += '| Model | Description | Picture |\n';
    text += '| ------------- | ------------- | -------------------------- |\n';
    devices = new Map(devices.map((d) => [d.model, d]));
    devices.forEach((d) => {
        let image = d.model;
        replaceByDash.forEach((r) => image = image.replace(r, '-'));
        image = imageBase + `${image}.jpg`;
        text += `| ${d.model} | ${d.vendor} ${d.description} (${d.supports}) | ![${image}](${image}) |\n`;
    });

    return text;
};

// Generated devices text
let devicesText = '';
const vendors = Array.from(new Set(devices.map((d) => d.vendor)));
vendors.sort();
vendors.forEach((vendor) => {
    devicesText += `### ${vendor}\n\n`;
    devicesText += generateTable(devices.filter((d) => d.vendor === vendor));
    devicesText += '\n';
});

// Insert into template
template = template.replace('[DEVICES]', devicesText);

module.exports = template;
