import "react-native-gesture-handler";
import AppLoading from "expo-app-loading";
import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Text, StyleSheet } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Chat, MessageList, MessageInput, Channel } from "stream-chat-expo";

import { ChannelList } from "./components/ChannelList";
import { ChannelHeader } from "./components/ChannelHeader";
import { MessageSlack } from "./components/Message/MessageSlack";
import { DateSeparator } from "./components/Message/DateSeparator";
import { InputBox } from "./components/InputBox";

import streamChatTheme from "./stream-chat-theme.js";

import { StreamChat } from "stream-chat";

const chatClient = new StreamChat("q95x9hkbyd6p");
const userToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidmlzaGFsIn0.LpDqH6U8V8Qg9sqGjz0bMQvOfWrWKAjPKqeODYM0Elk";
const user = {
  id: "vishal",
  name: "Vishal",
};

chatClient.connectUser(user, userToken);

/** This is where you will put your channel component which container MessageList and MessageInput component  */
function ChannelScreen({ navigation, route }) {
  const [channel, setChannel] = useState(null);
  useEffect(() => {
    if (!channel) {
      navigation.openDrawer();
    }
    const channelId = route.params ? route.params.channelId : null;
    const _channel = chatClient.channel("messaging", channelId);
    setChannel(_channel);
  }, [route.params]);

  return (
    <SafeAreaView style={styles.channelScreenSaveAreaView}>
      <View style={styles.channelScreenContainer}>
        <ChannelHeader
          navigation={navigation}
          channel={channel}
          client={chatClient}
        />
        <View style={styles.chatContainer}>
          {/* <Chat client={chatClient} style={streamChatTheme}>
            <Channel channel={channel}>
              <MessageList
                Message={MessageSlack}
                DateSeparator={DateSeparator}
              />
              <MessageInput
                Input={InputBox}
                additionalTextInputProps={{
                  placeholderTextColor: "#979A9A",
                  placeholder:
                    channel && channel.data.name
                      ? "Message #" +
                        channel.data.name.toLowerCase().replace(" ", "_")
                      : "Message",
                }}
              />
            </Channel>
          </Chat> */}
        </View>
      </View>
    </SafeAreaView>
  );
}

/** This is where you will put your channel list based navigation  */
const ChannelListDrawer = (props) => {
  return (
    <ChannelList
      client={chatClient}
      changeChannel={(channelId) => {
        props.navigation.jumpTo("ChannelScreen", {
          channelId,
        });
      }}
    />
  );
};

const Drawer = createDrawerNavigator();

export default function App() {
  let [fontsLoaded] = useFonts({
    "Lato-Regular": require("./assets/fonts/Lato-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  // useEffect(() => {
  //   FontFace.loadAsync()
  // }, [])

  return (
    <NavigationContainer>
      <View style={styles.container}>
        <Drawer.Navigator
          drawerContent={ChannelListDrawer}
          drawerStyle={styles.drawerNavigator}
        >
          <Drawer.Screen name="ChannelScreen" component={ChannelScreen} />
        </Drawer.Navigator>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  channelScreenSaveAreaView: {
    backgroundColor: "white",
  },
  channelScreenContainer: { flexDirection: "column", height: "100%" },
  container: {
    flex: 1,
  },
  drawerNavigator: {
    backgroundColor: "#3F0E40",
    width: 350,
  },
  chatContainer: {
    backgroundColor: "white",
    flexGrow: 1,
    flexShrink: 1,
  },
});
