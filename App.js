import { StyleSheet, Text, View, Button } from 'react-native';
import HomeScreen from './src/pages/HomeScreen';
import NotificationEvent from './src/pages/NotificationEvent';


export default function App() {
  return (
    <View style={styles.container}>
      <HomeScreen/>
      <NotificationEvent/>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

