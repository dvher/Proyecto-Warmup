import React from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  RefreshControl,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { db } from "../calculoCae2";

let datos = [{ id: "-1" }];

const Stack = createStackNavigator();
//fetch items
const Item = ({ Cuota, Credito, nCuotas, CAE }) => (
  <View style={styles.item}>
    <Text style={styles.title}>Credito: {Credito}</Text>
    <Text style={styles.title}>Cuota: {Cuota}</Text>
    <Text style={styles.title}>Numero de Cuotas: {nCuotas}</Text>
    <Text style={styles.title}>CAE: {CAE}</Text>
  </View>
);
//Display de items
function display() {
  const renderItem = ({ item }) => {
    if (
      item.Cuota === undefined ||
      item.Credito === undefined ||
      (item.nCuotas === undefined && item.CAE === undefined)
    )
      return <></>;

    return (
      <Item
        Cuota={
          "$" + item.Cuota?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        }
        Credito={
          "$" + item.Credito?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        }
        nCuotas={item.nCuotas}
        CAE={item.CAE}
      />
    );
  };

  //Refresh (todavia no hace nada)
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const OnRefresh = React.useCallback(() => {
    setRefreshing(true);
    datos = [{ id: "-1" }];
    db.find({}).exec(function (err, docs) {
      docs.forEach((element) =>
        datos.push(JSON.parse(JSON.stringify(element)))
      );
    });

    console.log(db.find({}));

    wait(2000).then(() => {
      setRefreshing(false);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={datos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={OnRefresh} />
        }
      />
    </SafeAreaView>
  );
}

function Historial() {
  db.find({}).exec(function (err, docs) {
    docs.forEach((element) => datos.push(JSON.parse(JSON.stringify(element))));
  });
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Historial"
        component={display}
        options={{
          title: "Historial",
          headerStyle: {
            backgroundColor: "#444",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerTitleStyle: { alignSelf: "center" },
        }}
      />
    </Stack.Navigator>
  );
}

export default Historial;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: "#fff",
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  title: {
    textAlign: "center",
    paddingBottom: 4,
    fontSize: 20,
  },
});
