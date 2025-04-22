import React, { useState } from "react";
import { StyleSheet, FlatList } from "react-native";
import { List, Searchbar } from "react-native-paper"; // Import the Searchbar component
//import PokemonImage from "../../Components/PokemonImage";
import { PokemonList } from "../../PokemonData";

function PokemonListScreen(props) {
  const { navigation } = props;
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const updateSearch = (query) => {
    setSearchQuery(query);
  };

  // Define a renderItem function to render each item in the FlatList
  const renderItem = ({ item }) => (
    <List.Item
      style={styles.listItem}
      key={item.name}
      title={item.name}
      description={item.description}
      // left={() => <PokemonImage name={item.name} />}
      left={() => <></>}
      onPress={() => {
        navigation.navigate("Detail", { pokemon: item, allowCreate: true });
      }}
    />
  );

  return (
    <>
      <Searchbar
        placeholder="Search Pokemon"
        onChangeText={updateSearch}
        value={searchQuery}
        style={{ margin: 10 }}
      />
      <FlatList
        data={PokemonList.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        style={{ flex: 1, backgroundColor: "white" }}
      />
    </>
  );
}

export default PokemonListScreen;

const styles = StyleSheet.create({
  listItem: {
    paddingHorizontal: 15,
  },
});
