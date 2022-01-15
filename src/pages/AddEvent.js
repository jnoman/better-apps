import { Appbar, TextInput } from 'react-native-paper';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useState } from "react";
import Dialog from "react-native-dialog";
import DatePicker from 'react-native-datepicker'
import DateTimePicker from '@react-native-community/datetimepicker';
import { DatabaseConnection } from './../database/DatabaseConnection';
const db = DatabaseConnection.getConnection();

const AddEvent = () => {

    const [date, setDate] = useState(new Date(Date.now()));
    const [show, setShow] = useState(false);
    const [visible, setVisible] = useState(false);
    const month = new Date().getMonth() + 1;
    const [state, setState] = useState({
        date: new Date().getFullYear() + '-' + month + '-' + new Date().getDate()
    });
    const [stateTime, setStateTime] = useState({
        time: (date.getHours()<10?'0':'')+date.getHours()+':'+(date.getMinutes()<10?'0':'')+date.getMinutes()
    });
    const [clientName, setClientName] = useState("");
    const [summary, setSummary] = useState("");
    const [duree, setDuree] = useState("0");


    const showAddEvent = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const safeNewDate = (localDateTimeStr) => {

        var match = localDateTimeStr.match(
          /(\d{4})-(\d{2})-(\d{2})[\sT](\d{2}):(\d{2}):(\d{2})(.(\d+))?/,
        )
        if (!match) throw new Error('Invalid format.')
      
        var [, year, month, date, hours, minutes, seconds, , millseconds] = match
      
        return new Date(
          year,
          Number(month) - 1,
          date,
          hours,
          minutes,
          seconds,
          millseconds || 0,
        )
    }

    const handleAdd = () => {
        console.log("Success");
        const date_debut= state.date + " " + stateTime.time;
        const date_debut1= safeNewDate(date_debut+":00");
        const date_end1= new Date(date_debut1);
        date_end1.setMinutes(date_debut1.getMinutes()+parseInt(duree))
        const date_end= state.date + " " + (date_end1.getHours()<10?'0':'')+date_end1.getHours()+':'+(date_end1.getMinutes()<10?'0':'')+date_end1.getMinutes();
        db.transaction(function (tx) {
        tx.executeSql(
            'INSERT INTO table_event (user_name, summary, date_start_event, date_end_event) VALUES (?,?,?,?)',
            [clientName, summary, date_debut, date_end],
            (tx, results) => {
              if (results.rowsAffected > 0) {
                console.log("Success");
              } 
            }
          );
        });
        setVisible(false);
    };

    const styles = StyleSheet.create({
        container: {

        },
        container1: {
            flex: 1,
            backgroundColor: "#fff",
            alignItems: "center",
        },
    });


    

    const onChange = (event, selectedDate) => {
        if(event.type == "set") {
            const currentDate = selectedDate || date;
            setDate(currentDate);
            setShow(false);
        } else {
            setShow(false);
        }
        
        setStateTime({time: (date.getHours()<10?'0':'')+date.getHours()+':'+(date.getMinutes()<10?'0':'')+date.getMinutes()});
    };

    const showTimepicker = () => {
        setShow(true);
    };

    return (
        <View>
            <Appbar.Header style={styles.container}>
                <Appbar.Content title="Better App" />
                <Appbar.Action icon="calendar-plus" onPress={showAddEvent}  />
            </Appbar.Header>


            <View style={styles.container1}>
                <Dialog.Container visible={visible}>
                    <Dialog.Title>Add delete</Dialog.Title>
                    <Dialog.Description>
                        <View>
                            <TextInput style={{width:300, paddingBottom:10, backgroundColor: "#fff"}} label={"Client name"} onChangeText={(value) =>setClientName(value)}></TextInput>
                            <TextInput style={{width:300, marginEnd:10, backgroundColor: "#fff"}} label={"Summary"} onChangeText={(value) =>setSummary(value)}></TextInput>
                            <DatePicker
                                style={{width: 200, marginBottom:10}}
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
                                onDateChange={(date) => {setState({date: date});}}
                            />
                            <TouchableOpacity onPress={showTimepicker}>
                                <TextInput
                                    disabled={true}
                                    style={{width: 200}}
                                    value={stateTime.time}
                                    placeholder="select time"
                                />
                            </TouchableOpacity>
                            
                            <TextInput style={{width:300, marginEnd:10, backgroundColor: "#fff"}} label={"duration in minutes"} keyboardType={"numeric"} value={duree} onChangeText={(time) => setDuree(time)} />

                            {show && (
                                <DateTimePicker
                                testID="dateTimePicker"
                                value={date}
                                mode={'time'}
                                is24Hour={true}
                                display="default"
                                onChange={onChange}
                                />
                            )}
                        </View>
                    </Dialog.Description>
                    <Dialog.Button label="Cancel" onPress={handleCancel} />
                    <Dialog.Button label="Add" onPress={handleAdd} />
                </Dialog.Container>
            </View>
        </View>


    );
};

export default AddEvent;