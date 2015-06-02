import GalaxyClass from "./ships/galaxy_class";

let enterprise = new GalaxyClass({
  captain: "Jean Luc Picard",
  weaponSystems: { TorpedoLauncher, PhaserArrays }
});

enterprise.fire("PhaserArrays");
