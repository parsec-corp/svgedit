const fs = require('fs');
const path = require('path');
const { parse, stringify } = require('svgson');

const imageDir = './src/editor/images';
const newColor = '#eeeef2';

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

const hexColors = new Set();

// Regular expression to match hex color codes
const hexColorRegex = /#([0-9a-fA-F]{3,6})/g;
// Function to log hex color codes
const logHexColors = (value) => {
  const matches = value.match(hexColorRegex);
  if (matches) {
    matches.forEach(color => {
      hexColors.add(color);
    });
  }
};

// Modify the SVG elements
const modifySVG = (node) => {

  // Function to replace hex color codes
  const replaceHexColors = (value) => {
    return value.replace(hexColorRegex, (match) => {
      return newColor;
    });
  };

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

// Process each SVG file
svgFiles.forEach(svgFilePath => {

  // Read the SVG file
  //const data = fs.readFileSync(svgFilePath, 'utf8');

  // Log hex color codes found in the SVG string
  //logHexColors(data);

  //console.log(svgFilePath); // TODO
  //return;

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
            return newColor;
          });
        };

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

// Log all found hex colors
//console.log('Found hex colors:', Array.from(hexColors));
