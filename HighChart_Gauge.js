// This is an example taken out from http://highcharts.uservoice.com/forums/55896-general/suggestions/746704-angular-gauges
function drawDial(options) {

var renderTo = options.renderTo,
    value = options.value,
    centerX = options.centerX,
    centerY = options.centerY,
    min = options.min,
    max = options.max,
    minAngle = options.minAngle,
    maxAngle = options.maxAngle,
    tickInterval = options.tickInterval,
    dialSize = options.centerX - 30,
    ranges = options.ranges,
    texts = [],
    currentValue = 0,
    subtitle_offset = 0;
  
var renderer = new Highcharts.Renderer(
    document.getElementById(renderTo),
    options.width,
    options.height
);

// internals
var angle,
    store = options.store,
    pivot;

function valueToAngle(value) {
    return (maxAngle - minAngle) / (max - min) * value + minAngle;
}

// Set the details text for the dial
function setSubtitle(value, append) {

    if (!append) {
      // Remove all the text elements
      for (var i = 0; i < texts.length; i++)
        texts[i].destroy();
      texts = [];

      subtitle_offset = centerY - (centerY * 0.67) ;
    } else {
      subtitle_offset = subtitle_offset + 20;
    }
    var el = renderer.text(value, options.width * 0.60, subtitle_offset );
    texts.push(el);
    el.add();
}

function setValue(val) {
    // the pivot
    angle = valueToAngle(val);
    
    var path = [
         'M',
         centerX-1, centerY,
         'L',
         centerX + (dialSize - 50) * Math.cos(angle), centerY + (dialSize - 50) * Math.sin(angle)
         ,'M',
         centerX+1, centerY,
         'L',
         centerX + (dialSize - 50) * Math.cos(angle), centerY + (dialSize - 50) * Math.sin(angle)
     ];
    
    if (!pivot) {
        pivot = renderer.path(path)
        .attr({
            stroke: '#555555',
            'stroke-width': 1,
        })
        .add();
    } else {
        pivot.attr({
            d: path
        });
    }

    value = val;
}

function setValueAnim(val) {

    // Same value - no animation
    if (value == val) {
      return;
    }

    var stepVal = (val - value) / 19;
    var step = 1;
    var startValue = value;

    //console.log("setValueAnim " + val + ' value ' + value + ' stepVal ' + stepVal);

    var intvl = setInterval(function() {
      // console.log("setting interval value " + (startValue + (stepVal * step)));
      setValue(startValue + (stepVal * step));
      step = step + 1;
      if (step == 20) {
        clearInterval(intvl);
      }
    }, 50);
}

// background area
renderer.arc(centerX, centerY, dialSize, 0, minAngle, maxAngle)
    .attr({
        fill: {
            linearGradient: [0, 50, 50, 200],
            stops: [
                [0, '#FFF'],
                [1, '#B1B1B1']
            ]
        },
        stroke: 'silver',
        'stroke-width': 2
    })
    .add();


// ranges
$.each(ranges, function(i, rangesOptions) {
    renderer.arc(
        centerX, 
        centerY, 
        dialSize - 6, 
        dialSize - 25, 
        valueToAngle(rangesOptions.from), 
        valueToAngle(rangesOptions.to)
    )
    .attr({
        fill: {
          linearGradient: rangesOptions.linearGradient,
	  stops: [
             [0, rangesOptions.fromColor ],
	     [1, rangesOptions.toColor ]
	  ]
	} 
    })
    .add();
});

// ticks
for (var i = min; i <= max; i += tickInterval) {
    
    angle = valueToAngle(i);
    
    // draw the tick marker
    renderer.path([
            'M',
            centerX + (dialSize - 6) * Math.cos(angle), centerY + (dialSize - 6) * Math.sin(angle),
            'L',
            centerX + (dialSize - 25) * Math.cos(angle), centerY + (dialSize - 25) * Math.sin(angle)
        ])
        .attr({
            stroke: 'silver',
            'stroke-width': 2
        })
        .add();
    
    // draw the text
    renderer.text(
            i, 
            centerX + (dialSize - 40) * Math.cos(angle),
            centerY + (dialSize - 40) * Math.sin(angle)
        )
        .attr({
            align: 'center'
        })
        .add();
    
}

// the initial value
setValue(value);

setSubtitle(options.subtitle);

// center disc
renderer.circle(centerX, centerY, 5)
    .attr({
        fill: {
          linearGradient: [ 50, 150, 150, 200 ],
	  stops: [
	    [ 0, '#FFFFFF' ],
	    [ 1, '#C0C0C0' ]
	  ]  
	},
        stroke: '#818181',
        'stroke-width': 1
    })
    .add();

return {
    setValue: setValue,
    setValueAnim: setValueAnim,
    setSubtitle: setSubtitle
};

}
    
    
// Build the dial
/*
var dial = drawDial({
    renderTo: 'container',
    value: 80,
    centerX: 200,
    centerY: 200,
    min: 0,
    max: 200,
    minAngle: -Math.PI,
    maxAngle: 0,
    tickInterval: 20,
    ranges: [{
        from: 0,
        to: 100,
        color: '#55BF3B'
    }, {
        from: 80,
        to: 160,
        color: '#DDDF0D'
    }, {
        from: 160,
        to: 200,
        color: '#DF5353'
    }] 
});

// Button handlers
$('#set0').click(function() {
    dial.setValue(0);
});
$('#set80').click(function() {
    dial.setValue(80);
});
$('#set160').click(function() {
    dial.setValue(160);
});
*/
