
// Import the functions you need from the SDKs you need
import  {initializeApp} from "firebase/app";
import firebase from 'firebase/compat/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile} from 'firebase/auth'
import {getDatabase, set, ref, update, push} from 'firebase/database'
// Compat Version
import 'firebase/compat/storage'

//UUID
import { v4 as uuidv4 } from 'uuid';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_k45UQA_2SxL9vso1dYahzxHBfdGHQRI",
  authDomain: "whatsapp-ff587.firebaseapp.com",
  databaseURL: "https://whatsapp-ff587-default-rtdb.firebaseio.com",
  projectId: "whatsapp-ff587",
  storageBucket: "whatsapp-ff587.appspot.com",
  messagingSenderId: "279979451692",
  appId: "1:279979451692:web:e29edd6fce9011847eb889"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig)



// Firebase Ref
export const auth = getAuth()
export const database = getDatabase();
export const storage = firebase.storage()


// Firebase Authentication
export const verificaSeUsuarioEstaLogado = () => {
    if(auth.currentUser != null){
        return true
    }else{
        return false
    }
}
export const verificaSeUsuarioEstaDeslogado = () => {
    if(auth.currentUser != null){
        return false
    }else{
        return true
    }
}
export const listenerVerificaUsuarioLogado = () => {
    onAuthStateChanged(auth, (user) =>{
        if(user){
            return true
        }else{
            return false
        }
    })
}
export function alterarNome(authRef, nome, databaseRef){
    updateProfile(authRef.currentUser, {
    displayName: nome
    }).then(() => {
    // Profile updated!
    setNameDatabase(authRef.currentUser, nome, databaseRef)
    // ...
    }).catch((error) => {
    // An error occurred
    // ...
    });
}
export const criaContaUsuario = (email, senha, nome) => {
    createUserWithEmailAndPassword(auth, email, senha)
        .then((userCredential) => {
            // Conta Criada
            const user = userCredential.user
            alterarNome(auth, nome)
            criandoUsuarioDatabase(user.uid, user.email, nome)
        })
        .catch((erro) => {
            if(erro){
                const errorCode = erro.code;
                switch (errorCode){
                    case 'auth/invalid-email':
                        alert('Digite um valor de e-mail valido! Ex) ...@gmail.com')
                        break
                    case 'auth/email-already-exists':
                        alert('Já existe um usuario com este e-mail!')
                        break
                    case 'auth/weak-password':
                        alert('Digite uma senha com no minimo 6 digitos')
                        break        
                    default:
                        alert('Erro Prencha todos os Campos de Forma Correta')
                        break                             
                }
                console.log(errorCode)
                return errorCode                
            }
        })
}
export const logandoUsuario = (email, senha) => {
    signInWithEmailAndPassword(auth, email, senha)
        .then((userCredential) => {

        })
        .catch((erro) => {
            if(erro){
                const errorCode = erro.code;
                switch (errorCode){
                    case 'auth/user-not-found':
                        alert('Não há registro de usuário existente correspondente ao identificador fornecido.')
                        break
                    case 'auth/invalid-email':
                        alert('Digite um valor de e-mail valido! Ex) ...@gmail.com')
                        break
                    case 'auth/wrong-password' :
                        alert('Senha Incorreta, tente de novo!')
                        break   
                    default:
                        alert('Erro Prencha todos os Campos de Forma Correta')
                        break       
                }
                console.log(errorCode)
                return errorCode                
            }
        })
}
export const logOutUser = () => {
    signOut(auth)
}

