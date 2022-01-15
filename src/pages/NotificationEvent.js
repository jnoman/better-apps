import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { DatabaseConnection } from '../database/DatabaseConnection';
import PushNotification from "react-native-push-notification";

const db = DatabaseConnection.getConnection();

PushNotification.createChannel(
    {
      channelId: "channel-id", // (required)
      channelName: "My channel", // (required)
      channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
      playSound: false, // (optional) default: true
      soundName: "default", // (op // (optional) default: Importance.HIGH. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
    },
    (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
  );

PushNotification.configure({
  onRegister: function (token) {
    console.log("TOKEN:", token);
  },
  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);
  },
 onAction: function (notification) {
    console.log("ACTION:", notification.action);
    console.log("NOTIFICATION:", notification);
  },
  onRegistrationError: function(err) {
    console.error(err.message, err);
  },
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: Platform.OS === 'ios',
});





const NotificationEvent = () =>{

    
    const dateNotifivation = 5000;
    

    const F_Notification = () => {
        const month = new Date().getMonth() + 1;
        
        const dateVar = new Date(Date.now() + (1000 * 60 * 5));
        const date1 = new Date().getFullYear() + '-' + month + '-' + new Date().getDate() + ' ' + 
            new Date().getHours()+':'+(new Date().getMinutes()<10?'0':'') +new Date().getMinutes();

        const date2 = dateVar.getFullYear() + '-' + month + '-' + dateVar.getDate() + ' ' + 
            dateVar.getHours()+':'+(dateVar.getMinutes()<10?'0':'') +dateVar.getMinutes();
            console.log("Successsd ");

        db.transaction((txn) => {
            txn.executeSql(
                'SELECT * FROM table_event where date_start_event > ? and date_start_event < ? and notifier_event = 0',
                [date1, date2],
                (tx, results) => {
                  console.log("Successsd "+results.rows.length);
                    for (let i = 0; i < results.rows.length; ++i){
                        PushNotification.localNotification({
                            channelId: "channel-id",
                            title: "appointment approaching", 
                            message: "the appointment for "+results.rows.item(i).user_name+" start at "+results.rows.item(i).date_start_event,
                        });
                        txn.executeSql('update table_event set notifier_event=1 where event_id=?', [results.rows.item(i).event_id]);
                    }
                }
            );
        });
        
        db.transaction((txn) => {
            txn.executeSql(
                'SELECT * FROM table_event where date_end_event < ? and present = 0',
                [date1],
                (tx, results) => {
                    for (let i = 0; i < results.rows.length; ++i){
                        PushNotification.localNotification({
                            channelId: "channel-id",
                            title: "appointment missing", 
                            message: "the appointment for "+results.rows.item(i).user_name+" start at "+results.rows.item(i).date_start_event+" is missing",
                        });
                        txn.executeSql(
                            'UPDATE table_event set notifier_absent=1, present = 2 where event_id=?', [results.rows.item(i).event_id]);
                    }
                }
            );
        });
    }

    F_Notification();

    useEffect(() => {
        const interval = setInterval(() => {
            F_Notification();
        }, dateNotifivation);
      
        return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
      }, [])

      return (
        <View></View>
      );

}

export default NotificationEvent;