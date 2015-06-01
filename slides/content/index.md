name: intro
class: center, middle

# JavaScript Architecture of the 23rd Century
![](images/enterprise.jpg)

---
name: agenda

# Agenda

1. History
1. Design/Architecture patterns
1. Folder organization
1. AMD/CommonJS
1. 24th Century ES6 classes and modules
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

---
name: globals
class: left

# Globals on the `window`

* Cause naming collisions
* Really can get tricky with 3rd party libs

```js
var utils = {}; // or basically window.utils
```

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
* Code spread across multiple files has to communicate via globals
* Bad practice
* Can be frustrating to debug

---
name: globals-pock

# Globals on the `window`

![](images/globals-spock.gif)

---

class: left

## `Function` overload

* Functions were used for everything
* Once again declared on the global `window`
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

# Thousands of lines of code

* If you have more than 1,000 lines of code in a single file
* Something is wrong...

---
class: center, middle

# Thousands of lines of code

![](images/huge-files-kirk.gif)

---
class: left

# Unmaintainable for the long term

* Hard to find things
* Code gets coupled
* Not testable
* Unmaintainable
* If we were going to survive a 5 year mission to deep space, things had to change

---
class: center, middle

# Design Patterns

---
name: design-patterns
class: left

# Design Patterns

* Discovered, not created over time
* Help solve common software problems
* Lend themselves to better architecture
* Helps separate concerns
* Increase testability and maintainability

---
name: design-patterns-constructor

# Constructor Pattern

* JavaScript can be written in an OO-ish way
* No such thing as "classes", it's "prototypes"
* You can create a `function` *constructor* which is class-ish
* Use with the `new` keyword to create instances
* Can separate into multiple files to help separate concerns better

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

* `Starship` can be used as a constructor with `new`
* You call the object returned after using `new` an **instance**
* Generally use capitalized names to infer it can be `new`'d
* Store methods on the constructor's **prototype** (just an object)

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

* This constructor gets instantiated and passed into the `Starship` constructor

```js
* var ship = new Ship(new TorpedoLauncher());
ship.fire();
```

---
name: design-patterns-constructor-inheritance

# Inheritance

* Utilize inheritance to share behavior across multiple constructors
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
name: design-patterns-constructor-woes

# Cons of Constructors

* Relies on global variables for module communication
* Can't really have private methods on a constructor
* OO-ish? Some people don't like it since JS is dynamic

---
name: design-patterns-module

# Module Patterns

* Allows for "private" functions
* Helps group code into modules
* Basic modules to AMD and CommonJS

---
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

* Previously the `shotsRemaining` was publicly accessible on the instance
* Now it's encapsulated in an IIFE (Immediately Invoked Function Expression)
* Creates a **closure** over the variable
* The object returned is the API
* No need to call `new` on the API either

---
name: design-patterns-namespace-intro

# Namespace Pattern

* Utilize JavaScript objects to store things
* Helps minimize global variables
* Can store anything, aka constructors, variables, modules, etc

---
name: design-patterns-namespace

# Namespace Pattern

```js
// main.js
window.NS = NS || {};
NS.Ships = NS.Ships || {};
NS.Owners = NS.Owners || {};
```
* If `NS` isn't defined, set it to an empty object
* Now we only have 1 global variable `NS`
* Can store anything we need in any namespace

---
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

* Can add things each namespace

---

# Big caveats

```htm
<script src="js/main.js"></script>
<script src="js/ships/starship.js"></script>
<script src="js/ships/constitution_class.js"></script>
...
...
```

* Have to manually maintain a dependency chain with script tags
* If you put one out of order you can create bugs
* LOTS of script tags potentially if you want to properly separate concerns
* Still relying on globals even though they're minimized
---

# CommonJS

* A group got together and decided we needed a module specification

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
// ships/starship.js
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
class: center, middle

# Architecture Patterns

---
class: left
# Architecture Patterns

* MVC, MVP, MVVM

---


# Folder Structure

---

# ES6 Classes

---

# ES6 Modules

---

# 24th Century


---
class: left

# WebPack

> "Damn it man, I'm a doctor not a scientist" McCoy
---

class: left

# Load only the JavaScript/CSS needed

> "When you have eliminated the impossible, whatever remains, however improbable, must be the truth." Spock

* It is possible with WebPack
