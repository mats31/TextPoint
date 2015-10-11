'use strict';

import Cube from './objects/Cube';
import THREE from 'three';
import Text from './objects/Text';

window.THREE = THREE;

export default class Webgl {
  constructor(width, height) {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(50, width / height, 1, 100000);
    this.camera.position.z = 50;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x262626);

    this.usePostprocessing = true;
    this.composer = new WAGNER.Composer(this.renderer);
    this.composer.setSize(width, height);
    this.initPostprocessing();

    this.text = new Text(this.camera, this.renderer);
    this.text.position.set(0,0,0);
    this.rotation = 0;
    this.scene.add(this.text);
  }

  initPostprocessing() {
    if (!this.usePostprocessing) return;

    this.vignette2Pass = new WAGNER.Vignette2Pass();
  }

  resize(width, height) {
    this.composer.setSize(width, height);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  };

  render() {
  let timer = Date.now() * 0.0003;

  this.camera.position.x = Math.cos( timer ) * 100;
  this.camera.position.y = 30;
  this.camera.position.z = Math.sin( timer ) * 100;
  this.camera.lookAt( this.scene.position );

    if (this.usePostprocessing) {
      this.composer.reset();
      this.composer.renderer.clear();
      this.composer.render(this.scene, this.camera);
      this.composer.pass(this.vignette2Pass);
      this.composer.toScreen();
    } else {
      this.renderer.autoClear = false;
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
    }
    if (this.text.geometry2.boundingSphere != null)
      this.text.position.set(-this.text.geometry2.boundingSphere.center.x, 0, 0);

    this.text.update();
  }
}