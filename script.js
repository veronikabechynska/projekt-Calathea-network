let probihaZalevani = false;
let cerstveZalito = false;
let zapnoutAutomatickeZavlazovani = false;

client = new Paho.MQTT.Client(
    "d57a0d1c39d54550b147b58411d86743.s2.eu.hivemq.cloud", 
    8884, 
    "3d8cfbf1-3639-4883-bff");

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
        

        let zalivej = document.querySelector(".button");
        zalivej.addEventListener("click", zapnoutRele);

        function zapnoutRele() {
            probihaZalevani = true;
            cerstveZalito = true;
            setTimeout(vypnoutCerstveZalito, 60000);
            message = new Paho.MQTT.Message("on");     
            message.destinationName = "/in/plant/relay";       
            client.send(message); 
            setTimeout(vypnoutRele, 15000); 
            
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
                zapnoutSvetla
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
            if (probihaZalevani == false && cerstveZalito == false && zapnoutAutomatickeZavlazovani == true) {
                zapnoutRele();
                setTimeout(vypnoutRele,5000);
            }
                
                
            
        }

        let tlacitko2 = document.querySelector(".button2");
        tlacitko2.addEventListener("click",zmenaHodnotyZalvlazovani)

        function zmenaHodnotyZalvlazovani(){
            zapnoutAutomatickeZavlazovani=true
        }
        
        
      
            

            
   
    
   
