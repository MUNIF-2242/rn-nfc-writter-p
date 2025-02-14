// NfcContext.js
import React, { createContext, useState, useEffect } from "react";
import NfcManager, { Ndef, NfcTech } from "react-native-nfc-manager";
import { Platform } from "react-native";
import { generateSlug } from "../utils/helpers";

export const NfcContext = createContext();

export const NfcProvider = ({ children }) => {
  const [hasNfc, setHasNfc] = useState(null);
  const [enabled, setEnabled] = useState(null);

  // New states for your WriteNdefScreen
  const [value, setValue] = useState("");
  const [industryDropdownValue, setIndustryDropdownValue] = useState("");
  const [professionDropdownValue, setProfessionDropdownValue] = useState("");

  // Dropdown visibility states
  const [showIndustryMenu, setShowIndustryMenu] = useState(false);
  const [showProfessionMenu, setShowProfessionMenu] = useState(false);

  useEffect(() => {
    async function checkNfc() {
      const supported = await NfcManager.isSupported();
      if (supported) {
        await NfcManager.start();
        setEnabled(await NfcManager.isEnabled());
      }
      setHasNfc(supported);
    }
    checkNfc();
  }, []);

  const resetFields = () => {
    setValue("");
    setIndustryDropdownValue("");
    setProfessionDropdownValue("");
  };

  const handleWriteNdef = async (androidPromptRef, customProfession) => {
    if (androidPromptRef && androidPromptRef.current) {
      try {
        await writeNdef(androidPromptRef, customProfession);
      } catch (error) {
        console.error("Error writing NFC: ", error);
      }
    } else {
      console.warn("androidPromptRef is not defined.");
    }
  };

  const refreshNfcStatus = async () => {
    setEnabled(await NfcManager.isEnabled());
  };

  const writeNdef = async (androidPromptRef, customProfession) => {
    let scheme = "https://kriyakarak.com/";

    // Use custom profession if "Others" is selected
    const profession =
      professionDropdownValue === "Others"
        ? customProfession
        : professionDropdownValue;

    const fullUrl = `${scheme}${generateSlug(
      industryDropdownValue
    )}/${generateSlug(profession)}/${generateSlug(value)}`;

    if (!industryDropdownValue || !profession || !value) {
      alert("Please fill all fields!");
      return;
    }

    const uriRecord = Ndef.uriRecord(fullUrl);
    const bytes = Ndef.encodeMessage([uriRecord]);

    try {
      if (Platform.OS === "android") {
        androidPromptRef.current.setVisible(true);
      }
      await NfcManager.requestTechnology(NfcTech.Ndef);
      await NfcManager.ndefHandler.writeNdefMessage(bytes);
      alert("NFC written successfully!");
    } catch (ex) {
      console.log("Error writing NFC: ", ex);
    } finally {
      NfcManager.cancelTechnologyRequest();
      if (Platform.OS === "android") {
        androidPromptRef.current.setVisible(false);
      }
    }
  };

  return (
    <NfcContext.Provider
      value={{
        hasNfc,
        enabled,
        refreshNfcStatus,
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
        writeNdef,
        resetFields,
        handleWriteNdef,
      }}
    >
      {children}
    </NfcContext.Provider>
  );
};
