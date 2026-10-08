(function( window, document, undefined ) {

document.pause = false;
var $ = window.jQuery
  , defaultTime = 30
  , breakTime = 10
  , startupTime = 5
  , excercises = [
    { name: 'Jumping jacks' },
    { name: 'Wall sit' },
    { name: 'Push-ups' },
    { name: 'Abdominal crunch' },
    { name: 'Step-up onto chair' },
    { name: 'Pull ups' },
    { name: 'Squat' },
    { name: 'Triceps dip on chair' },
    { name: 'Plank' },
    { name: 'High knees' },
    { name: 'Lunge' },
    { name: 'Push-up and rotation' },
    { name: 'Chin ups' },
    { name: 'Side plank left', time: defaultTime / 2 },
    { name: 'Side plank right', time: defaultTime / 2 },
    { name: 'misc' },
    { name: 'misc 2' }
  ]
  , activityDiv = $( '.activity' )
  , timerDiv = $( '.timer' )
  , upcomingDiv = $( '.coming-up' )
  , withSound = true
  ;

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

function go() {
  var queue = new Queue();
  queue.append( function() {
    startTimer( this, "brace yourself...", startupTime, excercises[0].name );
  } );
  $.each( excercises, function( index, item ) {
    var upcomingExcercise = excercises[index+1] ? excercises[index+1].name : "";
    queue.append( function() {
      startTimer( this, item.name, item.time ? item.time : defaultTime, item.nobreak ? upcomingExcercise : "break" );
    } );

    if ( !item.nobreak && upcomingExcercise !== "" ) {
      queue.append( function() {
        startTimer( this, "break", breakTime, upcomingExcercise );
      } );
    }
  } );
  queue.append( function() {
    done( this );
  } );
}


function startTimer( defe, step, time, upcoming ) {
  var currtime = 0
    , timer = function( o ) {
      if ( currtime === time ) {
        if ( ga && step !== "break" )
          ga( 'send', 'event', step, 'stop', 'excercise' );
        o.resolve();
      } else {

        if (!document.pause) {
          currtime++;
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

    timer( defe );
}

function done( o ) {
  ga( 'send', 'event', 'hell', 'is over', 1 );
  activityDiv.html( "congratulations, it's" );
  timerDiv.html( "DONE!" );
  upcomingDiv.html( "" );
  o.resolve();
}

$( '.startup, .startup-with-sound' ).click( function() {
  $( '.startup-actions' ).hide();
  if ( $(this).hasClass( 'startup-with-sound' ) ) {
    ga( 'send', 'event', 'hell', 'with sound', 1 );
    document.getElementById('beep').play();
  } else {
    ga( 'send', 'event', 'hell', 'without sound', 1 );
    withSound = false;
  }
  go();
} );

$( '.pause' ).click( function() {
	  document.pause = !document.pause;

	if (document.pause)
	  document.getElementById("pause").text = "Unpause"
	else
	  document.getElementById("pause").text = "Pause"

} );



} )( window, document );