let probihaZalevani = false;
let cerstveZalito = false;
let zapnoutAutomatickeZavlazovani = false;



client = new Paho.MQTT.Client(
    "d57a0d1c39d54550b147b58411d86743.s2.eu.hivemq.cloud", 
    8884, 
    "letni-skola" + Math.random());

client.connect({
    onSuccess: onConnect,
    userName: "robot",
    password: "P@ssW0rd!",
    useSSL: true
});
    
function onConnect() {
    console.log("onConnect");

    // message = new Paho.MQTT.Message("Ahoj");     
    // message.destinationName = "/row/3/text";       
    // client.send(message);
        
    client.onMessageArrived = onMessageArrived; 
    client.subscribe("/out/plant/humidity"); 
    client.subscribe("/out/plant/error"); 
    client.subscribe("/out/plant/watertank/level"); 

    
    
    //zapnoutSvetla();
    //zapnoutRele();
    //vypnoutRele();
    //vypnoutSvetla();
    
    
}

function zalivej() {
    zapnoutRele(3000, 15000)
    console.log("zalivej")
}

function vypniAuto(){
    vypniAutomatickeZavlazovani()
    console.log("vypniAuto")
}

function zapniAuto(){
    zmenaHodnotyZavlazovani()
    console.log("zapniAuto")
}

function dolilaJsemVodu(){
    vypnoutSvetla();
    message = new Paho.MQTT.Message("on");     
    message.destinationName = "/in/plant/watertank/reset";       
    client.send(message);
}

/*let zalivej = document.querySelector(".zalevej");
zalivej.addEventListener("click", zapnoutRele(15000));
console.log("zalivej")

let vypniAuto = document.querySelector(".vypniAutoZalevani");
vypniAuto.addEventListener("click", vypniAutomatickeZavlazovani);
console.log("vypniAuto")

let zapniAuto = document.querySelector(".zapniAutoZalevani");
zapniAuto.addEventListener("click",zmenaHodnotyZavlazovani);
console.log("zapniAuto")*/
        
function zapnoutSvetla() {
    message = new Paho.MQTT.Message("on");     
    message.destinationName = "/in/plant/light";       
    client.send(message);  

} 

function vypnoutSvetla() {
    message = new Paho.MQTT.Message("off");     
    message.destinationName = "/in/plant/light";       
    client.send(message);  
    
} 
        



//let casovyUdaj = document.querySelector("#hodiny").value;

//console.log(casovyUdaj)

let formular = document.querySelector(".formular");
formular.addEventListener("submit", zpracujFormular)

function zpracujFormular (event) {
    event.preventDefault();
}

function zapnoutRele(dobaZalevani, intervalMeziZalevanim) {
    console.log("zapnoutRele");
    probihaZalevani = true;
    cerstveZalito = true;
    setTimeout(vypnoutCerstveZalito, intervalMeziZalevanim); //tohle je interval mezi jednotlivyma zalevanim
    message = new Paho.MQTT.Message("on");     
    message.destinationName = "/in/plant/relay";       
    client.send(message); 
    setTimeout(vypnoutRele, dobaZalevani); //tohle je doba samotnýho zalevani
    
} 

function vypnoutCerstveZalito() {
    cerstveZalito = false;
}
    
function vypnoutRele() {
    probihaZalevani = false;
    message = new Paho.MQTT.Message("off");     
    message.destinationName = "/in/plant/relay";       
    client.send(message); 
}

        


function onMessageArrived(message) {  

    console.log("onMessageArrived:" + message.destinationName);  
    console.log("onMessageArrived:" + message.payloadString); 
    if (message.destinationName === "/out/plant/humidity") {
        
        pocitejVlhkost(message.payloadString);

    }
    if (message.destinationName === "/out/plant/watertank/level")
    {
        zapnoutSvetla()
    }
}

        
        
function pocitejVlhkost(payloadString) {
    let payload = Number(payloadString);
    let vlhkost = 9;

    if(payload>=675)
    { vlhkost = 0}
    else if(payload>=650)
    { vlhkost = 1}
    else if(payload>=625)
    { vlhkost = 2}
    else if(payload>=600)
    { vlhkost = 3}
    else if(payload>=575)
    { vlhkost = 4}
    else if(payload>=550)
    { vlhkost = 5}
    else if(payload>=525)
    { vlhkost = 6}
    else if(payload>=500)
    { vlhkost = 7}
    else if(payload>=475)
    { vlhkost = 8}

    ukazatUrovenVlhkosti(vlhkost)
    
    console.log("Vlhkost:")
    console.log(vlhkost)
    
    
    if (vlhkost<=2) {
        automatickeZavlazovani(vlhkost);
    }

}

function ukazatUrovenVlhkosti(vlhkost) {
    message = new Paho.MQTT.Message(String(vlhkost));     
    message.destinationName = "/in/plant/humidity/level";       
    client.send(message); 
}

function automatickeZavlazovani(vlhkost) {
    let intervalOdUzivatele = document.querySelector("#hodiny").value;
    console.log("intervalOdUzivatele:")
    console.log(intervalOdUzivatele)
    console.log("automatickeZavlazovani")
    if (probihaZalevani == false && cerstveZalito == false && zapnoutAutomatickeZavlazovani == true) {
        zapnoutRele(2000, intervalOdUzivatele);
    }
        
}



function zmenaHodnotyZavlazovani(){
    zapnoutAutomatickeZavlazovani=true
}

function vypniAutomatickeZavlazovani () {
    zapnoutAutomatickeZavlazovani=false
}
        
        
      
            

            
   
    
   
