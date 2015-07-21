name: intro
class: center, middle

# JavaScript Architecture of the 23rd Century
![](images/enterprise.jpg)

---

# whoami

* Jonathan Creamer
* Senior Front End Engineer at Lonely Planet

<img src="images/lonelyplanet_bw.png" style="width: 10em" />

* Love JavaScript
* Nashville, TN

---

name: agenda

# Agenda

1. History
1. Design/Architecture patterns
1. AMD/CommonJS
1. 24th Century ES6, classes and modules
1. How to use now! Hint hint: WebPack + Babel FTW

???

Centuries ago when JavaScript was a browser toy to flash things around on the page, the need for architecture in JavaScript was non existent. You could simply throw some jQuery into a file, or even just in an embedded script tag on the page and you’d have what you need. Centuries later in the 23rd century, Stardate 1312.4, the need for architecture is critical in creating long term JavaScript Applications that will survive a 5 year mission into deep space. First we will step back in time to talk about how things were done with simple functions on the page, back when the Federation was just being formed, and move forward through time into other useful patterns such as prototypes, module patterns, and namespacing. Then move into talking about AMD, and CommonJS. Finally we’ll also talk about how you can use the new ES6 syntax for classes and modules that we’ll see in the 24th century now in current browsers.

---
name: history-intro
class: center, middle

# History

---
name: history
class: left

# History

.quote[> "Those who cannot remember the past are condemned to repeat it" George Santayana]

* Early in the 22nd century JavaScript was used to move things around the page
* Function all the things
* `window` stores globals to use in other files
* Huge files with thousands of lines of code
* Browser issues

---
name: globals
class: left

# Globals on the `window`

```js
var utils = {}; // or basically window.utils
```

* Cause naming collisions
* Really can get tricky with 3rd party libs
* Other libraries can also use `utils`

```htm
<script src="/some/third/party.js"></script>
```

---
name: globals-communication

# Globals on the `window`

```js
// ships.js
var Starship = function() {}; // OR Really just window.Starship

// main.js
var ship = new Starship(); // Relies on a global
```

* Bad practice
* Frustrating to debug

???

* Code spread across multiple files has to communicate via globals

---
name: globals-pock

# Globals on the `window`

![](images/globals-spock.gif)

---

class: left

## `Function` overload

* Functions for everything
* Declared on `window`
* Again, frustrating to debug
* Spaghetti code
* No separation of concerns

---

## `Function` overload

```js
function DoStuff() {
  /* ... */
}
```
--

```js
function DoMoreStuff() {
  /* ... */
}
```
--

```js
function DoAndMoreStuff() {
  /* ... */
}
```

--

```js
function O_o() {
  /* ... */
}
```

--

```js
function ಠ_ಠ() {
  /* ... */
}
```

---

class: center, middle

### so.many.functions.

![](images/somanyfunctions.gif)

---

class: center, middle

# Thousands of lines of code

![](images/huge-files-kirk.gif)

???

* If you have more than 1,000 lines of code in a single file
* Code smell that says, split your code up better
* Something is wrong...

---
class: left

# Unmaintainable for the long term

* Hard to find things
* Code gets coupled
* Not testable
* Unmaintainable
* If we were going to survive a 5-7 year mission to deep space, things had to change

---

class: center, middle

# Deep space

---

# Deep space

* Web applications have grown
* JavaScript has grown along with them
* Always bet on JavaScript
* Single page applications get huge
* Need for better architecture

---
class: center, middle

# Design Patterns

---
name: design-patterns
class: left

# Design Patterns

* Discovered, not created over time
* Identify common problems
* Lends better architecture
* Separate concerns
* Testability and maintainability

---
name: design-patterns-constructor

# Constructor Pattern

* "class-ish"
* Called *Constructors*
* `new` keyword to create instances
* Multiple files

???

* No such thing as "classes", but there is a prototype thing
* Multiple files to help separate concerns

---
name: design-patterns-constructor-example

# Constructor Pattern

```js
// starship.js
var Starship = function(weapon) {
  this.weapon = weapon;
};

Starship.prototype.fire = function() {
  this.weapon.fire();
};

var ship = new Ship(new TorpedoLauncher());
ship.fire();
```

* `new` creates *instances*
* Prototype object

???

* `Starship` can be used as a constructor with `new`
* You call the object returned after using `new` an **instance**
* Generally use capitalized names to infer it can be `new`'d
* Store methods on the constructor's **prototype** (just an object) just by declaring a function, you have access to the prototype

