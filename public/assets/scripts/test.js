var winner = false;
AFRAME.registerComponent('collider', {
  schema: {
    target: { default: '' }
  },

  /**
   * Calculate targets.
   */
  init: function () {
    var targetEls = this.el.sceneEl.querySelectorAll(this.data.target);
    this.targets = [];
    for (var i = 0; i < targetEls.length; i++) {
      this.targets.push(targetEls[i].object3D);
    }
    this.el.object3D.updateMatrixWorld();
  },

  /**
   * Check for collisions (for cylinder).
   */
  tick: function (t) {
    var collisionResults;
    var directionVector;
    var el = this.el;
    var mesh = el.getObject3D('mesh');
    var object3D = el.object3D;
    var raycaster;
    var vertices = mesh.geometry.vertices;
    var bottomVertex = vertices[0].clone();
    var topVertex = vertices[vertices.length - 1].clone();

    // Calculate absolute positions of start and end of entity.
    bottomVertex.applyMatrix4(object3D.matrixWorld);
    topVertex.applyMatrix4(object3D.matrixWorld);

    // Direction vector from start to end of entity.
    directionVector = topVertex.clone().sub(bottomVertex).normalize();

    // Raycast for collision.
    raycaster = new THREE.Raycaster(bottomVertex, directionVector, 1);
    collisionResults = raycaster.intersectObjects(this.targets, true);
    collisionResults.forEach(function (target) {
      // Tell collided entity about the collision.
      numberHit(target.object.el.id);
      target.object.el.emit('collider-hit', {target: el});
    });
  }
});

// projectile component to have an entity travel straight.
AFRAME.registerComponent('projectile', {
  schema: {
    speed: { default: -0.1 }
  },

  tick: function () {
    this.el.object3D.translateY(this.data.speed);
  }
});

// spawner component to generate an entity on an event.
AFRAME.registerComponent('spawner', {
  schema: {
    on: { default: 'click' },
    mixin: { default: '' }
  },

  /**
   * Add event listener.
   */
  update: function (oldData) {
    this.el.addEventListener(this.data.on, this.spawn.bind(this));
  },

  /**
   * Spawn new entity at entity's current position.
   */
  spawn: function () {
    var el = this.el;
    var entity = document.createElement('a-entity');
    var matrixWorld = el.object3D.matrixWorld;
    var position = new THREE.Vector3();
    var rotation = el.getAttribute('rotation');
    var entityRotation;

    position.setFromMatrixPosition(matrixWorld);
    entity.setAttribute('position', position);

    // Have the spawned entity face the same direction as the entity.
    // Allow the entity to further modify the inherited rotation.
    position.setFromMatrixPosition(matrixWorld);
    entity.setAttribute('position', position);
    entity.setAttribute('mixin', this.data.mixin);
    entity.addEventListener('loaded', function () {
      entityRotation = entity.getComputedAttribute('rotation');
      entity.setAttribute('rotation', {
        x: entityRotation.x + rotation.x,
        y: entityRotation.y + rotation.y,
        z: entityRotation.z + rotation.z
      });
    });
    el.sceneEl.appendChild(entity);
  }
});

// click-listener component to pass window clicks to an entity.
AFRAME.registerComponent('click-listener', {
  init: function () {
    var el = this.el;
    window.addEventListener('click', function () {
      el.emit('click', null, false);
      winner = false; //////////////////// Winner set back to false
    });
  }
});

var score = 0;
var interval;
function numberHit(numId) {
  numId = parseInt(numId);
  var answer = parseInt($("#answer").val());
  if(numId%9 == answer%9) {
    winner = true;
    score += 10;
    clearInterval(interval);
    $('#winner').show();
    $('#continue').show();
    $('#comparison').val('comparison');
  } else {
    score -= 5;
  }
  $('#score').text(score + 'pts');
}

//////////////////////////////////////////////////////////////////////////////////
// JQuery
var timerSeting = 20;
$(function() {
  startTimer(timerSeting);
  var randomNums = generateRandomNumberList(9);
  var orbitAngle = Math.PI/150.0; // smaller makes them orbit slower
  // Translation
  setInterval(function() {
    // Orbit
    for (var i = 0; i < randomNums.length; i++) {
      var numId = randomNums[i] + 9; // + 9 because of unique ids
      var position = $("#" + numId + "").attr('position');
      $("#" + numId + "").attr("position",  orbit(position, orbitAngle, 1));
    }
    var position = $("#entity").attr("position");
    newPosition = translate(position, [0,0,-.01]);
    newPosition = orbit(position, -orbitAngle, 1);
    $("#entity").attr("position",  newPosition);
  }, 1000);

});

//////////////////////////////////////////////////////////////////////////////////

// function backAndForth()

function translate(position, step) {
  position.x += step[0];
  position.y += step[1];
  position.z += step[2];
  return position.x + " " + position.y + " " + position.z;
}

function generateRandomNumberList(maxNum) {
  numList = [];
  for (var i = 1; i < maxNum + 1; i++) {
    numList.push(i);
  }
  var randomList = [];
  for (var i = 1; i < maxNum + 1; i++) {
    var randomIndex = Math.round(Math.random()*100)%numList.length;
    randomList.push(numList[randomIndex]);
    numList.splice(randomIndex,1);
  }
  return randomList;
}

function addNumber(number) {
  $( "#entity" ).append( '<a-image class="' + number + '" class="enemy" look-at="#player" src="#number' + number + '-sprite"  transparent="true">'
    + '<a-animation attribute="opacity" begin="collider-hit" dur="1000" ease="linear" from="1" to="0"></a-animation>'
    + '<a-animation attribute="scale" begin="collider-hit" dur="1000" ease="linear" to="0 0 0"></a-animation>'
    + '</a-image>' );
}


function startTimer(seconds) {
  var second = 0;
  interval = setInterval(function() {
    if(winner) {
      seconds = 20;
      console.log("winner on");
    } else {
      console.log("winner off");
    }
    $('#timer').text(seconds);
    if (second >= seconds) {
      $('#timer').text("Out of Time!");
      $("#loser").show();
      $("#reset").show();
      winner = false;
      clearInterval(interval);
    }
    seconds--;
  }, 1000);
}

// Use this to orbit an axis.
function orbit(position, angle, rotationAxis) {
  var positionVector = [position.x,position.y,position.z];
  positionVector = orbitalGenerator(positionVector, angle, rotationAxis);
  return positionVector.join(" ");
}

//////////////////////////////////////////////////////////////////////////////
// Support for orbit fxn
function orbitalGenerator(vector, angle, rotationAxis) {
  var axes = findAxes(rotationAxis);

  var newCoord1 = Math.cos(angle)*vector[axes[0]] - Math.sin(angle)*vector[axes[1]];
  var newCoord2 = Math.sin(angle)*vector[axes[0]] + Math.cos(angle)*vector[axes[1]];

  vector[axes[0]] = newCoord1;
  vector[axes[1]] = newCoord2;

  return vector;
}

// Support for orbit fxn
function findAxes(rotationAxis) {
  var axes = [];
  for(var i = 0; i < 3; i++) {
    if(i != rotationAxis) {
      axes.push(i);
    }
  }
  return axes;
}

/////////////////////////////////////////////////////////////////////////////////

// Beginnings of zig zag
// if(position.z >= -50 && away)
//   position.z -= .5;
// else if (position.z <= -10 && away == false){
//   position.z += .5;
// }
// if(position.z <= -50)
//   away = false;
// if(position.z >= -30)
//   away = true;
