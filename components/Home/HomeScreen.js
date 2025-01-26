import react from "react";
import { Image, View ,Text, TouchableOpacity} from "react-native";
import GlobalStyles from "../../Global/Branding/GlobalStyles";

import { useNavigation } from "@react-navigation/native";

function HomeScreen(){
    const navigation = useNavigation()
    return(
        <View style={GlobalStyles.Container}>
<Text>
    king of the hearts !
</Text>
        </View>
    )
}
export default HomeScreen