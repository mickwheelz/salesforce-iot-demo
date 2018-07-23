({
    getDeviceList: function(component) {
        var action = component.get('c.getDevices');
        var self = this;
        action.setCallback(this, function(actionResult) {
            component.set('v.devices', actionResult.getReturnValue());
        });
        $A.enqueueAction(action);
    },
    powerButtonEvent : function (component, event, helper) {
        var devPinId = event.target.getElementsByClassName('account-name')[0].value;
        var btnlabel = event.getSource().get('v.label');
        
        console.log(devPinId);
               
        var action = component.get('c.togglePower');
        action.setParams({ devicePinId : devPinId});
        var self = this;
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                this.getDeviceList(component);
             }
            else if (state === "INCOMPLETE") {
            }
                else if (state === "ERROR") {
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            console.log("Error message: " + 
                                        errors[0].message);
                        }
                    } else {
                        console.log("Unknown error");
                    }
                }
        });
        $A.enqueueAction(action);
    }
})