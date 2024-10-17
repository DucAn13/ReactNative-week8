import { Text, View, Pressable, Image,SafeAreaView, FlatList, TextInput, ScrollView} from 'react-native';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const userContext=React.createContext();

const UserProvider=({children})=>{
  const [user,changeUser]=React.useState('');
  return(
    <userContext.Provider value={{ user, changeUser }}>
      {children}
    </userContext.Provider>
  )
}

const Task=({item,navigation})=>{
  let {user}=React.useContext(userContext);
  return(
    <View
      style={{
        width:335,
        minHeight:44,
        borderRadius:30,
        backgroundColor:'#DEE1E678',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        paddingHorizontal:20,
        paddingVertical:10,
        marginBottom:5
      }}
    >
      <View
        style={{
          flexDirection:'row',
           alignItems:'center'
        }}
      >
        <AntDesign name="checksquareo" size={24} color="#14923E"/>
        <Text
          style={{
            marginStart:10,
            fontSize:16,
            fontWeight:700,
            width:200
          }}
        >
          {item.jobName}
        </Text>
      </View>
      <View
        style={{
          flexDirection:'row'
        }}
      >
        <Pressable
          onPress={()=>{
              navigation.navigate({
                name:'Screen3',
                params: {editTask: item},
                merge:true
              })
          }}
        >
          <AntDesign name="edit" size={24} color="red" />
        </Pressable>
        <Pressable
          style={{
            marginStart:20
          }}
          onPress={()=>{
            user.job=user.job.filter(x=>x.jobID!=item.jobID)
            fetch(`https://66ff425c2b9aac9c997eb603.mockapi.io/account/${user.id}`,
            {
              method:'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(user)
            })
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then(() => {
              navigation.replace('Screen2');
            })
            .catch(error => {
              console.error('There was a problem with the fetch operation:', error);
            });
          }}
        >
          <AntDesign name="delete" size={24} color="red" />
        </Pressable>
        
      </View>
    </View>
  )
}

function Screen1({navigation}){
  let [accountList,loadAccountList]=React.useState([]);
  let [inputAccount,changeInputAccount]=React.useState('');
  let {changeUser}=React.useContext(userContext);
  React.useEffect(()=>{
    fetch("https://66ff425c2b9aac9c997eb603.mockapi.io/account")
    .then(response=>{
      if(!response.ok){
        throw new Error('404');
      }
      return response.json();
    })
    .then(data=>{
      loadAccountList(data);
    })
  },[])

  return(
    <SafeAreaView
      style={{
        alignItems:'center',
        width:389,
        height:700,
        justifyContent:'space-around',
        backgroundColor:'white'
      }}
    >
      <View
        style={{
          height:271,
          width:271
        }}
      >
      </View>
      <Text
        style={{
          color:'#8353E2',
          fontSize:24,
          fontWeight:700,
          width:200,
          textAlign:'center'
        }}
      >
        MANAGE YOUR TASK
      </Text>
      <View
        style={{
          position:'relative',
          justifyContent:'center'
        }}
      >
        <TextInput
        onChangeText={(data)=>{
          changeInputAccount(data);
        }}
          style={{
            width:334,
            height:43,
            borderColor:'#9095A0',
            borderWidth:1,
            borderRadius:10,
            paddingStart:50
          }}
          placeholder='Enter your name'
          placeholderTextColor='#9095A0'
        />
        <AntDesign name="mail" size={29} color="#9095A0" style={{position:'absolute',left:15}}/>
      </View>
      <Pressable
        style={{
          backgroundColor:'#00BDD6',
          height:44,
          width:190,
          borderRadius:10,
          justifyContent:'center',
          alignItems:'center'
        }}
        onPress={()=>{
          if(accountList.find(account=>account.name===inputAccount)||null){
            loginUser=accountList.find(account=>account.name===inputAccount);
            changeUser(loginUser);
            navigation.navigate('Screen2')
          }
        }}
      >
        <Text
          style={{
            color:'white'
          }}
        >
          GET STARTED -{'>'}
        </Text>
      </Pressable>
    </SafeAreaView>
  )
}

