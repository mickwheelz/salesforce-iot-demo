trigger SmartDeviceEvent on Smart_Device_Event__e (after insert) {
    
    List<Smart_Device_Pin_History__c> sdphList = new List<Smart_Device_Pin_History__c>();
    Map<String, Boolean> compositeKeys = new Map<String, Boolean>();
        
    for(Smart_Device_Event__e sde :trigger.new) {
        compositeKeys.put(sde.Device_ID__c + '-' + sde.Pin_ID__c, (sde.Value__c == 0) ? true : false);
    }
    
    System.debug(compositeKeys);
    
    for(String s :compositeKeys.keySet()) {
        Smart_Device_Pin__c tempSDP = new Smart_Device_Pin__c(Composite_Key__c = s);
        Smart_Device_Pin_History__c sdph = new Smart_Device_Pin_History__c(
        	Smart_Device_Pin__r = tempSDP,
        	Power_State__c = compositeKeys.get(s)
        );

        sdphList.add(sdph);
    }
  
    insert sdphList;
}