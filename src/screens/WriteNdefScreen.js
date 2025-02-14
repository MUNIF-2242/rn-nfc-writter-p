import React, { useContext, useEffect, useRef, useState } from "react";
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

  const [customProfession, setCustomProfession] = useState("");

  useEffect(() => {
    return () => {
      resetFields();
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
                      setCustomProfession("");
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

                        if (option.value === "Others") {
                          setCustomProfession("");
                        }
                      }}
                      title={option.label}
                      style={styles.menuItem}
                    />
                  )
                )}
              </ScrollView>
            </Menu>
          </View>

          {professionDropdownValue === "Others" && (
            <View>
              <Text style={styles.label}>Enter other profession name</Text>
              <TextInput
                value={customProfession}
                onChangeText={setCustomProfession}
                style={styles.input}
                placeholder="Enter your profession"
              />
            </View>
          )}

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
          onPress={() => handleWriteNdef(androidPromptRef, customProfession)}
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
    backgroundColor: "#E1F5FE",
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
    backgroundColor: "#E1F5FE",
  },
  readyButton: {
    backgroundColor: "#E1F5FE",
    borderRadius: 15,
    paddingVertical: 30,
    paddingHorizontal: 30,
    elevation: 5,
    shadowColor: "#000",
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
    color: "#000",
  },
});

export default WriteNdefScreen;
