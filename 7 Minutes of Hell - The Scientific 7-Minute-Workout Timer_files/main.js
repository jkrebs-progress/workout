var QueryString = function () {
  // This function is anonymous, is executed immediately and
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = pair[1];
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]], pair[1] ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(pair[1]);
    }
  }
    return query_string;
} ();


$(':checkbox').change(function() {
  document.havePullupBar = document.getElementById("havePullupBar").checked;
  document.plyometricsOnly = document.getElementById("plyometricsOnly").checked;
  if (document.havePullupBar) {
    setCookieX("havePullupBar", document.havePullupBar, 365);
  } else {
    setCookieX("havePullupBar", document.havePullupBar, -1);
  }
  if (document.plyometricsOnly) {
    setCookieX("plyometricsOnly", document.plyometricsOnly, 365);
  } else {
    setCookieX("plyometricsOnly", document.plyometricsOnly, -1);
  }
  setTotalTime();
});

function setTotalTime() {
   var totalTime = 0;
   totalMult = 0;
   for (exId in document.exercises) {
	ex = document.exercises[exId];
	if (!includeExercise(ex)) {
	  continue;
	}

     	if (ex.multiplier) {
   		  totalTime += Math.round(document.defaultTime * ex.multiplier);
   		  totalMult += ex.multiplier;
         } else {
           totalTime += document.defaultTime;
           totalMult++;
         }
   	}
   totalTime += document.breakTime * totalMult;
   var totMin = Math.floor(totalTime / 60);
   var totSec = Math.round(((totalTime / 60) - totMin) * 60);

   document.getElementById("totTimeMin").defaultValue = totMin;
   document.getElementById("totTimeSec").defaultValue = totSec;
}

function getCookieX(name) {
  return localStorage.getItem(name);
}

function setCookieX(name,value) {
  localStorage.setItem(name, value);	
  return null;
}

$('input').on('input',function(e){
 var elem = $( this );
 if (( elem.attr( "name" ).match( "totTimeMin" ) ) || ( elem.attr( "name" ).match( "totTimeSec" ) )) {
   totalMult = 0;
   for (exId in document.exercises) {
     	ex = document.exercises[exId];
	if (!includeExercise(ex)) {
	  continue;
	}

     	if (ex.multiplier) {
     	   totalMult += ex.multiplier;
         } else
           totalMult += 1;
   }
   totalTime = (parseInt(document.getElementById("totTimeMin").value) * 60) + parseInt(document.getElementById("totTimeSec").value);
   document.defaultTime = Math.round(totalTime / totalMult) - document.breakTime;
   document.getElementById("exTime").value = document.defaultTime;
   setCookieX("exTime", document.defaultTime, 365);
 } else if ( elem.attr( "name" ).match( "exTime" ) ) {
   document.defaultTime = parseInt($('input').val())
   setCookieX("exTime", document.defaultTime, 365);
   setTotalTime();
 } else if ( elem.attr( "name" ).match( "restTime" ) ) {
   document.breakTime = parseInt($('input#restTime').val())
   setCookieX("restTime", document.breakTime, 365);
     var totalTime = 0;
     totalMult = 0;
     for (exId in document.exercises) {
     	ex = document.exercises[exId];
	if (!includeExercise(ex)) {
	  continue;
	}

     	if (ex.multiplier) {
   		  totalTime += Math.round(document.defaultTime * ex.multiplier);
   		  totalMult += ex.multiplier;
         } else {
           totalTime += document.defaultTime;
           totalMult++;
         }
   	}
   totalTime += document.breakTime * totalMult;
   var totMin = Math.floor(totalTime / 60);
   var totSec = Math.round(((totalTime / 60) - totMin) * 60);

   document.getElementById("totTimeMin").defaultValue = totMin;
   document.getElementById("totTimeSec").defaultValue = totSec;
 }
});


