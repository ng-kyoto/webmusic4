import angular from 'angular';
import d3 from 'd3';

const template = `
<div style="width: 100%; height: 100%">
  <svg id="grid" width="100%" height="100%">
    <g class="contents" transform="translate(10,0)">
    </g>
  </svg>
</div>
`;

const modName = 'app.directives.grid';

class GridController {
  constructor($scope, numCol, numRow) {
    const boxWidth = 16,
      boxHeight = 16;
    const xScale = d3.scale.linear()
      .domain([0, numCol * 125])
      .range([0, numCol * boxWidth]);


    const svg = d3.select('#grid'),
      contents = svg.select('.contents');
    contents.selectAll('g.col')
      .data(this.grid)
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

    const drag = d3.behavior.drag()
      .on('drag', function () {
        const [x] = d3.mouse(contents.node());
        d3.select(this)
          .attr('transform', `translate(${x},0)`);
        $scope.$emit('update-time', xScale.invert(x));
      });

    contents.append('g')
      .classed('cursor', true)
      .call(drag)
      .append('line')
      .style('cursor', 'move')
      .attr({
        x1: 0,
        y1: 0,
        x2: 0,
        y2: boxHeight * numRow,
        stroke: 'green',
        'stroke-width': 5
      });

    this.svg = svg;
    $scope.$on('tick', (e, time) => {
      const index = Math.floor(time / 125);
      this.svg.selectAll('g.col')
        .attr('opacity', 1)
        .filter((_, i) => i === index)
        .attr('opacity', 0.5);
      this.svg.select('g.cursor')
        .attr('transform', `translate(${xScale(time)},0)`);
    });

    $scope.$on('grid-update', () => {
      console.log('hoge');
      this.svg.selectAll('g.cell rect')
        .attr('fill', (d) => {
          return d.mask ? '#000' : '#ccc';
        });
    });
  }
}

angular.module(modName, []).directive('grid', () => {
  return {
    restrict: 'E',
    template: template,
    scope: {
    },
    bindToController: {
      grid: '='
    },
    controllerAs: 'grid',
    controller: GridController
  };
});

export default modName;
