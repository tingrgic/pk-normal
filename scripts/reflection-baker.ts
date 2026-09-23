// Build-time lighting asset generator. Not imported by the application.
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
export function bakeReflections() {
  const renderer = new THREE.WebGLRenderer({ antialias: false });
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.04);
  const { width, height } = environment;
  const pixels = new Uint16Array(width * height * 4);
  renderer.readRenderTargetPixels(environment, 0, 0, width, height, pixels);
  const data = new Uint8ClampedArray(pixels.length);
  for (let i = 0; i < pixels.length; i++)
    data[i] =
      i % 4 === 3
        ? 255
        : Math.round(
            Math.min(1, THREE.DataUtils.fromHalfFloat(pixels[i])) * 255,
          );
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  c.getContext("2d")!.putImageData(new ImageData(data, width, height), 0, 0);
  const png = c.toDataURL("image/png").split(",")[1];
  environment.dispose();
  room.dispose();
  pmrem.dispose();
  renderer.dispose();
  return { width, height, png };
}
