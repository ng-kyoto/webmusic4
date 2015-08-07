const toMatrix = (grid, numCol, numRow) => {
  const matrix = new Array(numCol);
  for (let i = 0; i < numCol; ++i) {
    matrix[i] = new Array(numRow);
    for (let j = 0; j < numRow; ++j) {
      matrix[i][j] = {
        col: i,
        row: j,
        empty: true
      };
    }
  }
  for (const cell of grid) {
    matrix[cell.col][cell.row] = cell;
  }
  return matrix;
};

export default toMatrix;
