public class SessionHelper {
    @AuraEnabled
    public static String getSessionId() {
        return UserInfo.getSessionId();
    }
}