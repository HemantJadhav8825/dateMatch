import { Alert } from "react-native";
import { acceptCall, rejectCall } from "./CallNotifier";
import { navigate } from "../components/RootNavigation"; // path may differ
import { STACK_ROUTES } from "../constants/routes";

const showIncomingCallUI = ({ sessionId, from, room, token }) => {
  Alert.alert(
    "Incoming Call",
    `Call from ${from?.name || "Unknown"}`,
    [
      { text: "Reject", onPress: () => rejectCall(sessionId), style: "cancel" },
      {
        text: "Accept",
        onPress: () => {
          acceptCall(sessionId);
          navigate(STACK_ROUTES.VOICE_CALL, {
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