---

# Constructor Pattern

```js
// weapons/torpedo_launcher.js

var TorpedoLauncher = function() {
  this.shotsRemaining = 10;
};

TorpedoLauncher.prototype.fire = function() {
  this.shotsRemaining -= 1;
};
```

* Create in another file

???

* This constructor gets instantiated and passed into the `Starship` constructor
* Because of the logical code separation, files can be separated

```js
* var ship = new Ship(new TorpedoLauncher());
ship.fire();
```

---
name: design-patterns-constructor-inheritance

# Inheritance

* Share behavior
* Create multiple types of starships based off the `Starship` constructor

---
name: design-patterns-constructor-inheritance-2

# Inheritance

```js
// ships/constitution_class.js

var ConstitutionClass = function() {
  Starship.apply(this, arguments);
};

ConstitutionClass.prototype.warp = function() {};

ConstitutionClass.prototype = Object.create(Starship.prototype);
ConstitutionClass.prototype.constructor = ConstitutionClass;

var weapon = new TorpedoLauncher(50);
var ship = new ConstitutionClass(weapon);
ship.fire(); // Calls fire from the base starship class
```

* Weird looking
* Effective, but a lot to remember

???

* The `prototype` is merely an object with functions
* Use `Object.create` to create a new object to use for setting up the prototype
* Have to reset the constructor and call the `Weapon` constructor with `apply`
* A little lolwut going on and you'll have to google this every time

---
name: design-patterns-constructor-wins
class: center, middle

# Better, but still a ways to go

![](images/design-patterns-mccoy.gif)

---
exclude: true
class: center, middle

# Modules

---
exclude: true
class: left
name: design-patterns-module

# Module Patterns

* Allows for "private" variables
* Basic module design patterns
* AMD and CommonJS

---
exclude: true
name: design-patterns-revealing-module

# Revealing Module Pattern

```js
var torpedoLauncher = (function() {
  var shotsRemaining = 10;

  return {
    fire: function() {
      shotsRemaining -= 1;
      console.log("Torpedo launched");
    };
  };
}());
```

* "private" shotsRemaining

???

* Previously the `shotsRemaining` was publicly accessible on the instance
* Now it's encapsulated in an IIFE (Immediately Invoked Function Expression)
* Creates a **closure** over the variable
* The object returned is the API
* No need to call `new` on the API either

---
exclude: true
name: design-patterns-revealing-module

# Revealing Prototype Pattern

```js
var TorpedoLauncher = (function() {
  var shotsRemaining = 10;

  var fire = function() {
    shotsRemaining -= 1;
  };

  var TorpedoLauncher = function() {};

  TorpedoLauncher.prototype.fire = function() {
    fire();
  };

  return TorpedoLauncher;
}());

var launcher = new TorpedoLauncher();
```

* "private" functions
* Call `new` on it

???

* Similar, just return a constructor
* `fire`, and `shotsRemaining` are private

---
exclude: true
name: design-patterns-namespace-intro

# Namespace Pattern

* Utilize JavaScript objects to store things
* Helps minimize globals
* Store anything

???

aka constructors, variables, modules, etc

---
exclude: true
name: design-patterns-namespace

# Namespace Pattern

```js
// main.js
window.NS = NS || {};
NS.Ships = NS.Ships || {};
NS.Owners = NS.Owners || {};
```

* Organize with an object
* Use the `||` operator

???

* If `NS` isn't defined, set it to an empty object
* Now we only have 1 global variable `NS`
* Can store anything we need in any namespace

---
exclude: true
name: design-patterns-namespace-more

# Namespace Pattern

```javascript
// ships/constitution_class.js
NS.Ships.ConstitutionClass = function() { /* ... */ };

// owners/star_fleet.js
NS.Owners.starFleet = (function() {
  var ships = [];

  var addShip = function(ship) { ships.push(ship); };

  return {
    addShip: addShip
  };
});

NS.Owners.starFleet.addShip(new NS.Ships.ConstitutionClass());
```

* Add things to each namespace
---

# Big caveat

```htm
<script src="js/main.js"></script>
<script src="js/ships/starship.js"></script>
<script src="js/ships/constitution_class.js"></script>
...
...
```

---
name: design-patterns-constructor-woes

# Better, but still a ways to go

