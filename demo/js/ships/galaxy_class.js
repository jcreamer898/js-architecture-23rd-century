import StarShip from "./starship";

class GalaxyClass extends Starship {
  deflectorShields() {
    // ...
  }
  warp(speed) {
    if (!speed) {
      super.warp(9.8);
    }
  }
}

export default GalaxyClass;
