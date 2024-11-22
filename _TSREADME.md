# Build & Deploy
- Open **Terminal** window in Visual Studio. `View > Terminal`
- Install packages by running 

        npm i
- Modify SVG files so that the color scheme is correct
  - Open file *modify-svg.js*
  - Change **newColor** as needed

        const newColor = '#343a40';
  - Run the svg color update command in the terminal which will scan all svg files in the images folder and replace hex colors as needed

        npm run modify-svg
- Run build to get release files

        npm run build
- After running the build, a new `dist` folder will be created with the release build files. Copy the following:
  - Copy folder *dist\editor\components* =>  *Ts\Scripts\svgedit\components*
  - Copy folder *dist\editor\extensions* =>  *Ts\Scripts\svgedit\extensions*
  - Copy folder *dist\editor\images* =>  *Ts\Scripts\svgedit\images*
  - Copy files *dist\editor\SvgEditor.js*, *dist\editor\SvgEditor.js* => *Ts\Scripts\svgedit*

**IMPORTANT DO NOT** check in the updated SVG files. Undo the changes. The reason for this is some of the code in modify svg code needs to scan for specify colors when replacing. 