// Realtime Database
export const criandoUsuarioDatabase = (uidUser, emailUser, nameUser) =>{
    set(ref(database, 'usuarios/' + uidUser),
        {
            nome: nameUser,
            email: emailUser,
        }
    )
}
export const enviandoMensagemDatabase = (user, uidRemetente , mensagem) =>{
    const hoje = new Date()
    const hora = hoje.getHours().toString()
    const minutos = hoje.getMinutes().toString()
    
    let minutosEdit
    let horaEdit

    if(hora.length<=1){ horaEdit = `0${hora}` } else{horaEdit = hora}
    if(minutos.length<=1){ minutosEdit = `0${minutos}` } else{ minutosEdit = minutos}
    
    const horaMinuto =  horaEdit + ":" + minutosEdit
    const time = hoje.getTime()

    set(push(ref(database, `mensagens/${user.uid}/${uidRemetente}`)),
        {
            idUsuario:user.uid,
            nome: user.displayName,
            mensagem: mensagem,
            hour: horaMinuto,
            time: time
        }
    )
    set(push(ref(database, `mensagens/${uidRemetente}/${user.uid}`)),
        {
            idUsuario:user.uid,
            nome: user.displayName,
            mensagem: mensagem,
            hour: horaMinuto,
            time: time
        }    
    )
          
}
const enviandoMensagemFotoDatabase = (user, uidRemetente , url, mensagem) =>{
    const hoje = new Date()
    const hora = hoje.getHours().toString()
    const minutos = hoje.getMinutes().toString()
    
    let minutosEdit
    let horaEdit

    if(hora.length<=1){ horaEdit = `0${hora}` } else{horaEdit = hora}
    if(minutos.length<=1){ minutosEdit = `0${minutos}` } else{ minutosEdit = minutos}
    
    const horaMinuto =  horaEdit + ":" + minutosEdit
    const time = hoje.getTime()

    set(push(ref(database, `mensagens/${user.uid}/${uidRemetente}`)),
        {
            idUsuario:user.uid,
            nome: user.displayName,
            mensagem: mensagem,
            foto: url,
            hour: horaMinuto,
            time: time
        }
    )
    set(push(ref(database, `mensagens/${uidRemetente}/${user.uid}`)),
        {
            idUsuario:user.uid,
            nome: user.displayName,
            mensagem: mensagem,
            foto: url,
            hour: horaMinuto,
            time: time
        }    
    )      
}
const enviandoMensagemVideoDatabase = (user, uidRemetente , url, mensagem) =>{
    const hoje = new Date()
    const hora = hoje.getHours().toString()
    const minutos = hoje.getMinutes().toString()
    
    let minutosEdit
    let horaEdit

    if(hora.length<=1){ horaEdit = `0${hora}` } else{horaEdit = hora}
    if(minutos.length<=1){ minutosEdit = `0${minutos}` } else{ minutosEdit = minutos}
    
    const horaMinuto =  horaEdit + ":" + minutosEdit
    const time = hoje.getTime()

    set(push(ref(database, `mensagens/${user.uid}/${uidRemetente}`)),
        {
            idUsuario:user.uid,
            nome: user.displayName,
            mensagem: mensagem,
            video: url,
            hour: horaMinuto,
            time: time
        }
    )
    set(push(ref(database, `mensagens/${uidRemetente}/${user.uid}`)),
        {
            idUsuario:user.uid,
            nome: user.displayName,
            mensagem: mensagem,
            video: url,
            hour: horaMinuto,
            time: time
        }    
    )      
}
function setNameDatabase(user, nameUser, dataRef){
    update(ref(dataRef,`usuarios/${user.uid}`),{
        nome:nameUser
    })
}
export function setDescriptionDatabase(dataRef, user, description){
    update(ref(dataRef, `usuarios/${user.uid}`),{
        descricao:description
    })
}
function setImagePerfilDatabase(user, url){
    update(ref(database,`usuarios/${user.uid}`),{
        foto:url
    })
}
export function criaConversa(idUserLogado, userAmigo, idUserAmigo, ultimaMensagem){
    let timeS = new Date().getTime().toString()
    let mensageFilter

    if(ultimaMensagem.length < 15){
        mensageFilter=ultimaMensagem
    }else{
        mensageFilter = ultimaMensagem.substr(0,15) + "..."
    }
    set(ref(database, `conversas/${idUserLogado}/${idUserAmigo}`),{
        idDestinatario:idUserAmigo,
        idRemetente:idUserLogado,
        isGroup:"false",
        time:timeS,
        qnts:0,
        ultimaMensagem:mensageFilter,
        usuarioExibicao:userAmigo
    })
    set(ref(database, `conversas/${idUserAmigo}/${idUserLogado}`),{
        idDestinatario:idUserLogado,
        idRemetente:idUserAmigo,
        isGroup:"false",
        time:timeS,
        qnts:1,
        ultimaMensagem:mensageFilter,
        usuarioExibicao:userAmigo
    })
}
export function setUltimaMensagem(idUserLogado, idUserAmigo, ultimaMensagem){
    let timeS = new Date().getTime().toString()
    let mensageFilter
    if(ultimaMensagem.length < 15){
        mensageFilter=ultimaMensagem
    }else{
        mensageFilter = ultimaMensagem.substr(0,15) + "..."
    }
    update(ref(database, `conversas/${idUserLogado}/${idUserAmigo}`),{
        ultimaMensagem:mensageFilter,
        time:timeS
    })
    update(ref(database, `conversas/${idUserAmigo}/${idUserLogado}`),{
        ultimaMensagem:mensageFilter,
        time:timeS
    })
}
export function setQuantasNotify(idUserLogado, idUserAmigo, notifys){
    update(ref(database, `conversas/${idUserAmigo}/${idUserLogado}`),{
        qnts:notifys
    })
}

