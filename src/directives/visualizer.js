import angular from 'angular';
import THREE from 'three';

const template = `
<div id="visualizer" style="width: 100%; height: 100%">
</div>
`;
const initGL = ($window) => {
  
};

class VisualizerController {
  constructor($scope, $window) {
    let accelaration = 0;
    let targetAccelaration = 0;

    const wrapper = $window.document.getElementById('visualizer');
    const width = wrapper.clientWidth;
    const height = wrapper.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const light = new THREE.PointLight( 0xffffff, 3, 1000 );
    const group = new THREE.Group();

    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(width, height);
    wrapper.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(1,0);
    
    //const cube = new THREE.Mesh(geometry, material);
    const numCol = 64;
    const numRow = 40;
    const radius = 100;
    let s = 0;
    let t = 0;
    let divNum = 180;
    while(s <= divNum) {
      const material = new THREE.MeshLambertMaterial( {
                        //color: new THREE.Color( Math.random(), Math.random() * 0.5, Math.random() ),
                        color: new THREE.Color( 0.2,0.2,0.2 ),
                        blending: THREE.AdditiveBlending,
                        depthTest: false,
                        shading: THREE.FlatShading,
                        transparent: true
                    } );
      const mesh = new THREE.Mesh(geometry, material);
      var radS = s * Math.PI / 180;
      var radT = t * Math.PI / 180;
      mesh.position.x = radius * Math.sin(radS) * Math.cos(radT) /50;
      mesh.position.y = radius * Math.sin(radS) * Math.sin(radT) /50;
      mesh.position.z = radius * Math.cos(radS) /50;
      mesh.scale.x = 0.1;
      mesh.scale.y = 0.1;
      mesh.scale.z = 0.1;
      mesh.visible = true;
      group.add(mesh);
      s++;
      t+=30;
    }
    scene.add(group);
    scene.add(light);

    camera.position.z = 3;

    let cameraRotateRad = 0;
    const diff = 0.1;
    const render = () => {
      $window.requestAnimationFrame(render);

      //cube.rotation.x += 0.1;
      //cube.rotation.y += 0.1;
      camera.position.x = 3*Math.sin(cameraRotateRad);
      // + 3 * accelaration);
      camera.position.y = 3*Math.cos(cameraRotateRad);
      // + 3 * accelaration);
      //camera.position.z = 3*Math.cos(cameraRotateRad);
      // + 3 * accelaration);
      cameraRotateRad += 0.03;

      //group.rotateOnAxis()

      /*if (accelaration < targetAccelaration) {
        accelaration += 0.1;
      } else {
        targetAccelaration = 0;
        accelaration -= 0.1;
      }*/


      /*else {
        targetAccelaration = 0;
      }*/
      //camera.position.y += 0.1;
      //camera.position.z += 0.1;
      camera.lookAt(new THREE.Vector3(0,0,0));

      renderer.render(scene, camera);
    };

    render();

    let colors = [
        {r:0.33, g:0, b:0},
        {r:0, g:0.33, b:0},
        {r:0, g:0, b:0.33},
        {r:0.33, b:0.33, b:0.33}
      ];
    $scope.$on('tick', (e, time) => {
      console.log(time);
      const index = Math.floor(time / 125);
    });

    $scope.$on('note-on', (e, data) => {
      // light flash
      //light.color.setHex( Math.random() * 0xffffff );
      //light.position.x = Math.random() * 800 - 400;
      //light.position.y = Math.random() * 800 - 400;
      //light.position.z = Math.random() * 800 - 400;
      //console.log(data);

      let colInd = data.colIndex;
      for (let i = 0; i < data.notes.length; ++i) {
        console.log("on col"+colInd + "row:"+data.notes[i].rowIndex + "ch:" + data.notes[i].channel);
        let rowInd = data.notes[i].rowIndex;
        let pointNum = (colInd*40 + rowInd) % 180;
        let ch = data.notes[i].channel % 4;
        //console.log("p:"+pointNum);
        group.children[pointNum].material.color.r += colors[ch].r;
        group.children[pointNum].material.color.g += colors[ch].g;
        group.children[pointNum].material.color.b += colors[ch].b;
      }
      targetAccelaration += data.notes.length;

    });

    $scope.$on('note-off', (e, data) => {
      //console.log(data);
      let colInd = data.colIndex;
      for (let i = 0; i < data.notes.length; ++i) {
        console.log("off col"+colInd + "row:"+data.notes[i].rowIndex + "ch:" + data.notes[i].channel);
        let rowInd = data.notes[i].rowIndex;
        let pointNum = (colInd*40 + rowInd) % 180;
        //console.log("p:"+pointNum);
        group.children[pointNum].material.color.r -= colors[ch].r;
        group.children[pointNum].material.color.g -= colors[ch].g;
        group.children[pointNum].material.color.b -= colors[ch].b;
      }
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
