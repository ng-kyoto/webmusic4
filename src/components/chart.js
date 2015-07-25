import angular from 'angular';
import d3 from 'd3';

const template = `
<div>
  <div style="position: absolute; left: 10px; top: 10px;">
    <md-button class="md-fab">
      <md-icon>play_arrow</md-icon>
    </md-button>
  </div>
  <div style="position: absolute; left: 0; right: 0; top: 0; bottom: 10px;">
    <svg id="chart" width="100%" height="100%">
      <g class="contents" transform="translate(50,50)">
      </g>
    </svg>
  </div>
</div>
`;

const modName = 'app.components.chart';

class ChartController {
  constructor() {
    const boxWidth = 12,
      boxHeight = 12,
      numCol = 64,
      numRow = 64,
      matrix = new Array(numCol);

    for (let i = 0; i < numCol; ++i) {
      matrix[i] = new Array(numRow);
      for (let j = 0; j < numRow; ++j) {
        matrix[i][j] = {
          mask: Math.random() < 0.1 ? 1 : 0
        };
      }
    }

    const svg = d3.select('#chart');
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
  }
}

angular.module(modName, [])
.controller('ChartController', ChartController)
.config(($routeProvider) => {
  $routeProvider.when('/chart', {
    controller: 'ChartController',
    controllerAs: 'chart',
    template: template
  });
});

export default modName;
