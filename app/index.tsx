import { offers } from "@/constants";
import { Text } from "@react-navigation/elements";
import { FlatList, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "./globals.css";
 
export default function Index() {
  return (
    <SafeAreaView>
      <FlatList
        data = {offers}
        renderItem={({item, index}) => {
          return (
            <View>
              <Pressable className="bg-amber-600">
                <Text>
                  {item.title}
                </Text>
              </Pressable>
            </View>
          )
        }}
      />

      
    </SafeAreaView>
  );
}