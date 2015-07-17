import GalaxyClass from "./ships/galaxy_class";
import TorpedoLauncher from "./weapons/torpedo_launcher";

let enterprise = new GalaxyClass({
  captain: "Jean Luc Picard",
  firstOfficer: "William Riker",
  weaponSystems: { torpedos: new TorpedoLauncher() }
});

enterprise.fire("torpedos");
enterprise.warp();
