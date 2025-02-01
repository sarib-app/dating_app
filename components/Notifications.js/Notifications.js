import React, { useEffect, useState } from "react";
import GlobalStyles from "../../Global/Branding/GlobalStyles";
import HeaderScreens from "../../Global/components/HeaderScreens";
import { Text, View } from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import Colors from "../../Global/Branding/colors";
import InputTitle from "../../Global/components/InputTitle";
import NotifiactionStyles from "./NotificationStyles";
import { FlatList } from "react-native-gesture-handler";
import Header from "../../Global/components/Header";
import { useIsFocused } from "@react-navigation/native";
import { getNotifications } from "../../Global/Calls/ApiCalls";
import getAsyncuser from "../../Global/components/getAsyncUser";
import InitialLoading from "../../Global/components/InitialLoading";
import NodataFound from "../../Global/components/NoDataFound";
function Notifications(){
  

const data = [
    {
        id:1,
        title:"Account Success",
        body:"COngratulations your account created successfully"
    },
    {
        id:2,
        title:"Purchase Success",
        body:"Congratulations! your subscription has been purchased successfully!"
    },
    {
        id:3,
        title:"New Content",
        body:"We have added new content in gallery go and check them out."
    },
    {
        id:4,
        title:"Account Success",
        body:"COngratulations your account created successfully."
    },
    {
        id:5,
        title:"Account Success",
        body:"COngratulations your account created successfully."
    },
    
]

    const focused = useIsFocused()
    const [notifList,setnotifList] =useState([])
    
    const [loading,setLoading] =useState(false)
    
    
    
    
    
    
            // useEffect(()=>{
            //     async function getAsyncData(){
                
            //     const userData = await getAsyncuser()
            //     if(userData){
            //         getNotifs(userData)
            //     }
            //     }
            //     getAsyncData()
            //       },[focused])
    
    
    async function getNotifs(userData){
        const res= await getNotifications(userData.id)
        console.log(res)
        if(res != null){
         if(res.status === "200"){
            setnotifList(res.notifications)
            
         }
     setLoading(false)
        }
    }
    






    const renderitems = ({item})=>(

        <View style={GlobalStyles.HistoryCard}>

        <View style={GlobalStyles.RowMaker}>
            <View style={NotifiactionStyles.iconWrapper}>
            <Entypo name="dot-single" size={24} color="black" />


            </View>
            

        <View style={[GlobalStyles.ColumnAligner,{alignItems:'flex-start'}]}>
            <InputTitle
            value={item.title}
            style={{marginLeft:0}}
            />
            <Text style={{color:"rgba(0,0,0,0.6)",width:"60%"}}>
                {item.body}
            </Text>
        </View>

        
        </View>
    

    </View>

    )
    return(
        <View
        style={GlobalStyles.Container}
        >
            <Header 
            name={"Notifications"}
            />


            {
                loading === true?
                <InitialLoading />:
                <>

                {
                    data.length > 0 ?

<FlatList 
data={data}
renderItem={renderitems}
/>:
<NodataFound/>
                }

</>

            }
       
        </View>
    )
}
export default Notifications


