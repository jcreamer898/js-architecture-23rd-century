let TorpedoLauncher = function() {
  this.shotsRemaining = 10;
};

TorpedoLauncher.prototype.fire = function() {
  this.shotsRemaining -= 1;
};

export default TorpedoLauncher;
