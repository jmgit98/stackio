import * as THREE from 'three';
// import Physijs from 'physijs-webpack/webpack';
import Brick from './entity/Brick';
import Cornerstone from './entity/Cornerstone';
import { PhysicSceneModule, RendererModule, CameraModule } from './entity/SceneBasics';
import palette from './Palette';

class GameScene {
  constructor() {
    this.name = 'GameScene';
    // init clock
    this.clock = new THREE.Clock();
    // init scene
    this.scene = new PhysicSceneModule({
      fog: new THREE.Fog(palette.darkBlue, 70, 320),
      gravity: new THREE.Vector3(0, -100, 0),
    }).build();
    // init renderer
    this.renderer = new RendererModule().build();
    // init camera
    this.camera = new CameraModule({
      type: 'orthographic',
      position: new THREE.Vector3(120, 84, 120),
      frustumSize: 400,
    }).build();
    // init lights
    const light1 = new THREE.DirectionalLight(palette.white, 0.9);
    light1.position.set(new THREE.Vector3(1, 1, 0));
    const light2 = new THREE.HemisphereLight(palette.white, palette.darkBlue, 0.9);
    // init scene entities
    this.bricks = [];
    this.fallingBricks = [];
    const cornerstone = new Cornerstone({
      position: new THREE.Vector3(0, -100, 0),
      edge: new THREE.Vector3(50, 200, 50),
    });
    const baseBrick = new Brick({
      position: new THREE.Vector3(0, -4, 0),
    });
    const currBrick = new Brick({
      position: new THREE.Vector3(0, 4, 0),
    });
    this.bricks.push(baseBrick);
    this.bricks.push(currBrick);
    // scene set up
    this.scene.add(this.camera);
    this.scene.add(light1);
    this.scene.add(light2);
    this.scene.add(cornerstone.mesh);
    this.scene.add(this.bricks[this.bricks.length - 1].mesh);
    this.toDrop = false;
    this.isEnd = false;
    this.handleMouseClick = this.handleMouseClick.bind(this);
    this.handleWindowResize = this.handleWindowResize.bind(this);
  }

  update() {
    const deltaTime = this.clock.getDelta();
    const height = this.bricks.length;
    if (!this.isEnd) {
      if (!this.toDrop) {
        this.bricks[height - 1].move(deltaTime);
        // move camera
        if (this.camera.position.y - this.bricks[height - 1].mesh.position.y < 80) {
          this.camera.translateY(20 * deltaTime);
          if (this.camera.position.y - this.bricks[height - 1].mesh.position.y >= 80) {
            this.camera.position.y = this.bricks[height - 1].mesh.position.y + 80;
          }
          this.camera.updateMatrixWorld();
        }
      } else {
        const res = this.bricks[height - 1].cut(this.bricks[height - 2]);
        if (res.case === 'miss') {
          this.scene.remove(this.bricks[height - 1].mesh);
          this.fallingBricks.push(res.fallingBrick);
          this.scene.add(res.fallingBrick.mesh);
          this.isEnd = true;
          this.isDrop = true;
        } else {
          if (res.case === 'partial') {
            this.fallingBricks.push(res.fallingBrick);
            this.scene.add(res.fallingBrick.mesh);
          }
          // create new brick
          const currPos = this.bricks[height - 1].mesh.position;
          const newBrick = new Brick({
            position: this.bricks[height - 1].params.direction === 'x'
              ? new THREE.Vector3(currPos.x, currPos.y + 8, -59)
              : new THREE.Vector3(-59, currPos.y + 8, currPos.z),
            scale: this.bricks[height - 1].mesh.scale,
            direction: this.bricks[height - 1].params.direction === 'x' ? 'z' : 'x',
          });
          this.bricks.push(newBrick);
          this.scene.add(this.bricks[height].mesh);
          this.toDrop = false;
        }
      }
    }
    // remove some falling bricks
    this.fallingBricks.forEach((brick, index) => {
      if (brick && brick.mesh.position.y < this.camera.position.y - 150) {
        this.scene.remove(brick.mesh);
        this.fallingBricks.splice(index, 1);
      }
    });
    this.scene.simulate();
    this.renderer.render(this.scene, this.camera);
  }

  startClock() {
    this.clock.start();
  }

  handleWindowResize() {
    const aspect = window.innerWidth / window.innerHeight;
    const frustumSize = 400;
    this.camera.left = -frustumSize * aspect / 2;
    this.camera.right = frustumSize * aspect / 2;
    this.camera.top = frustumSize / 2;
    this.camera.bottom = -frustumSize / 2;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  handleMouseClick() {
    console.log('triggered!');
    this.toDrop = true;
  }
}

export default GameScene;
