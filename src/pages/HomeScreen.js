import { DatabaseConnection } from './../database/DatabaseConnection';
import AddEvent from './AddEvent';
import { View } from 'react-native';
import ViewAllEvents from './ViewAllEvents';

const db = DatabaseConnection.getConnection();

const HomeScreen = (props) => {
    createTable();
    return (
        <View> 
          <AddEvent/>
          <ViewAllEvents/>
        </View>
    );
}

createTable = () =>{
    db.transaction(function (txn) {
        txn.executeSql(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='table_event'",
          [],
          function (tx, res) {
            if (res.rows.length == 0) {
              txn.executeSql('DROP TABLE IF EXISTS table_event', []);
              txn.executeSql(
                'CREATE TABLE IF NOT EXISTS table_event(event_id INTEGER PRIMARY KEY AUTOINCREMENT, user_name TEXT, summary TEXT, date_start_event text, date_end_event text, present INT(1) DEFAULT 0, notifier_event INT(1) DEFAULT 0, notifier_absent INT(1) DEFAULT 0) ',
                []
              );
            }
          }
        );
      });
}

export default HomeScreen;

