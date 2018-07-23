trigger SmartDeviceTrigger on Smart_Device_Pin__c (before insert, before update) {
    
    Map<Id, String> smartDeviceToDevId = new Map<Id, String>();
    
    List<Id> smartDeviceIds = new List<Id>();
    
    for(Smart_Device_Pin__c sdp :trigger.new) {
        smartDeviceIds.add(sdp.Smart_Device__c);
    }
    
    List<Smart_Device__c> devices = [ SELECT ID, Device_Id__c FROM Smart_Device__c WHERE Id IN :smartDeviceIds];
    
    for(Smart_Device__c dev: devices) {
        smartDeviceToDevId.put(dev.Id, dev.Device_Id__c);
    }

    for(Smart_Device_Pin__c sdp :trigger.new) {
        sdp.Smart_Device_ID__c = smartDeviceToDevId.get(sdp.Smart_Device__c);
        sdp.Composite_Key__c = smartDeviceToDevId.get(sdp.Smart_Device__c) + '-' + sdp.Pin_Number__c;
    }

}