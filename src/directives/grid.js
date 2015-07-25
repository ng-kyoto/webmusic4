import angular from 'angular';
import d3 from 'd3';

const template = `
<div style="width: 100%; height: 100%">
  <svg id="grid" width="100%" height="100%">
    <g class="contents">
    </g>
  </svg>
</div>
`;

const modName = 'app.directives.grid';

class GridController {
  constructor($scope, numCol, numRow) {
    const boxWidth = 16,
      boxHeight = 16,
      matrix = new Array(numCol);

    for (let i = 0; i < numCol; ++i) {
      matrix[i] = new Array(numRow);
      for (let j = 0; j < numRow; ++j) {
        matrix[i][j] = {
          mask: Math.random() < 0.1 ? 1 : 0
        };
      }
    }

    const svg = d3.select('#grid');
    svg.select('.contents')
      .selectAll('g.col')
      .data(matrix)
      .enter()
      .append('g')
      .classed('col', true)
      .attr({
        transform: (_, i) => `translate(${boxWidth * i},0)`
      })
      .selectAll('g.cell')
      .data((col) => col)
      .enter()
      .append('g')
      .classed('cell', true)
      .append('rect')
      .attr({
        fill: (d) => d.mask ? '#000' : '#ccc',
        x: 1,
        y: 1,
        width: boxWidth - 2,
        height: boxHeight - 2,
        transform: (_, j) => `translate(0,${boxHeight * j})`
      });

    $scope.$on('tick', (e, time) => {
      console.log(time);
      const index = Math.floor(time / 125);
      d3.selectAll('g.col')
        .attr('opacity', 1)
        .filter((_, i) => i === index)
        .attr('opacity', 0.5);
    });

    $scope.$on('note-on', (e, data) => {
      console.log(data);
    });
  }
}

angular.module(modName, []).directive('grid', () => {
  return {
    restrict: 'E',
    template: template,
    scope: {
    },
    controllerAs: 'grid',
    controller: GridController
  };
});

export default modName;
