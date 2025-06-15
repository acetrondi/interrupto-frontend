"use client";

import { CloseIcon } from "@/components/CloseIcon";
import { NoAgentNotification } from "@/components/NoAgentNotification";
import TranscriptionView from "@/components/TranscriptionView";
import {
  BarVisualizer,
  DisconnectButton,
  RoomAudioRenderer,
  RoomContext,
  VideoTrack,
  VoiceAssistantControlBar,
  useVoiceAssistant,
} from "@livekit/components-react";
import { AnimatePresence, motion } from "framer-motion";
import { Room, RoomEvent } from "livekit-client";
import { useCallback, useEffect, useState } from "react";
import type { ConnectionDetails } from "./api/connection-details/route";

export default function Page() {
  const [room] = useState(new Room());

  const onConnectButtonClicked = useCallback(async () => {
    // Generate room connection details, including:
    //   - A random Room name
    //   - A random Participant name
    //   - An Access Token to permit the participant to join the room
    //   - The URL of the LiveKit server to connect to
    //
    // In real-world application, you would likely allow the user to specify their
    // own participant name, and possibly to choose from existing rooms to join.

    const url = new URL(
      process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ?? "/api/connection-details",
      window.location.origin
    );
    const response = await fetch(url.toString());
    const connectionDetailsData: ConnectionDetails = await response.json();

    await room.connect(connectionDetailsData.serverUrl, connectionDetailsData.participantToken);
    await room.localParticipant.setMicrophoneEnabled(true);

    console.log("from parent: ", room.localParticipant);
  }, [room]);

  useEffect(() => {
    room.on(RoomEvent.MediaDevicesError, onDeviceFailure);

    return () => {
      room.off(RoomEvent.MediaDevicesError, onDeviceFailure);
    };
  }, [room]);

  return (
    <main data-lk-theme="default" className="h-screen flex flex-col">
      <div className="storyteller-title text-5xl font-bold text-center py-8 transition-all duration-300 sticky top-0 z-10">
        🎭 WELCOME TO INTERRUPTO 📚
      </div>
      <RoomContext.Provider value={room}>
        <div className="flex-1 flex flex-col max-w-[var(--content-max-width)] w-[90vw] mx-auto">
          <SimpleVoiceAssistant onConnectButtonClicked={onConnectButtonClicked} room={room} />
        </div>
      </RoomContext.Provider>
    </main>
  );
}

function SimpleVoiceAssistant(props: { onConnectButtonClicked: () => void; room: Room }) {
  const { state: agentState } = useVoiceAssistant();

  return (
    <div className="flex-1 flex flex-col storyteller-container">
      <AnimatePresence mode="wait">
        {agentState === "disconnected" ? (
          <motion.div
            key="disconnected"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: [0.68, -0.55, 0.265, 1.55] }}
            className="flex-1 flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.68, -0.55, 0.265, 1.55] }}
              className="text-center"
            >
              <div className="text-6xl mb-6 wiggle">🎪</div>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="theme-button bounce-in floating-element"
                onClick={() => props.onConnectButtonClicked()}
              >
                🌟 Start Your Story Adventure 🌟
              </motion.button>
              <p className="mt-6 text-lg text-[var(--color-text-secondary)] font-medium">
                Ready for an interactive storytelling experience? 📖✨
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="connected"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.68, -0.55, 0.265, 1.55] }}
            className="flex-1 flex flex-col p-6"
          >
            <div className="flex-1 flex flex-col items-center justify-center gap-8">
              <AgentVisualizer />
              <div className="flex-1 w-full max-h-[40vh] overflow-y-auto theme-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">📜</span>
                  <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">Story Transcript</h3>
                  <span className="text-2xl floating-element">✨</span>
                </div>
                <div className="text-[var(--color-text-primary)]">
                  <TranscriptionView />
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 w-full py-6">
              <ControlBar onConnectButtonClicked={props.onConnectButtonClicked} room={props.room} />
            </div>
            <RoomAudioRenderer />
            <NoAgentNotification state={agentState} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AgentVisualizer() {
  const { state: agentState, videoTrack, audioTrack } = useVoiceAssistant();

  if (videoTrack) {
    return (
      <div className="h-[512px] w-[512px] rounded-[var(--border-radius-xl)] overflow-hidden theme-shadow-pink storyteller-container">
        <VideoTrack trackRef={videoTrack} />
      </div>
    );
  }
  return (
    <div className="h-[300px] w-full agent-visualizer theme-shadow">
      <div className="flex items-center justify-center gap-3 mb-4">
        <span className="text-3xl">🎭</span>
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">AI Storyteller</h2>
        <span className="text-3xl floating-element">🎪</span>
      </div>
      <BarVisualizer
        state={agentState}
        barCount={7}
        trackRef={audioTrack}
        className="agent-visualizer"
        options={{ minHeight: 32, maxHeight: 64 }}
      />
    </div>
  );
}

function ControlBar(props: { onConnectButtonClicked: () => void; room: Room }) {
  const { state: agentState } = useVoiceAssistant();

  // const handleGreet = async () => {
  //   alert("fuck you!");

  //   try {
  //     console.log("not from parent: ", props.room.localParticipant);
  //     console.log("room is:", "AW_DDVV5ynPkSKA");
  //     const response = await props.room.localParticipant.performRpc({
  //       destinationIdentity: props.room.localParticipant.firstActiveAgent.identity,
  //       method: "greet_peeps",
  //       payload: "Hello from asdf!",
  //     });
  //     console.log("RPC response:", response);
  //   } catch (error) {
  //     console.error("RPC call failed:", error);
  //   }
  // };

  return (
    <div className="relative h-[80px] flex items-center justify-center">
      <AnimatePresence>
        {agentState === "disconnected" && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, ease: [0.68, -0.55, 0.265, 1.55] }}
            className="theme-button floating-element"
            onClick={() => props.onConnectButtonClicked()}
          >
            🎪 Join the Story Circle 🎪
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {agentState !== "disconnected" && agentState !== "connecting" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.68, -0.55, 0.265, 1.55] }}
            className="flex items-center justify-center gap-6 theme-card p-4"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎙️</span>
              <VoiceAssistantControlBar controls={{ leave: false }} />
            </div>
            {/* <button
              onClick={handleGreet}
              className="mx-2 px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Greet
            </button> */}
            <DisconnectButton>
              <div className="flex items-center gap-2">
                <span className="text-lg">👋</span>
                <CloseIcon />
              </div>
            </DisconnectButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function onDeviceFailure(error: Error) {
  console.error(error);
  alert(
    "Oops! 🎭 We need camera and microphone permissions to start your story adventure. Please grant permissions and refresh the page! ✨"
  );
}
