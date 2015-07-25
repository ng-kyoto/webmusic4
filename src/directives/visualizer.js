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
  const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
  const light = new THREE.PointLight( 0x404040, 3, 1000 );
  light.position.z = 3;

  const renderer = new THREE.WebGLRenderer();

  renderer.setSize(width, height);
  wrapper.appendChild(renderer.domElement);

  //const geometry = new THREE.BoxGeometry(1, 1, 1);
  const geometry = new THREE.IcosahedronGeometry(1,1);
  //const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
  const material = new THREE.MeshLambertMaterial( {
                        color: new THREE.Color( Math.random(), Math.random() * 0.5, Math.random() ),
                        blending: THREE.AdditiveBlending,
                        depthTest: false,
                        shading: THREE.FlatShading,
                        transparent: true
                    } );


  // columns
  const numCol = 64;
  const numRow = 40;
  const group = new THREE.Group();

  for (var ii = 0; ii < numRow; ++ii) {
    for (var jj = 0; jj < numCol; ++jj) {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.y = 1 * jj - 50;
      mesh.position.x = -20 + 1 * ii ;
      mesh.position.z = -5;
      group.add(mesh);
    }
  }
  scene.add(group);

  //scene.add(cube);
  scene.add(light);

  camera.position.z = 5;

  const render = () => {
    $window.requestAnimationFrame(render);

    //cube.rotation.x += 0.1;
    //cube.rotation.y += 0.1;

    light.color.setHex(0xffffff );
    light.position.x = Math.random() * 800 - 400;
    light.position.y = Math.random() * 800 - 400;
    light.position.z = Math.random() * 800 - 400;

    for (var ii = 0; ii < group.children.length; ++ii) {
      //group.add(mesh);
      group.children[0].position.x = Math.random();
    } 

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