// Firebase Storage
export function setPerfilFoto(user, image){
    var uploadTask = storage.ref().child(`imagens/perfil/${user.uid}`).put(image)
    
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_change'
        snapshot =>{ // Funções de Ciclo de Vida
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            } 
        }, 
        error => { // Erro Function
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
              case 'storage/unauthorized':
                // User doesn't have permission to access the object
                break;
          
              case 'storage/canceled':
                // User canceled the upload
                break;
          
              case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                break;
            }
        },
        ()=>{ // Upload completed successfully, now we can get the download URL
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                console.log('File available at', downloadURL);
                setImagePerfilDatabase(user, downloadURL)
            })
        })
}
export function addMensageFoto(user, uidRemetente, image){
    if(image != null){
        var uploadTask = storage.ref().child(`imagens/fotos/${user.uid}/${uuidv4()}`).put(image)
        
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_change'
            snapshot =>{ // Funções de Ciclo de Vida
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
                } 
            }, 
            error => { // Erro Function
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;
            
                case 'storage/canceled':
                    // User canceled the upload
                    break;
            
                case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    break;
                }
            },
            ()=>{ // Upload completed successfully, now we can get the download URL
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    console.log('File available at', downloadURL);
                    let tipoImage = image.type.split('/')
                    enviandoMensagemFotoDatabase(user, uidRemetente, downloadURL, tipoImage[0]) 
                    setUltimaMensagem(user.uid, uidRemetente, tipoImage[0])
                })
            })        
    }

}
export function addMensageVideo(user, uidRemetente, video){
    if(video != null){
        var uploadTask = storage.ref().child(`videos/${user.uid}/${uuidv4()}`).put(video)
        
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_change'
            snapshot =>{ // Funções de Ciclo de Vida
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
                } 
            }, 
            error => { // Erro Function
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;
            
                case 'storage/canceled':
                    // User canceled the upload
                    break;
            
                case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    break;
                }
            },
            ()=>{ // Upload completed successfully, now we can get the download URL
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    console.log('File available at', downloadURL);
                    let tipoVideo = video.type.split('/')
                    enviandoMensagemVideoDatabase(user, uidRemetente, downloadURL, tipoVideo[0])
                    setUltimaMensagem(user.uid, uidRemetente, tipoVideo[0])
                })
            })        
    }

}  
export default app