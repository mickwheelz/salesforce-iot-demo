public class DeviceListController {
    @AuraEnabled
    public static List <Smart_Device_Pin__c > getDevices() {
        return [SELECT Id, Name, Pin_Number__c, Power_State__c, Smart_Device__c, Smart_Device__r.Name, Smart_Device__r.Device_Id__c, Smart_Device__r.Smart_Home__c 
                FROM Smart_Device_Pin__c];
    }
    @AuraEnabled
    public static Boolean togglePower(Id devicePinId) {
        Smart_Device_Pin__c pin =  [SELECT Id, Name, Pin_Number__c, Power_State__c, 
                                    Smart_Device__c, Smart_Device__r.Name, 
                                    Smart_Device__r.Device_Id__c, Smart_Device__r.Smart_Home__c 
                                    FROM Smart_Device_Pin__c WHERE Id = :devicePinId];
        
        Smart_Device_Event__e event = new Smart_Device_Event__e();
        
        event.Device_ID__c = pin.Smart_Device__r.Device_Id__c;
        event.Pin_ID__c = pin.Pin_Number__c;
        event.Value__c = pin.Power_State__c ? 0 : 1;
        
       	EventBus.publish(event);
        
		Boolean newState = false;
        
        if(pin.Power_State__c) {
            newState = false;
        }
        else {
            newState = true;
        }
        
        pin.Power_State__c = newState;
        update pin;
        
        return newState;
    }
}