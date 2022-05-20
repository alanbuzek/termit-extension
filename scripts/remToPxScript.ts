// takes in a css files and replaces all rems it with pixels, need for the extension as we don't wont to rely on the host pages' base font size

// get filesystem module
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

// using the readFileSync() function
// and passing the path to the file
const buffer = fs.readFileSync('public/static/css/bootstrap-termit.css');

// use the toString() method to convert
// Buffer into String
const fileContent = buffer.toString();

console.log(fileContent);

const replacedString = fileContent.replace(
  /(\d*\.?\d+)rem/gm,
  (match, contents) => {
    const result = `${Math.round(parseFloat(contents) * 16)}px`;
    return result;
  }
);

fs.writeFile('replaced.css', replacedString, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('The file was saved!');
});
