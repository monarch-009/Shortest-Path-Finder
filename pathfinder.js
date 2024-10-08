let grid = [];
let mouseIsPressed = false;
let startNode, finishNode;

document.addEventListener('DOMContentLoaded', () => {
    addEventListeners();
});

function addEventListeners() {
    document.getElementById('createGridButton').addEventListener('click', createGrid);
    document.getElementById('visualizeButton').addEventListener('click', visualizeDijkstra);
    document.getElementById('resetButton').addEventListener('click', resetGrid);
}

function createGrid() {
    const gridSize = parseInt(document.getElementById('gridSize').value);
    const startX = parseInt(document.getElementById('startX').value);
    const startY = parseInt(document.getElementById('startY').value);
    const endX = parseInt(document.getElementById('endX').value);
    const endY = parseInt(document.getElementById('endY').value);

    if (startX >= gridSize || startY >= gridSize || endX >= gridSize || endY >= gridSize) {
        alert('Start and end coordinates must be within the grid size!');
        return;
    }

    const gridElement = document.getElementById('grid');
    gridElement.innerHTML = '';
    gridElement.style.gridTemplateColumns = `repeat(${gridSize}, 20px)`;
    grid = [];

    for (let row = 0; row < gridSize; row++) {
        const currentRow = [];
        for (let col = 0; col < gridSize; col++) {
            const node = createNode(col, row, startX, startY, endX, endY);
            currentRow.push(node);
            const nodeElement = createNodeElement(node);
            gridElement.appendChild(nodeElement);
        }
        grid.push(currentRow);
    }

    startNode = grid[startY][startX];
    finishNode = grid[endY][endX];
}

function createNode(col, row, startX, startY, endX, endY) {
    return {
        col,
        row,
        isStart: col === startX && row === startY,
        isFinish: col === endX && row === endY,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        previousNode: null,
    };
}

function createNodeElement(node) {
    const nodeElement = document.createElement('div');
    nodeElement.id = `node-${node.row}-${node.col}`;
    nodeElement.className = 'node';
    if (node.isStart) nodeElement.classList.add('node-start');
    if (node.isFinish) nodeElement.classList.add('node-finish');
    
    nodeElement.addEventListener('mousedown', () => handleMouseDown(node));
    nodeElement.addEventListener('mouseenter', () => handleMouseEnter(node));
    nodeElement.addEventListener('mouseup', handleMouseUp);
    
    return nodeElement;
}

function handleMouseDown(node) {
    if (node.isStart || node.isFinish) return;
    mouseIsPressed = true;
    toggleWall(node);
}

function handleMouseEnter(node) {
    if (!mouseIsPressed || node.isStart || node.isFinish) return;
    toggleWall(node);
}

function handleMouseUp() {
    mouseIsPressed = false;
}

function toggleWall(node) {
    node.isWall = !node.isWall;
    const nodeElement = document.getElementById(`node-${node.row}-${node.col}`);
    if (nodeElement) {
        nodeElement.classList.toggle('node-wall');
    }
}

function visualizeDijkstra() {
    if (!startNode || !finishNode) {
        alert('Please create the grid first!');
        return;
    }
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
}

function animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
        if (i === visitedNodesInOrder.length) {
            setTimeout(() => {
                animateShortestPath(nodesInShortestPathOrder);
            }, 10 * i);
            return;
        }
        setTimeout(() => {
            const node = visitedNodesInOrder[i];
            const nodeElement = document.getElementById(`node-${node.row}-${node.col}`);
            if (nodeElement && !node.isStart && !node.isFinish) {
                nodeElement.classList.add('node-visited');
            }
        }, 10 * i);
    }
}

function animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
        setTimeout(() => {
            const node = nodesInShortestPathOrder[i];
            const nodeElement = document.getElementById(`node-${node.row}-${node.col}`);
            if (nodeElement && !node.isStart && !node.isFinish) {
                nodeElement.classList.add('node-shortest-path');
            }
        }, 50 * i);
    }
}

function resetGrid() {
    const gridElement = document.getElementById('grid');
    gridElement.innerHTML = '';
    grid = [];
    startNode = null;
    finishNode = null;
}