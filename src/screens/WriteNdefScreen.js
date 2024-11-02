import React, { useContext, useEffect, useRef } from "react";
import { View, StyleSheet, SafeAreaView, Text, ScrollView } from "react-native";
import { Button, TextInput, Menu } from "react-native-paper";
import NfcManager from "react-native-nfc-manager";
import AndroidPrompt from "../components/AndroidPrompt";
import { NfcContext } from "../context/NfcContext";

import {
  industryDropdownOptions,
  professionDropdownOptions,
} from "../data/dropdownOptions";
import { TouchableOpacity } from "react-native";

function WriteNdefScreen() {
  const androidPromptRef = useRef();
  const {
    value,
    setValue,
    industryDropdownValue,
    setIndustryDropdownValue,
    professionDropdownValue,
    setProfessionDropdownValue,
    showIndustryMenu,
    setShowIndustryMenu,
    showProfessionMenu,
    setShowProfessionMenu,
    handleWriteNdef,
    resetFields,
  } = useContext(NfcContext);

  useEffect(() => {
    return () => {
      resetFields(); // Clear fields when leaving the screen
    };
  }, []);

  return (
    <>
      <SafeAreaView />
      <View style={styles.wrapper}>
        <View style={[styles.wrapper, styles.pad]}>
          <Text style={styles.label}>Industry</Text>
          <View style={styles.dropdownContainer}>
            <Menu
              visible={showIndustryMenu}
              onDismiss={() => setShowIndustryMenu(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setShowIndustryMenu(true)}
                  style={styles.dropdownButton}
                  labelStyle={styles.dropdownButtonText}
                >
                  {industryDropdownValue || "Select creative industry"}
                </Button>
              }
              style={styles.menu}
            >
              <ScrollView style={styles.menuScroll}>
                {industryDropdownOptions.map((option) => (
                  <Menu.Item
                    key={option.value}
                    onPress={() => {
                      setIndustryDropdownValue(option.value);
                      setProfessionDropdownValue("");
                      setShowIndustryMenu(false);
                    }}
                    title={option.label}
                    style={styles.menuItem}
                  />
                ))}
              </ScrollView>
            </Menu>
          </View>

          <Text style={styles.label}>Profession</Text>
          <View style={styles.dropdownContainer}>
            <Menu
              visible={showProfessionMenu}
              onDismiss={() => setShowProfessionMenu(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setShowProfessionMenu(true)}
                  disabled={!industryDropdownValue}
                  style={styles.dropdownButton}
                  labelStyle={styles.dropdownButtonText}
                >
                  {professionDropdownValue || "Select creative profession"}
                </Button>
              }
              style={styles.menu}
            >
              <ScrollView style={styles.menuScroll}>
                {(professionDropdownOptions[industryDropdownValue] || []).map(
                  (option) => (
                    <Menu.Item
                      key={option.value}
                      onPress={() => {
                        setProfessionDropdownValue(option.value);
                        setShowProfessionMenu(false);
                      }}
                      title={option.label}
                      style={styles.menuItem}
                    />
                  )
                )}
              </ScrollView>
            </Menu>
          </View>

          <Text style={styles.label}>Name</Text>
          <TextInput
            value={value}
            onChangeText={setValue}
            style={styles.input}
            placeholder="Enter creative name"
          />
        </View>

        <TouchableOpacity
          style={styles.readyButton}
          onPress={() => handleWriteNdef(androidPromptRef)}
          activeOpacity={0.7}
        >
          <Text style={styles.readyButtonText}>
            Ready to Write? Click Here!
          </Text>
        </TouchableOpacity>
        <AndroidPrompt
          ref={androidPromptRef}
          onCancelProps={() => {
            NfcManager.cancelTechnologyRequest();
          }}
        />

        <SafeAreaView style={styles.bgLight} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    //marginTop: 20,
  },
  pad: {
    padding: 20,
    paddingTop: 0,
  },
  dropdownContainer: {
    marginTop: 10,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "white",
    backgroundColor: "#E1F5FE",
  },
  bottom: {
    padding: 10,
    alignItems: "center",
  },
  bgLight: {
    backgroundColor: "#E1F5FE",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    color: "#0D5BFF",
  },
  input: {
    marginTop: 10,
  },
  menu: {
    marginTop: 100,
  },
  menuScroll: {
    maxHeight: 400,
  },
  menuItem: {
    paddingVertical: 10,
    backgroundColor: "#E1F5FE",
  },
  input: {
    marginTop: 10,
    backgroundColor: "#E1F5FE",
  },
  readyButton: {
    backgroundColor: "#E1F5FE", // Light background for contrast
    borderRadius: 15, // Rounded corners
    paddingVertical: 30, // Padding for a button feel
    paddingHorizontal: 30, // Horizontal padding
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    margin: 30,
    marginTop: 0,
  },
  readyButtonText: {
    color: "#0D5BFF",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  dropdownButtonText: {
    color: "#000", // Change this to the desired font color
  },
});

export default WriteNdefScreen;
