import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  StyleSheet,
  SectionList,
} from "react-native";
import { ChannelListItem } from "./ChannelListItem";
import { useWatchedChannels } from "../hooks/useWatchedChannels";

export const ChannelList = ({ client, changeChannel }) => {
  const {
    activeChannelId,
    setActiveChannelId,
    unreadChannels,
    readChannels,
    oneOnOneConversations,
  } = useWatchedChannels(client, changeChannel);

  const renderChannelRow = (channel, isUnread) => {
    const isOneOnOneConversation =
      Object.keys(channel.state.members).length === 2;

    return (
      <ChannelListItem
        activeChannelId={activeChannelId}
        setActiveChannelId={setActiveChannelId}
        changeChannel={changeChannel}
        isOneOnOneConversation={isOneOnOneConversation}
        isUnread={isUnread}
        channel={channel}
        client={client}
        key={channel.id}
        currentUserId={client.user.id}
      />
    );
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TextInput
            style={styles.inputSearchBox}
            placeholderTextColor="grey"
            placeholder="Jump to"
          />
        </View>

        <SectionList
          style={styles.sectionList}
          sections={[
            {
              title: "Unread",
              id: "unread",
              data: unreadChannels || [],
            },
            {
              title: "Channels",
              data: readChannels || [],
            },
            {
              title: "Direct Messages",
              data: oneOnOneConversations || [],
            },
          ]}
          keyExtractor={(item, index) => item.id + index}
          renderItem={({ item, section }) => {
            return renderChannelRow(item, section.id === "unread");
          }}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.groupTitleContainer}>
              <Text style={styles.groupTitle}>{title}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 5,
    flexDirection: "column",
    justifyContent: "flex-start",
    height: "100%",
  },
  headerContainer: {
    padding: 10,
    marginRight: 10,
  },
  inputSearchBox: {
    backgroundColor: "#2e0a2f",
    padding: 10,
  },
  sectionList: {
    flexGrow: 1,
    flexShrink: 1,
  },
  groupTitleContainer: {
    padding: 10,
    borderBottomColor: "#995d9a",
    borderBottomWidth: 0.3,
    marginBottom: 7,
    backgroundColor: "#3F0E40",
  },
  groupTitle: {
    color: "white",
    fontWeight: "100",
    fontSize: 12,
    fontFamily: "Lato-Regular",
  },
});
