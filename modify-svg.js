const fs = require('fs');
const path = require('path');
const { parse, stringify } = require('svgson');

const imageDir = './src/editor/images';
const newColor = '#343a40';

const svgSkipList = [
  'opacity.svg'
];

// Function to get all SVG files in a directory recursively
const getAllSvgFiles = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getAllSvgFiles(filePath, fileList);
    } else if (path.extname(file).toLowerCase() === '.svg') {
      fileList.push(filePath);
    }
  });
  return fileList;
};

// Get all SVG files in the image directory
const svgFiles = getAllSvgFiles(imageDir);

// Regular expression to match hex color codes
const hexColorRegex = /#([0-9a-fA-F]{3,6})/g;

// Process each SVG file
svgFiles.forEach(svgFilePath => {
  const fileName = path.basename(svgFilePath);

  // Skip the file if it is in the skip list
  if (svgSkipList.includes(fileName)) {
    console.log('Skipping file:', svgFilePath);
    return;
  }

  // Read the SVG file  
  fs.readFile(svgFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading SVG file:', err);
      return;
    }

    // Parse the SVG content to JSON
    parse(data).then(json => {

      // Modify the SVG elements
      const modifySVG = (node) => {

        // Function to replace hex color codes
        const replaceHexColors = (value) => {
          return value.replace(hexColorRegex, (match) => {

            // these svgs, only replace the yellow
            if (fileName.startsWith('linecap_') || fileName.startsWith('linejoin_')) {
              
              if (match.toLowerCase() == '#f9ba00') return newColor;
              if (match.toLowerCase() == '#f8bb00') return newColor;

              return match;
            }

            return newColor;
          });
        };

        if (typeof node.value === 'string') {
          node.value = replaceHexColors(node.value);
        }

        // Check and modify attributes that may contain hex colors
        for (const [key, value] of Object.entries(node.attributes)) {

          if (typeof value === 'string' && hexColorRegex.test(value)) {
            node.attributes[key] = replaceHexColors(value);
          }
        }

        // Check and modify the style attribute if it exists
        if (node.attributes.style) {
          node.attributes.style = replaceHexColors(node.attributes.style);
        }

        // Recursively modify child nodes
        if (node.children) {
          node.children.forEach(modifySVG);
        }
      };

      modifySVG(json);

      // Convert the JSON back to SVG
      const modifiedSVG = stringify(json);

      // Write the modified SVG to a new file
      //const outputFilePath = path.join(imageDir, 'modified_add_subpath.svg');
      const outputFilePath = svgFilePath;
      fs.writeFile(outputFilePath, modifiedSVG, 'utf8', (err) => {
        if (err) {
          console.error('Error writing modified SVG file:', err);
          return;
        }
        console.log('Modified SVG file saved:', outputFilePath);
      });
    }).catch(err => {
      console.error('Error parsing SVG:', err, svgFilePath);
    });
  });
});