function Screen2({route,navigation}){
  let [userList,changeUserList]=React.useState([])
  let {user}=React.useContext(userContext);
  React.useEffect(()=>{
    fetch('https://66ff425c2b9aac9c997eb603.mockapi.io/account')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data=>changeUserList(data))
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
  },[])
  let taskList=userList.find(x=>x.id===user.id);
  taskList=taskList?taskList.job:[];
  return(
    <SafeAreaView
      style={{
        width:389,
        height:700,
        backgroundColor:'white',
        justifyContent:'space-around'
      }}
    >
      <View id='header'
        style={{
          flexDirection:'row',
          justifyContent:'space-between',
          paddingHorizontal:10,
          backgroundColor:'white'
        }}
      >
        <Pressable
          onPress={()=>navigation.navigate('Home')}
        >
          <AntDesign name="arrowleft" size={36} color="black" />
        </Pressable>
        <View
          style={{
            flexDirection:'row'
          }}
        >
          <Pressable
            style={{
              borderWidth:1,
              borderRadius:100,
              height:50,
              width:50,
              marginEnd:10
            }}
          >
            <Image 
              src={{uri:`${user.avatar}`}} 
              style={{
                borderRadius:100,
                height:50,
                width:50,
              }}
            />
          </Pressable>
          <View>
            <Text
              style={{
                color:'#171A1F',
                flexShrink:20,
                fontWeight:700,
                paddingStart:10
              }}
            >
              Hi {user.name}
            </Text>
            <Text
              style={{
                color:'gray',
                flexShrink:14,
                fontWeight:700
              }}
            >
              Have agrate day a head
            </Text>
          </View>
        </View>
      </View>
      <View id='body'
        style={{
          alignItems:'center',
          backgroundColor:'white',
          height:450
        }}
      >
        <View
          style={{
            position:'relative',
            justifyContent:'center',
            marginBottom:5
          }}
        >
          <TextInput
            style={{
              borderWidth:1,
              borderColor:'gray',
              width:334,
              height:44,
              borderRadius:5,
              paddingStart:40
            }}
            placeholder='Search'
          />
          <AntDesign name="search1" size={26} color="black" style={{position:'absolute', left:10}}/>
        </View>
        <ScrollView
          style={{
            height:300
          }}
        >
          <FlatList
            data={taskList}
            renderItem={({item})=><Task item={item} navigation={navigation}/>}
            keyExtractor={item=>item.jobID}
            
          />
        </ScrollView>
      </View>
      <View id='footer'
        style={{
          alignItems:'center',

        }}
      >
        <Pressable
          style={{
            height:69,
            width:69,
            backgroundColor:'#00BDD6',
            borderRadius:100,
            justifyContent:'center',
            alignItems:'center'
          }}
          onPress={()=>{
            navigation.navigate('Screen3')
          }}
        >
          <FontAwesome6 name="add" size={35} color="white" />
        </Pressable>
      </View>
    </SafeAreaView>
  )
}
function Screen3({route,navigation}){
  let [currentTask,changeCurrentTask]=React.useState({});
  let [userList,changeUserList]=React.useState([])
  let {user}=React.useContext(userContext);
  React.useEffect(()=>{
    if(route.params?.editTask){
      changeCurrentTask(route.params.editTask);
    }
  },[route.params?.editTask])
  React.useEffect(()=>{
    fetch('https://66ff425c2b9aac9c997eb603.mockapi.io/account')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data=>changeUserList(data))
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
  },[])
  let taskList=userList.find(x=>x.id===user.id);
  taskList=taskList?taskList.job:[];
  let [alert,displayAlert]=React.useState('');
  
  return(
    <SafeAreaView
      style={{
        flex:1,
        backgroundColor:'white',
        width:389,
        height:700
      }}
    >
      <View id='header'
        style={{
          flexDirection:'row',
          justifyContent:'space-between',
          paddingHorizontal:10,
          backgroundColor:'white',
          marginBottom:20
        }}
      >
        <View
          style={{
            flexDirection:'row',
            backgroundColor:'white'
          }}
        >
          <Pressable
            style={{
              borderWidth:1,
              borderRadius:100,
              height:50,
              width:50,
              marginEnd:10
            }}
          >
          </Pressable>
          <View>
            <Text
              style={{
                color:'#171A1F',
                flexShrink:20,
                fontWeight:700,
                paddingStart:10
              }}
            >
              Hi {user.name}
            </Text>
            <Text
              style={{
                color:'gray',
                flexShrink:14,
                fontWeight:700
              }}
            >
              Have agrate day a head
            </Text>
          </View>
        </View>
        <Pressable
          onPress={()=>navigation.replace('Screen2')}
        >
          <AntDesign name="arrowleft" size={36} color="black" />
        </Pressable>
      </View>
      <View id='bodyScreen3'
        style={{
          alignItems:'center',
          backgroundColor:'white'
        }}
      >
        <Text
          style={{
            fontSize:32,
            fontWeight:700,
             marginBottom:40
          }}
        >
          ADD YOUR JOB  
        </Text>
        <View
          style={{
            position:'relative',
            justifyContent:'center'
          }}
        >
          <TextInput
            style={{
              borderWidth:1,
              borderColor:'gray',
              height:44,
              width:334,
              borderRadius:5,
              paddingStart: 50,
            }}
            placeholder='input your job'
            value={currentTask.jobName}
            onChangeText={newTaskName=>{
                changeCurrentTask({ ...currentTask, jobName: newTaskName });
            }}
          />
          <FontAwesome name="list-alt" size={24} color="green" style={{position:'absolute', left:10}}/>
        </View>
        <Text
          id='alertInput'
          style={{
            color:'red'
          }}
        >
          {alert}
        </Text>
        <Pressable
          style={{
            width:190,
            height:44,
            borderRadius:5,
            backgroundColor:'#00BDD6',
            justifyContent:'center',
            alignItems:'center',
            marginTop:70,
            marginBottom:120
          }}
          onPress={()=>{
            if(!currentTask.jobName||currentTask.jobName.trim()===""){
              displayAlert('Please input job')
              return;
            }
            if(route.params?.editTask){
              let updateJob=taskList.find(x=>x.jobID===currentTask.jobID);
              updateJob.jobName=currentTask.jobName;
              fetch(`https://66ff425c2b9aac9c997eb603.mockapi.io/account/${user.id}`,
                {
                  method:'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(userList.find(x=>x.id===user.id))
                }
              )
              .then((response) => {
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                return response.json();
              })
              .then(() => {
                navigation.replace('Screen2');
              })
              .catch((error) => {
                console.error('There was a problem with the update operation:', error);
              });
            }
            else{
              user.job.push({jobID:currentTask.jobName,jobName:currentTask.jobName})
              fetch(`https://66ff425c2b9aac9c997eb603.mockapi.io/account/${user.id}`,
                {
                  method:'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(user)
                }
              )
              .then((response) => {
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                return response.json();
              })
              .then(() => {
                navigation.replace('Screen2');
              })
              .catch((error) => {
                console.error('There was a problem with the update operation:', error);
              });
            }
          }}
        >
          <Text
            style={{
              color:'white',
              fontWeight:500,
              fontSize:20
            }}
          >
            FINISH -{'>'}
          </Text>
        </Pressable>
        <Image source={require('./assets/note.png')}/>
      </View>
    </SafeAreaView>
  )
}


const Stack=createNativeStackNavigator();
export default function App(){
  let user={
    avatar:'',
    name:''
  }

  return(
    <UserProvider value={user}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name='Home' component={Screen1}/>
          <Stack.Screen name='Screen2' component={Screen2}/>
          <Stack.Screen name='Screen3' component={Screen3}/>
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  )
  
}