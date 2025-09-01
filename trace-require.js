const Module = require("module");
const path = require("path");

// Colors (ANSI escape codes)
const colors = {
  reset: "\x1b[0m",
  gray: "\x1b[90m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
};

// Indent helper
function indent(level) {
  return "  ".repeat(level);
}

const originalLoad = Module._load;
let stack = [];

Module._load = function (request, parent, isMain) {
  const resolved = Module._resolveFilename(request, parent);
  const parentFile = parent && parent.filename ? parent.filename : "<root>";
  const depth = stack.length;

  let color = colors.gray;
  let label = resolved;

  if (resolved.includes("/src/")) {
    color = colors.green; // project source
    label = path.relative(process.cwd(), resolved);
  } else if (resolved.includes("node_modules")) {
    color = colors.cyan; // external deps
    label = path.relative(process.cwd(), resolved);
  } else {
    color = colors.yellow; // stdlib / others
  }

  console.log(indent(depth) + color + label + colors.reset);

  stack.push(resolved);
  const result = originalLoad.apply(this, arguments);
  stack.pop();

  return result;
};
