import React from 'react';
import { Text, View, TouchableOpacity, TextInput, Image, StyleSheet ,ToastAndroid,KeyboardAvoidingView,TouchableWithoutFeedback, Alert} from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import  firebase from "firebase";
import db from '../config';
export default class Transaction extends React.Component {
    constructor(){
      super();
      this.state = {           
        hasCameraPermissions: null,
        scanned: false,
        scannedBookId: '',
        scannedStudentId:'',
        buttonState: 'normal',
        transactionMessage:''
      }
    }
    initiatebookissue=async()=>{
    db.collection('Transactions').add({
      "studentid":this.state.scannedStudentId,
      'bookid':this.state.scannedBookId,
      'date':firebase.firestore.Timestamp.now().toDate(),
      'transactionType':"issue"


    })
    db.collection('Books').doc(this.state.scannedBookId).update({
      'bookAvailability': false

    })
    db.collection('Students').doc(this.state.scannedStudentId).update({
    "numberOfBooksIssued":firebase.firestore.FieldValue.increment(1)
    })
    alert("BookIssued!!!")
    this.setState({
      scannedBookId:'',
      scannedStudentId:''
    })
    }
    initiatebookreturn=async()=>{
      db.collection('Transactions').add({
        "studentid":this.state.scannedStudentId,
        'bookid':this.state.scannedBookId,
        'date':firebase.firestore.Timestamp.now().toDate(),
        'transactionType':"returned"
  
  
      })
      db.collection('Books').doc(this.state.scannedBookId).update({
        'bookAvailability': true
  
      })
      db.collection('Students').doc(this.state.scannedStudentId).update({
      "numberOfBooksIssued":firebase.firestore.FieldValue.increment(-1)
      })
      alert("BookReturned!!!")
      this.setState({
        scannedBookId:'',
        scannedStudentId:''
      })
      }
      checkBookEligibility=async()=>{
      const bookref=await db.collection ("Books").where('bookId','==',this.state.scannedBookId).get()
      var transactionType=''
      if(bookref.docs.length==0){
        transactionType=false
      }
      else {
     bookref.docs.map(doc=>{
     var book=doc.data()
     if(book.bookAvailability){
       transactionType='issue'

     }
     else{
       transactionType='return'
     }

     })


      }
      return transactionType;
      
      }
    
    handelTransaction=async()=>{
      var transactionMessage
      var transactionType=await this.checkBookEligibility()
        if(!transactionType){
          alert('Book does not exist in the liberary')
          this.setState({ 
            scannedStudentId:"",
            scannedBookId:""
          })
        }
        else if(transactionType==='issue'){
          var isStudentEligibile=await this.checkStudentEligibilityForIssue()
          if(isStudentEligibile){this.initiatebookissue()
          alert("book issued to the student")}
        }
        else{
          var isStudentEligibile=await this.checkStudentEligibilityForReturn()
          if(isStudentEligibile){this.initiatebookreturn()
          alert("book returned !!")}
         
        }

      
    }
   

    getCameraPermissions = async (id) =>{
      const {status} = await Permissions.askAsync(Permissions.CAMERA);
      
      this.setState({
        /*status === "granted" is true when user has granted permission
          status === "granted" is false when user has not granted the permission
        */
        hasCameraPermissions: status === "granted",
        buttonState: id,
        scanned: false
      });
    }

    handleBarCodeScanned = async({type, data})=>{
      const {buttonState} = this.state

      if(buttonState==="BookId"){
        this.setState({
          scanned: true,
          scannedBookId: data,
          buttonState: 'normal'
        });
      }
      else if(buttonState==="StudentId"){
        this.setState({
          scanned: true,
          scannedStudentId: data,
          buttonState: 'normal'
        });
      }
      
    }

    render() {
      const hasCameraPermissions = this.state.hasCameraPermissions;
      const scanned = this.state.scanned;
      const buttonState = this.state.buttonState;

      if (buttonState !== "normal" && hasCameraPermissions){
        return(
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        );
      }

      else if (buttonState === "normal"){
        return(
          <KeyboardAvoidingView style={styles.container} behavior='padding'enabled>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              <Image
                source={require("../assets/booklogo.jpg")}
                style={{width:200, height: 200}}/>
              <Text style={{textAlign: 'center', fontSize: 30}}>WireLess Library</Text>
            </View>
            <View style={styles.inputView}>
            <TextInput 
              style={styles.inputBox}
              placeholder="Book Id"
              onChangeText={text=>this.setState({scannedBookId:text})}
              value={this.state.scannedBookId}/>
            <TouchableOpacity 
              style={styles.scanButton}
              onPress={()=>{
                this.getCameraPermissions("BookId")
              }}>
              <Text style={styles.buttonText}>Scan</Text>
            </TouchableOpacity>
            </View>
            <View style={styles.inputView}>
            <TextInput 
              style={styles.inputBox}
              placeholder="Student Id"
              onChangeText={text=>this.setState({scannedStudentId:text})}
              value={this.state.scannedStudentId}/>
            <TouchableOpacity 
              style={styles.scanButton}
              onPress={()=>{
                this.getCameraPermissions("StudentId")
              }}>
              <Text style={styles.buttonText}>Scan</Text>
            </TouchableOpacity>
            </View>
                <TouchableOpacity onPress={this.handelTransaction}><Text>Submit Book</Text></TouchableOpacity>
                </TouchableWithoutFeedback>         
           </KeyboardAvoidingView> 

        );
      }
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    displayText:{
      fontSize: 15,
      textDecorationLine: 'underline'
    },
    scanButton:{
      backgroundColor: '#2196F3',
      padding: 10,
      margin: 10
    },
    buttonText:{
      fontSize: 15,
      textAlign: 'center',
      marginTop: 10
    },
    inputView:{
      flexDirection: 'row',
      margin: 20
    },
    inputBox:{
      width: 200,
      height: 40,
      borderWidth: 1.5,
      borderRightWidth: 0,
      fontSize: 20
    },
    scanButton:{
      backgroundColor: '#66BB6A',
      width: 50,
      borderWidth: 1.5,
      borderLeftWidth: 0
    }
  });