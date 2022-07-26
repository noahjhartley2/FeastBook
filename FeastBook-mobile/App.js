import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import 'localstorage-polyfill';

import LoginScreen from './components/LoginScreen'
import RegisterScreen from './components/RegisterScreen'
import ProfileScreen from './components/ProfileScreen'
import VisitedProfileScreen from './components/VisitedProfileScreen'
import SearchScreen from './components/SearchScreen'
import ExploreScreen from './components/ExploreScreen'
import PostScreen from './components/PostScreen'
import SuccessfulPostScreen from './components/SuccessfulPostScreen'
import SuccessfulRegistrationScreen from './components/SuccessfulRegistrationScreen'
import FavoritesScreen from './components/FavoritesScreen'
import EmailVerificationScreen from './components/EmailVerificationScreen'
import PasswordResetScreen from './components/PasswordResetScreen'
import PasswordResetScreen2 from './components/PasswordResetScreen2'
import PWResetSuccessful from './components/PWResetSuccessful'

const Stack = createStackNavigator();

const Auth = () => {

  let initialRoute = 'LoginScreen'
  const userId = localStorage.getItem('userID');
  if (typeof(userId) !== null) {
    initialRoute = 'ExploreScreen'
  }

  const [loaded] = useFonts({
    Montserrat: require('./assets/fonts/Montserrat-Regular.ttf'),
    MontserratSB: require('./assets/fonts/Montserrat-SemiBold.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="VisitedProfile"
        component={VisitedProfileScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Explore"
        component={ExploreScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Post"
        component={PostScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SuccessfulPost"
        component={SuccessfulPostScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EmailVerification"
        component={EmailVerificationScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SuccessfulRegistration"
        component={SuccessfulRegistrationScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PasswordReset"
        component={PasswordResetScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PasswordReset2"
        component={PasswordResetScreen2}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PWResetSuccessful"
        component={PWResetSuccessful}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen
          name="Auth"
          component={Auth}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
