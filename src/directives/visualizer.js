import angular from 'angular';
import THREE from 'three';

const template = `
<div id="visualizer" style="width: 100%; height: 100%">
</div>
`;

const initGL = ($window) => {
  const wrapper = $window.document.getElementById('visualizer');
  console.log(wrapper);
  const width = wrapper.clientWidth;
  const height = wrapper.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

  const renderer = new THREE.WebGLRenderer();

  renderer.setSize(width, height);
  wrapper.appendChild(renderer.domElement);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 5;

  const render = () => {
    $window.requestAnimationFrame(render);

    cube.rotation.x += 0.1;
    cube.rotation.y += 0.1;

    renderer.render(scene, camera);
  };

  render();
};

class VisualizerController {
  constructor($scope, $window) {
    initGL($window);

    $scope.$on('tick', () => {
    });
    $scope.$on('note-on', () => {
    });
    $scope.$on('note-off', () => {
    });
  }
}

const modName = 'app.directives.visualizer';

angular.module(modName, []).directive('visualizer', () => {
  return {
    restrict: 'E',
    template: template,
    scope: {
    },
    controllerAs: 'visualizer',
    controller: VisualizerController
  };
});

export default modName;
