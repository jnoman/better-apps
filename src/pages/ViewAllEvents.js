import { DatabaseConnection } from './../database/DatabaseConnection';
import MyDatePicker from './MyDatePicker';
import AddEvent from './AddEvent';
import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import DatePicker from 'react-native-datepicker'
import { IconButton } from 'react-native-paper';

const db = DatabaseConnection.getConnection();

const ViewAllEvents = () => {
    let [flatListItems, setFlatListItems] = useState([]);
    const month = new Date().getMonth() + 1;
    const [state, setState] = useState({
        date: new Date().getFullYear() + '-' + month + '-' + new Date().getDate()
    });

    const [today, setToday] = useState(new Date().getFullYear() + '-' + month + '-' + new Date().getDate());

    const onSelectDate = (date) =>{
        state.date=date;
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM table_event where date_start_event like ? order by date_start_event',
                [state.date+"%"],
                (tx, results) => {
                    var temp = [];
                    for (let i = 0; i < results.rows.length; ++i)
                        temp.push(results.rows.item(i));
                    setFlatListItems(temp);
                }
            );
        });
    }

    const validatePresent = (index) =>{

        db.transaction((tx) => {
            tx.executeSql(
              'UPDATE table_event set present=1 where event_id= ?',
              [index],
              (tx, results) => {
                if (results.rowsAffected > 0) {
                    onSelectDate(state.date);
                } 
              }
            );
          });
    }

    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM table_event where date_start_event like ? order by date_start_event',
                [state.date+"%"],
                (tx, results) => {
                    var temp = [];
                    for (let i = 0; i < results.rows.length; ++i)
                        temp.push(results.rows.item(i));
                    setFlatListItems(temp);
                }
            );
        });
    }, []);
    let getTextStyle=(present)=> {
        if(present==0) {
         return {
            backgroundColor: '#EEE', marginTop: 20, padding: 30, borderRadius: 10 
         }
        } else if(present==1) {
            return {
                backgroundColor: '#5bbb74', marginTop: 20, padding: 30, borderRadius: 10 
            }
           } else {
          return {
            backgroundColor: '#ff5a2c', marginTop: 20, padding: 30, borderRadius: 10 
          }
        }
       }
    let listItemView = (item) => {
        return (
            <View
                key={item.event_id}
                style={getTextStyle(item.present)}>
                <Text style={styles.textheader}>Client name: {item.user_name}</Text>
                <Text style={styles.textbottom}>Summary: {item.summary}</Text>
                <Text style={styles.textdate}>from: {item.date_start_event} to {item.date_end_event}</Text>
                {(today == state.date) && (item.present==0) && <IconButton icon="checkbox-marked" color='#1e6f63' size={30} onPress={()=>{validatePresent(item.event_id)}} style={styles.styleIcon}></IconButton>}

            </View>
        );
    };

    return (
        <View>
            <View style={styles.container1}>
                <DatePicker
                    style={{ width: 200, marginBottom: 10 }}
                    date={state.date}
                    mode="date"
                    placeholder="select date"
                    format="YYYY-MM-DD"
                    minDate="2021-01-01"
                    maxDate="2031-12-01"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                        dateIcon: {
                            position: 'absolute',
                            left: 0,
                            top: 4,
                            marginLeft: 0
                        },
                        dateInput: {
                            marginLeft: 36
                        }
                    }}
                    onDateChange={(date) => { onSelectDate(date); }}
                />
            </View>
            <FlatList
                style={{ marginTop: 0 }}
                contentContainerStyle={{ paddingHorizontal: 20 }}
                data={flatListItems}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => listItemView(item)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    styleIcon: {
        position: 'absolute',
        bottom:10,
        right: 10
    },
    textheader: {
        color: '#111',
        fontSize: 18,
        fontWeight: '700',

    },
    textbottom: {
        color: '#111',
        fontSize: 18,
    },
    textdate:{
        color: '#111',
        fontSize: 15,
    },
    container1: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30
    }
});


export default ViewAllEvents;