(function( window, document, undefined ) {

document.havePullupBar = getCookieX("havePullupBar");
document.plyometricsOnly = getCookieX("plyometricsOnly");
document.leftFirst = getCookieX("leftFirst") === "true";
setCookieX("leftFirst",!(document.leftFirst),360);

document.exTime = getCookieX("exTime");
if (document.exTime == null) {
  document.exTime = "30";
}


document.breakTime = getCookieX("restTime");
if (document.breakTime == null) {
  document.breakTime = "10";
}

document.originalUrl = document.URL.substring(0, document.URL.indexOf('&'));

document.getElementById("havePullupBar").checked = document.havePullupBar;
document.getElementById("plyometricsOnly").checked = document.plyometricsOnly;

document.getElementById("exTime").defaultValue = document.exTime;
document.getElementById("restTime").defaultValue = document.breakTime;

document.pause = false;
document.exercises = [
    { name: 'Jumping jacks' , multiplier: 1, plyometric : true},
    { name: 'Push-ups' , multiplier: 1, plyometric : true},
    { name: 'Abdominal crunch' , multiplier: 1.1, plyometric : true},
    { name: 'High knees' , multiplier: 1, plyometric : true},
    { name: 'Plank' , multiplier: 1, plyometric : true},
    { name: 'Step-up onto chair' , multiplier: 1, plyometric : true},
    { name: 'Shoulder press ' + getFirstSide() , multiplier: .6, plyometric : false},
    { name: 'Shoulder press ' + getSecondSide() , multiplier: .6, plyometric : false},
    { name: 'Row ' + getFirstSide() , multiplier: .6, plyometric : false},
    { name: 'Row ' + getSecondSide() , multiplier: .6, plyometric : false},
    { name: 'Wall sit' , multiplier: 1.1, needPullupBar: false, plyometric : true},
    { name: 'Push-up and rotation' , multiplier: 1, plyometric : true},
    { name: 'Squat' , multiplier: 1, plyometric : true},
    { name: 'Side plank ' + getFirstSide(),  multiplier: .6, plyometric : true},
    { name: 'Side plank ' + getSecondSide(), multiplier: .6, plyometric : true},
    { name: 'Curls' , multiplier: 1, plyometric : true},
    { name: 'Back-bends' , multiplier: 1, plyometric : true},
    { name: 'Lunge' , multiplier: 1, plyometric : true},
    { name: 'Dips' , multiplier: 1, needPullupBar: false, plyometric : true},
    { name: 'upright row', multiplier: 1 , plyometric : false},
    { name: 'Hip Thrusts' , multiplier: 1, plyometric : true}
  ]
document.defaultTime = parseInt(document.getElementById("exTime").value)
document.breakTime = parseInt(document.getElementById("restTime").value)

  var totalTime = 0;
  totalMult = 0;
  for (exId in document.exercises) {
  	ex = document.exercises[exId];
  	if (!includeExercise(ex)) {
  	  continue;
  	}
  	if (ex.multiplier) {
		  totalTime += Math.round(document.defaultTime * ex.multiplier);
		  totalMult += ex.multiplier;
      } else {
        totalTime += document.defaultTime;
        totalMult++;
        }

	}
totalTime += document.breakTime * totalMult;
var totMin = Math.floor(totalTime / 60);
var totSec = Math.round(((totalTime / 60) - totMin) * 60);

document.getElementById("totTimeMin").defaultValue = totMin;
document.getElementById("totTimeSec").defaultValue = totSec;

var $ = window.jQuery
  , startupTime = 5
  , excercises = document.exercises
  , activityDiv = $( '.activity' )
  , timerDiv = $( '.timer' )
  , upcomingDiv = $( '.coming-up' )
  , upcomingDiv2 = $( '.coming-up-2' )
  , totalTimeDiv = $( '.total-time-input' )
  , havePullupBarDiv = $( '.have-pullup-bar' )
  , plyometricsOnlyDiv = $( '.plyometrics-only' )
  , elapsedTimeDiv = $( '.elapsed-time' )
  , withSound = true
  , currentExercise = 0
  ;
  var totalTime = 0;
  for (exId in excercises) {
  	ex = excercises[exId]
	if (!includeExercise(ex)) {
	  continue;
	}

	if (ex.multiplier) {
		totalTime += Math.round(document.defaultTime * ex.multiplier);
      } else
        totalTime += document.defaultTime;
      totalTime += Math.round(document.breakTime  * ex.multiplier);
	}


var Queue = function() {
  this.promise = $(this).promise();
}

Queue.prototype.append = function() {
  var args = arguments;

  var fn = args[0];
  if (!fn || !$.isFunction(fn)) {
    throw new TypeError('1st parameter should be a function');
  }

  var self = this;
  args = Array.prototype.slice.call(args, 1);
  return this.promise = this.promise.pipe(function () {
    return $.Deferred(function () {
      try {
        return fn.apply(this, args);
      } catch (ex) {
        // log exception
        this.reject(ex);
        return self.promise = $(self).promise();
      }
    }).promise();
  });
}

// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                                 ? this
                                 : oThis,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

function getFirstSide() {
  if (document.leftFirst) {
    return "left";
  }
  return "right";
}

function getSecondSide() {
  if (document.leftFirst) {
    return "right";
  }
  return "left";
}

function getTimeString(seconds) {
  return (Math.floor(seconds/60)) + " minutes and " + (seconds%60) + " seconds."
}

function getElapsedSeconds(index) {
  var totalTime = 0;
  for (exId in excercises) {
	if (!includeExercise(ex)) {
	  continue;
	}
	  if (index < exId) break;
	  ex = excercises[exId]
	    	if (!includeExercise(ex)) {
	    	  continue;
	    	}

      if (ex.multiplier) {
		  totalTime += Math.round(document.defaultTime * ex.multiplier);
      } else
        totalTime += document.defaultTime;
      totalTime += Math.round(document.breakTime * ex.multiplier);
	}
  return totalTime;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return null;
}

function go() {
  var queue = new Queue();
  var filteredEx = Array();
  $.each( excercises, function( index, item ) {
    if (includeExercise(excercises[index])) {
      filteredEx.push(excercises[index]);
    }
  } );
  excercises = filteredEx;
  queue.append( function() {
    startTimer( this, "brace yourself...", startupTime, excercises[0].name, excercises[1].name );
  } );
  $.each( excercises, function( index, item ) {
    var upcomingExcercise = excercises[index+1] ? excercises[index+1].name : "";
    var upcomingExcercise2 = excercises[index+2] ? excercises[index+2].name : "";
    queue.append( function() {
      startTimer( this, item.name, item.multiplier ? Math.round(item.multiplier * document.defaultTime) : document.defaultTime, upcomingExcercise, upcomingExcercise2, index);
    } );

    if ( !item.nobreak && upcomingExcercise !== "" ) {
      queue.append( function() {
        startTimer( this, "break", Math.round(document.breakTime * excercises[index].multiplier), upcomingExcercise, upcomingExcercise2 );
      } );
    }
  } );
  queue.append( function() {
    done( this );
  } );
}


function startTimer( defe, step, time, upcoming, upcoming2, index ) {
  var currtime = 0
    , timer = function( o ) {
      if ( currtime === time ) {
        if ( ga && step !== "break" ) {
          ga( 'send', 'event', step, 'stop', 'excercise' );
          if (index != null) {
            elapsedTimeDiv.html( "Elapsed time: " + getTimeString(getElapsedSeconds(index) ));
	      }
	    }
        o.resolve();
      } else {

        if (!document.pause) {
          currtime++;
	    }

        if (document.skip) {
          currtime = time;
          document.skip = false;
	    }

        var tr = time - currtime
          , min = parseInt( tr / 60 )
          , sec = tr % 60;

        if ( tr < 6 || tr % 10 == 0 ) {
          if ( withSound && !document.pause )
            document.getElementById('beep').play();
        }

        sec = sec < 10 ? "0" + sec : "" + sec;

        timerDiv.html( min + ":" + sec );
        setTimeout( function() {
          timer( o );
        }.bind( o ), 1000 );
      }
    };

    if ( ga && step !== "break" )
      ga( 'send', 'event', step, 'start', 'excercise' );
    activityDiv.html( step );
    upcomingDiv.html( upcoming );
    upcomingDiv2.html( upcoming2 );
    timer( defe );
}

function done( o ) {
  ga( 'send', 'event', 'hell', 'is over', 1 );
  activityDiv.html( "congratulations, it's" );
  timerDiv.html( "DONE!" );
  document.getElementById("pause").text = "Restart";
  document.done = true;
  upcomingDiv.html( "" );
  o.resolve();
}


$( '.show-exercises' ).click( function() {
  var display = "";
  for (exId in document.exercises) {
  	ex = document.exercises[exId];
  	if (includeExercise(ex)) {
  		time = Math.round(document.defaultTime * ex.multiplier);
  		display += ex.name + " for " + time + " seconds.\n";
  	}
  }
	alert(display);
  } );

$( '.skip-exercise' ).click( function() {
document.skip = true;
  } );


$( '.startup, .startup-with-sound' ).click( function() {
	doStartup($(this).hasClass( 'startup-with-sound' ));
  } );

function doStartup(inSound) {
  $( '.startup-actions' ).hide();
  if ( inSound ) {
    document.getElementById('beep').play();
  } else {
    withSound = false;
  }
  go();

}

jQuery( document ).ready(function( $ ) {
	if (QueryString.autostart) {
		doStartup(QueryString.withsound);
	}
});

$( '.pause' ).click( function() {
	if (document.done) {
		url = document.originalUrl + "?autostart=true";
		if (withSound) {
		  url = url + "&withsound=" + withSound;
		}

		open(url, "_self");
	}
	else {
		document.pause = !document.pause;
		if (document.pause)
		  document.getElementById("pause").text = "Unpause"
		else
		  document.getElementById("pause").text = "Pause"
	}

} );



} )( window, document );

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function includeExercise(exercise) {
  return !((exercise.needPullupBar && !document.havePullupBar) ||
           (document.plyometricsOnly && !(exercise.plyometric)));
}
