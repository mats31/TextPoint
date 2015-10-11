'use strict';

import THREE from 'three';

export default class Text extends THREE.Object3D {
  constructor() {
    super();

    this.particles = 100000;

    this.uniforms = {
      color:     { type: "c", value: new THREE.Color( 0xffffff ) },
      texture:   { type: "t", value: THREE.ImageUtils.loadTexture( "textures/spark1.png" ) }
    };

    this.shaderMaterial2 = new THREE.ShaderMaterial( {
      uniforms:       this.uniforms,
      vertexShader:   document.getElementById( 'vertexshader' ).textContent,
      fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
      blending:       THREE.AdditiveBlending,
      depthTest:      false,
      transparent:    true
    });

    this.geom = new THREE.TextGeometry( "MATHIS", {
          size: 10,
          height: 1,
          curveSegments: 4,

          font: 'optimer',
          weight: 'bold',
          style: 'normal',

          bevelThickness: 1,
          bevelSize: 0.5,
          bevelEnabled: true,

          material: 0,
          extrudeMaterial: 1
    });

    this.verticesNb = this.geom.vertices.length;
    this.vertices = this.geom.vertices;


    let radius = 200;

    this.positions = new Float32Array( this.vertices.length * 3 );
    this.colors = new Float32Array( this.vertices.length * 3 );
    this.sizes = new Float32Array( this.vertices.length );

    this.color = new THREE.Color();

    for (let i = 0, l = this.vertices.length; i < l; i++) {
      this.vertex = this.vertices[i];
      this.vertex.toArray(this.positions, i * 3);
      if (i < this.verticesNb) {
        this.color.setHSL(0.6 + 0.1 * (i / this.verticesNb), 0.99, (this.vertex.y + radius) / (4 * radius));
      } else {
        this.color.setHSL(0.6, 0.75, 0.25 + this.vertex.y / (2 * radius));
      }
      this.color.toArray(this.colors, i * 3);
      this.sizes[i] = i < this.verticesNb ? 10 : 40;
    }

    /** For another render
    for ( var i = 0, i3 = 0; i < this.vertices.length; i ++, i3 += 3 ) {
      this.vertex = this.vertices[i];
      this.vertex.toArray(this.positions, i * 3);

      this.color.setHSL( i / this.vertices.length, 1.0, 0.5 );

      this.colors[ i3 + 0 ] = this.color.r;
      this.colors[ i3 + 1 ] = this.color.g;
      this.colors[ i3 + 2 ] = this.color.b;

      this.sizes[ i ] = 20;
    }
    **/


    this.geometry2 = new THREE.BufferGeometry();

    this.geometry2.addAttribute( 'position', new THREE.BufferAttribute( this.positions, 3 ) );
    this.geometry2.addAttribute( 'customColor', new THREE.BufferAttribute( this.colors, 3 ) );
    this.geometry2.addAttribute( 'size', new THREE.BufferAttribute( this.sizes, 1 ) );

    this.particleSystem = new THREE.Points(this.geometry2, this.shaderMaterial2);
    this.add(this.particleSystem);
  }

  update() {
    let time = Date.now() * 0.005;

    let sizes = this.geometry2.attributes.size.array;

    for ( let i = 0; i < this.particles; i++ ) {

      sizes[ i ] = 10 * ( 1 + Math.sin( 0.1 * i + time ) );

    }

    this.geometry2.attributes.size.needsUpdate = true;
  }
}