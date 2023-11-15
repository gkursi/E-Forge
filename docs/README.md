# E-Forge docs

## Basic mods

<p> A basic mod is a pure CSS file. (a diff-page-diff-style thing is coming soon)</p>

## Advanced mods

<p> An advanced mod is a file ending with <code>.mod</code>.
This file can contain multiple styles (for each page / global), scripts (javascript) ~~and images~~. **Notice**: You should only download a <code>.mod</code> file from trusted sources, as it can contain things like keyloggers, password stealers and other bad things.

- ### Getting started
  - **INFO**: The `apply` tag is currently **NOT** supported, as i am lazy. 
  - The first thing you need to do is create a folder with the [mod.js](example-mod.js) file inside.
  - Then, delete all data from "mod_content" and the mod should now work.
  - To export it, compress it as a .zip file and rename it to .mod
  - To add scripts / styles, just add those to the folder and register them under wmod_content.
    - For more info on wmod.js, look [here](wmod-js/README.md).

  - Now, make a `scripts` folder and make a new file inside: `main.js`. Inside of this file, add this line of code: `console.log("hello, world!")`. This will print "Hello, world!" to the console.
  - Then, go back to the mod.js file and add a new line in the mod_content array: `{ type: "script", value: "./scripts/main.js", apply: "global"}`. This will run the script every time a new page is loaded.
  - Now, if you package the mod, run it and press `Ctrl+SHIFT+I`, you will see `DevTools`. In DevTools, navigate to console and then look for "Hello, world!". If you see that, then you have made your first mod!
