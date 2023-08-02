let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
];

let currentPlayer = 'circle';

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontale Reihen
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertikale Reihen
    [0, 4, 8], [2, 4, 6] // Diagonale Reihen
];


function init() {
    render();
}


function render() {
    const container = document.getElementById("content");
    let tableHTML = "<table>";
  
    for (let i = 0; i < 3; i++) {
      tableHTML += "<tr>";
      for (let j = 0; j < 3; j++) {
        const index = i * 3 + j;
        tableHTML += `<td onclick="handleClick(this, ${index})" class="${getFieldClass(index)}">${getFieldHTML(index)}</td>`;
      }
      tableHTML += "</tr>";
    }
  
    tableHTML += "</table>";
    container.innerHTML = tableHTML;
}


function restartGame() {
    fields = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
    ];

    render();
}
  

function getFieldHTML(index) {
    if (fields[index] === "circle") {
      return generateCircleSVG();
    } else if (fields[index] === "cross") {
      return generateCrossSVG();
    } else {
      return "";
    }
}
 

function getFieldClass(index) {
    return fields[index] ? "filled" : "";
}
  

function handleClick(cell, index) {
    if (fields[index] === null) {
      fields[index] = currentPlayer;
      cell.innerHTML = currentPlayer === 'circle' ? generateCircleSVG() : generateCrossSVG();
      cell.onclick = null;
      currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
    }

    if (isWinningMove()) {
        const winningLine = getWinningCombination();
        drawWinningLine(winningLine);
    }
}


function isWinningMove() {
    return fields.every((field) => field !== null) || getWinningCombination() !== null;
}

  
function getWinningCombination() {
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (fields[a] && fields[a] === fields[b] && fields[b] === fields[c]) {
        return combination;
      }
    }
    return [];
}


function drawWinningLine(line) {
    
    const svgContainer = document.getElementById("svg-container");
    svgContainer.innerHTML = ""; // Leert den vorherigen Inhalt des SVG-Containers
  
    if (line.length !== 3) {
      return;
    }
  
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("viewBox", "0 0 210 210");
    svg.style.position = "absolute";
    svg.style.width = "100%";
    svg.style.height = "100%";
  
    const [x1, y1] = getCoordinates(line[0]);
    const [x2, y2] = getCoordinates(line[2]);
  
    const lineElement = document.createElementNS("http://www.w3.org/2000/svg", "line");
    lineElement.setAttribute("x1", x1);
    lineElement.setAttribute("y1", y1);
    lineElement.setAttribute("x2", x2);
    lineElement.setAttribute("y2", y2);
    lineElement.setAttribute("class", "winning-line");
    lineElement.setAttribute("stroke-width", "3");
  
    svg.appendChild(lineElement);
    document.getElementById("content").appendChild(svg);
}

  
function getCoordinates(index) {
    const row = Math.floor(index / 3);
    const col = index % 3;
    const x = (col + 0.5) * 70;
    const y = (row + 0.5) * 70;
    return [x, y];
}
  

function removeClickHandler(index) {
    const td = document.getElementById(`field_${index}`);
    td.removeAttribute('onclick');
}


function generateCircleSVG() {
    const color = '#00B0EF';
    const width = 70;
    const height = 70;

    return `<svg width="${width}" height="${height}">
              <circle cx="35" cy="35" r="30" stroke="${color}" stroke-width="5" fill="none">
                <animate attributeName="stroke-dasharray" from="0 188.5" to="188.5 0" dur="0.45s" fill="freeze" />
              </circle>
            </svg>`;
}


function generateCrossSVG() {
    const color = '#FFC000';
    const width = 70;
    const height = 70;
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 70" width="${width}" height="${height}">
        <style>
          @keyframes fillAnimation {
            0% {
              stroke-dasharray: 0, 75;
            }
            50% {
              stroke-dasharray: 37.5, 37.5;
            }
            100% {
              stroke-dasharray: 75, 0;
            }
          }
          
          line {
            stroke: ${color};
            stroke-width: 5;
            stroke-dasharray: 75, 0;
            animation: fillAnimation 0.45s forwards;
          }

        </style>
        <line x1="10" y1="10" x2="60" y2="60"></line>
        <line x1="60" y1="10" x2="10" y2="60"></line>
      </svg>
    `;
}
  