* Inheritance is a bit ugly
* Globals still
* Dependency management
* Bug prone
* Hard to maintain

???

* Need something other mechanism to fetch them
* Still relying on globals even though they're minimized
* Have to manually maintain a dependency chain with script tags
* If you put one out of order you can create bugs
* LOTS of script tags potentially if you want to properly separate concerns

---

class: center, middle

# Organize with script tags?!

![](images/namespace-spock.gif)

---

class: left

# CommonJS

* A group got together and decided we needed a module specification
* Node.js uses this type of module

---

# CommonJS Module

```js
// ships/constitution_class.js
var StarShip = require("ships/starship");

var ConstitutionClass = function() {};
// ... inherit StarShip

ConstitutionClass.prototype.warp = function() {};

module.exports = StarShip;
```

* Require
* Return with exports

???

* Utilize `require` to fetch modules
* `module.exports` can return a constructor, or any object

---

# CommonJS Module

```js
// index.js
var ConstitutionClass = require("ships/constitution_class");

var enterprise = new ConstitutionClass();

enterprise.captain = "Kirk";

module.exports = {
  beginMission: function() {
    enterprise.warp();
  }
};
```

* Require other modules

---

# AMD

* CommonJS was meant to be sync, doesn't work great in the browser
* AMD came out of CommonJS
* Asynchronous Module Definition
* Several different implementations, but require.js is most popular

---

# Require.js

* Use `define` function to create a module
* Use `require` to fetch dependencies
* One module per JavaScript file
* Module name is inferred from the filename

---

# Require.js module

```js
// ships/starship.js
define(function() {
  var StarShip = function() {};

  // ...

  return StarShip;
});
```

* No globals are exposed, whatever is returned is the API
* This is very similar to the revealing module pattern in principle
* Just no IIFE is necessary

---

# Require.js module

```js
// weapons/torpedoLauncher.js
define(function() {
  var shotsRemaining = 10;

  return {
    fire: function() {
      shotsRemaining -= 1;
    };
  };
});
```

* Can also just return simple object with methods just like before

---
name: require-module-dependency

# Require.js module with dependency

```js
// ships/constitution_class.js
define(function(require) {
  var StarShip = require("ships/starship.js");

  var ConstitutionClass = function() {
    StarShip.apply(this, arguments);
  };

  ConstitutionClass.prototype = Object.create(StarShip.prototype);
  ConstitutionClass.prototype.constructor = ConstitutionClass;

  return ConstitutionClass;
});
```

* Simply put `require` in as an argument
* Use `require` to retrieve other modules

---

# Problems with AMD and CommonJS

* Requires a special type of syntax
* Not native to the JavaScript; standardish?
* Many implementations of AMD

---
class: center, middle

# Can we do even better?...

![](images/modules-group-stare.gif)


---
class: center, middle

# 24th Century
## The Next Generation

---

# ES6/2015

> "TO BOLDLY GO WHERE NO MAN HAS GONE BEFORE..."

