({
    onInit : function(component, event, helper) {
        component.set('v.cometdSubscriptions', []);
        component.set('v.notifications', "0");
        
        // Disconnect CometD when leaving page
        window.addEventListener('unload', function(event) {
            helper.disconnectCometd(component);
        });
        // Retrieve session id
        var action = component.get('c.getSessionId');
        action.setCallback(this, function(response) {
            if (component.isValid() && response.getState() === 'SUCCESS') {
                component.set('v.sessionId', response.getReturnValue());
                if (component.get('v.cometd') != null)
                    helper.connectCometd(component);
            }
            else
                console.error(response);
        });
        $A.enqueueAction(action);
    },
    onCometdLoaded : function(component, event, helper) {
        var cometd = new org.cometd.CometD();
        component.set('v.cometd', cometd);
        if (component.get('v.sessionId') != null)
            helper.connectCometd(component);
    },
    onGaugeLoaded : function(component, event, helper) {
        var opts = {
            angle: -0.2, // The span of the gauge arc
            lineWidth: 0.2, // The line thickness
            radiusScale: 1, // Relative radius
            pointer: {
                length: 0.6, // // Relative to gauge radius
                strokeWidth: 0.035, // The thickness
                color: '#000000' // Fill color
            },
            limitMax: false,     // If false, max value increases automatically if value > maxValue
            limitMin: false,     // If true, the min value of the gauge will be fixed
            colorStart: '#6FADCF',   // Colors
            colorStop: '#8FC0DA',    // just experiment with them
            strokeColor: '#E0E0E0',  // to see which ones work best for you
            generateGradient: true,
            highDpiSupport: true,     // High resolution support
            staticZones: [
                {strokeStyle: "#30B32D", min: 0, max: 100}, // Green
                {strokeStyle: "#FFDD00", min: 100, max: 250}, // Yellow
                {strokeStyle: "#F03E3E", min: 250, max: 1000}  // Red
            ],
            staticLabels: {
                font: "10px sans-serif",  // Specifies font
                labels: [0, 50, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900, 1000],  // Print labels at these values
                color: "#000000",  // Optional: Label text color
                fractionDigits: 0  // Optional: Numerical precision. 0=round off.
            },
            
        };
        var target = document.getElementById('gauge-canvas'); // your canvas element
        var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
        component.set('v.gauge', gauge);
        gauge.maxValue = 1000; // set max gauge value
        gauge.setMinValue(0);  // Prefer setter over gauge.minValue = 0
        gauge.animationSpeed = 32; // set animation speed (32 is default value)
        gauge.set(0); // set actual value
    }
})