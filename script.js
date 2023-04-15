const TUBES = 12;
const HEIGHT = 4;
const POOL = Array(HEIGHT).fill([...Array(TUBES).keys()]).flat();

const BG_SIZE = 100.0 / HEIGHT;

const COLORS = [
  "maroon", "crimson", "orangered", "darkorange",
  "khaki", "yellowgreen", "green", "lightblue",
  "royalblue", "purple", "mediumvioletred", "violet",
];

var selected = null;

function cb_new() {
  let pool = structuredClone(POOL);
  let tubes = document.getElementsByClassName("tube");

  for (let i = 0; i < tubes.length; ++i) {
    if (i >= TUBES) {
      tubes[i].dataset.state = "";
    }
    else {
      tubes[i].dataset.state = generateState(pool);
    }
  }

  updateColors();
}

function generateState(pool) {
  let state = [];

  for (let i = 0; i < HEIGHT; ++i) {
    const index = Math.floor(Math.random() * pool.length);
    state.push(String.fromCharCode(pool[index]));
    pool.splice(index, 1);
  }

  return state.join("");
}

function generateGradient(state) {
  let chunks = [];

  for (let i = 0; i < HEIGHT; ++i) {
    const start = i * BG_SIZE;
    const end = start + BG_SIZE;

    if (i >= state.length) {
      chunks.push(`var(--color1) ${start}% 100%`);
      break;
    }

    const color = COLORS[state.charCodeAt(i)];
    chunks.push(`${color} ${start}% ${end}%`);
  }

  return `linear-gradient(to top, ${chunks.join(", ")})`;
}

function updateColors() {
  let tubes = document.getElementsByClassName("tube");

  for (let i = 0; i < tubes.length; ++i) {
    tubes[i].style.background = generateGradient(tubes[i].dataset.state)
  }
}

function cb_select(index) {
  let tubes = document.getElementsByClassName("tube");

  if (selected === null) {
    selected = index;
    tubes[index].style.borderColor = "var(--color4)";
  }
  else if (selected === index) {
    selected = null;
    tubes[index].style.borderColor = "var(--color2)";
  }
  else {
    pourTubes(selected, index);
    tubes[selected].style.borderColor = "var(--color2)";
    selected = null;
  }
}

function pourTubes(src, dst) {
  let tubes = document.getElementsByClassName("tube");

  const srcLength = tubes[src].dataset.state.length;
  const dstLength = tubes[dst].dataset.state.length;

  if (srcLength === 0) {
    setLog("Source tube has no liquid to pour!");
    return;
  }

  const srcTop = tubes[src].dataset.state.charCodeAt(srcLength - 1);

  for (var i = srcLength - 1; i > 0 && tubes[src].dataset.state.charCodeAt(i - 1) === srcTop; --i);

  const num = srcLength - i;
  const plurality = num === 1 ? "" : "s";

  if (dstLength > HEIGHT - num) {
    setLog("Destination tube does not have enough space for liquid!");
    return;
  }

  tubes[dst].dataset.state += tubes[src].dataset.state.substr(i);
  tubes[src].dataset.state = tubes[src].dataset.state.substr(0, i);

  setLog(`Poured ${num} layer${plurality} from tube #${src} into tube #${dst}.`);

  updateColors();
}

function setLog(message) {
  document.getElementsByClassName("log")[0].innerText = message;
}
