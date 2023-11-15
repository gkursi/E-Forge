module.exports = {
  mod_name: "Example mod name",
  mod_desc: "Example mod description",
  mod_author: "Me!",
  mod_content: [
    { type: "style", value: "/path/to/style.css", apply: "global" },
    { type: "script", value: "/path/to/script.js", apply: "homepage" },
    /* Supported str's for apply: <the page url>; global; homepage;*/
  ],
};