* Several years in the making
* Been on ES5 for a long time now. Since December 3, 2009.
* ES Harmony became 6 which became 2015 (June it's "[done](https://people.mozilla.org/~jorendorff/es6-draft.html)")
* Many great new language features, including native modules, and classes

---

# String Templates

```js
let date = new Date(),
    msg = "Boldly go...";

let message = `${date}: ${msg}`,
```

* No more string addition

---

# `let` and `const`

```js
let captainsLog = (function() {
  const messages = [];

  return {
    add: function(msg) {
      // Message undefined in the "temporal dead zone"
      if (msg) {
        let message = `${date}: ${msg}`,
            date = new Date();

        messages.push(message);
        return message;
      }
    }
  }
}());
```

* Block scope

???

* Block scope instead of only function scope
* Use `const` when you know a value won't change
* Use `let` for most everything though
* Use `var` sparingly and only for legacy
* Can call `push` on the array, can't change reference

---

# `let`

```js
for (let i = 0; i < messages.length; i++) {
  // ...
}
i; // undefined
```

* Declare variables for loops

---
class: center, middle

# No more function scope!

![](images/sweet-jesus.gif)

---

# Arrow Functions

```js
setTimeout(() => {
  // ...
}, 0);

$(".warp").on("click", (e) => console.log(e.target));

let fn = () => {};
```

* `function` less often
* Can omit `{}`'s
* Will return the value
* Binds `this` correctly

---

# Default Parameters

```js
let warp = (speed = 5) => {
  // ...
};
warp();
warp(9.8);
```

* `speed` defaults to 5
* No more `speed = speed || 5;`

---

# Object keys

```js
let torpedos = new TorpedoLauncher(),
    phasers = new Phasers();

let weapons = { torpedos, phasers };

// same as { torpedos: torpedos, phasers: phasers }
```

* Can omit value if key is the same

---

# Destructuring Assignment

```js
let [first, second] = ["humans", "klingons"];
```

* `first` is "humans"
* `second` is "klingons"

---

# Destructuring Assignment

```js
let [first, ..rest] = ["humans", "klingons", /* ... */];
```

* Combine with the new "rest" parameter
* `first` is "humans"
* `rest` is all the rest

---

# Object Destructuring

```js
let options = {
  captain: "Jean Luc Picard",
  firstOfficer: "William Riker",
  weapons: { torpedos, phasers }
};

// ...

let { captain, firstOfficer, weapons } = options;
```

* Pull values out of objects
* Creates variables

---
class: center, middle

# Mind Blown by new features

![](images/mind-blown.gif)

---
class: left

# Add some `class` to JavaScript

```js
class StarShip {
  constructor({
      captain,
      firstOfficer,
      weaponSystems = {},
      maxWarp = 5,
    }) {
    this.captain = captain;
    this.firstOfficer = firstOfficer;
    this.weaponSystems = weaponSystems;
  }
  fire(system) {
    this.weaponSystems[system].fire();
  }
  fireAll() {
    for(let system of this.weaponSystems) {
      this.weaponSystems[system].fire();
    }
  }
  warp(speed = 3) {
    if (speed > this.maxWarp) {
      throw "I can't do it captain, I don't have the power!"
    }
  }
}
```

???

* Sugar for creating constructors
* Much cleaner syntax

---

# Class methods

```js
fire(system) {
  this.weaponSystems[system].fire();
}
```

* No `,`'s or `:`'s
* Prototype methods

???

* `this` is bound correctly
* Methods defined on the `protptype`

---

# Getters and Setters

```js
get command() {
  return `${this.captain} and ${this.firstOfficer}`;
}
set crew(members) {
  this._crew = members.map((c) => new CrewMember(c));
}
get crew() {
  return this._crew;
}
```

* No need to use `()` when accessing

```js
this.crew = ["..."];
command; // "Jean Luc Picard and William Striker"
```

---

# Destructuring with default parameters

```js
constructor({
    captain,
    firstOfficer,
    weaponSystems = {},
    maxWarp = 5,
  }) {
  this.captain = captain;
  this.firstOfficer = firstOfficer;
  this.weaponSystems = weaponSystems;
  this.maxWarp = maxWarp;
}
```

* Called when you `new Starship()`
* Combine destructuring and defaults

???

* Easier way to handle options objects
* Pull values out of the object passed in
* Declares local variables
* Sets defaults if they are not passed in

---

# Better inheritance

```javascript
class GalaxyClass extends Starship {
  // .. defined other methods
  warp(speed = 9.8) {
    super.warp(speed);
  }
}
```

* Easy inheritance

???

* Use `extends` for setting up inheritance
* Much less confusing to inherit
* Use `super` to call parent methods

---

class: center, middle

# ES2015 Native Classes

![](images/es6-classes-picard.gif)

---
class: center, middle

# ES6 Modules

---
class: left

# ES6 Modules

```js
class StarShip {
  // ...
}

export default StarShip;
```

```js
import StarShip from "ships/starship";

class GalaxyClass extends StarShip {
  // ...
}

export default GalaxyClass;
```

* Native modules!

???

* A native module system for JavaScript!
* Many ways to return module
* `default` keyword for what gets imported

---

# export function

```js
export default function() {
  // ...
}
```

* Export a function

---

# export multiple

```js
// utils/logger.js

export function alert() {

}

export function log() {

}
```

* Use destructuring to import

```js
import { log, alert } from "utils/captains_log";
```

---

class: center, middle

# "Transpile"

---
class: center, middle

### When you have dreams about new JS features and remember you still have to support IE8...

![](images/picard-surprise.gif)

---
class: left

# Transpilers

* Grunt/Gulp
* Transpile ES6, CoffeeScript, etc
* Natural going forward

???

* With Grunt and Gulp we're used to "compiling" JavaScript now
* Transpiling allows different syntax to compile to JavaScript
* React(JSX), CoffeeScript (Ruby-ish), TypeScript (C#-ish)
* Natural evolution is to transpile modern ES2015

---

class: left

# Babel

> "Make it so." Jean Luc Picard

* Modern to legacy
* Node, Grunt, Browserify, Webpack
* Polyfills
* Try it at [Babeljs.io](http://babeljs.io)

???

* Transpiles modern JavaScript to Legacy JavaScript
* Runs with node, grunt tasks, or Browserify/Webpack type bundlers
* Has polyfills for older browsers


---
# Example Transpilation

```js
class StarShip {}
class GalaxyClass extends StarShip {}

let ship = new StarShip()
```

* Becomes...

---

# Transpiled

```js
"use strict";

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StarShip = function StarShip() {
  _classCallCheck(this, StarShip);
};

var GalaxyClass = (function (_StarShip) {
  function GalaxyClass() {
    _classCallCheck(this, GalaxyClass);

    if (_StarShip != null) {
      _StarShip.apply(this, arguments);
    }
  }

  _inherits(GalaxyClass, _StarShip);

  return GalaxyClass;
})(StarShip);

var ship = new StarShip();
```

---

# WebPack FTW

* Bundle all the things
* Flexible
* CommonJS, AMD
* Loaders

???

* A static asset bundler
* Takes any static asset, passes it through a loader
* Creates bundles
* Extremely flexible
* Can write code in CommonJS, or AMD out of the box
* Use Babel-Loader for ES6

---

# Get Started

```shell
npm install -g webpack
npm install babel-loader
```

* Install WebPack globally
* Install Babel Loader locally

---

# Get Started

```js
module.exports = {
  entry: {
    app: "./js/app"
  },
  output: {
    path: "./dist",
    filename: "[name].js"
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: "babel?stage=0"
    }]
  }
};
```

* Create a `webpack.config.js` file

---

# Get Started

```js
module.exports = {
  entry: {
    app: "./js/app"
  },
  // ...
};
```

* Can have many

???

* Entry is an object of all the main "entries" in your app
* Can have multiple
* Correspond to pages, vendor bundles, etc

---

# Get Started

```js
module.exports = {
  output: {
    path: "./dist",
    filename: "[name].js"
  },
  // ...
};
```

* Describe output
* Placeholders

???

* Output is where your bundles will go
* Can use placeholders like `[name]`
* Will output `./dist/app.js` corresponding to entry names

---

# Loaders

```js
module: {
  loaders: [{
    test: /\.js$/,
    exclude: /(node_modules|bower_components)/,
    loader: "babel?stage=0"
  }]
}
```

* Pass in an array of loaders
* Use `test` to take any file with that extension and push it through the loader
* Here we're using the `babel-loader`
---

# Loaders

```js
module: {
  loaders: [{
    test: /\.scss$/,
    loader: "style!css!sass"
  }]
}
```

* Use `node-sass`
* `sass-loader` compiles
* `css-loader` sends compiled CSS to...
* `style-loader` inlines CSS

---

# Lazy Load

```js
// js/index.js


```

---

# Run WebPack

```bash
webpack
```

* Now just run it!
* Should have an output at `dist`
* Transpiled JS

---
class: middle, center

# Demo

---

class: left

# Load only the JavaScript/CSS needed

> "When you have eliminated the impossible, whatever remains, however improbable, must be the truth." Spock

* It is possible with WebPack

---

# Multi-Page Bundling

```js
entry: {
  "app": "./js/index",
  "starfleet": "./js/about/index",
  "captainsLog": "./js/captains_log/index"
},
```

* Divide your app with entries

---

# Plugins

* Many different webpack Plugins
* Easy to install and use
* `CommonsChunk`, `Uglify`, `ExtractTextPlugin`


---

# CommonsChunk

```js
entry: {
  common: [],
  /* ... */
},
plugins: [new webpack.optimize.CommonsChunkPlugin({
  name: "common",
  minChunks: 2
})]
```

* Create a "common" bundle
* Can default with jQuery, etc
* Will extract common modules

---

# Resources

* [WebPack](http://webpack.github.io)
* Awesome Pete Hunt [Instgram talk](https://www.youtube.com/watch?v=VkTCL6Nqm6Y)

---
class: center, middle

# Thanks

### [@jcreamer898](http://twitter.com/jcreamer898)

![](images/livelong.gif)
