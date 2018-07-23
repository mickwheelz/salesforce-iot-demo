({
      doInit: function(component, event, helper) {
        helper.getDeviceList(component);
      },
      powerButton: function(component, event, helper) {
          helper.powerButtonEvent(component, event, helper);
      }
    })