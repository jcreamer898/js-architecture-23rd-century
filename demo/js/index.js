import GalaxyClass from "./ships/galaxy_class";
import TorpedoLauncher from "./weapons/torpedo_launcher";

let enterprise = new GalaxyClass({
  captain: "Jean Luc Picard",
  weaponSystems: { torpedos: new TorpedoLauncher() }
});

enterprise.fire("torpedos");

console.log(enterprise.weaponSystems.torpedos.shotsRemaining);

enterprise.warp();
