import { acceptCall, rejectCall } from "./CallNotifier";

const { useNavigation } = require("@react-navigation/native");
const { Alert } = require("react-native");

const showIncomingCallUI = ({ sessionId, from, room, token }) => {
    const navigation = useNavigation();
    Alert.alert(
        "Incoming Call",
        `Call from ${from.name}`,
        [
            { text: "Reject", onPress: () => rejectCall(sessionId), style: "cancel" },
            {
                text: "Accept", onPress: () => {
                    acceptCall(sessionId);
                    navigation.navigate("VoiceCallScreen", {
                        token,
                        room,
                        isCaller: false,
                    });
                }
            }
        ]
    );
};

export { showIncomingCallUI };