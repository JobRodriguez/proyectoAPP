#include <SoftwareSerial.h>

 
int bluetoothTx = 4;  // TX-O pin of bluetooth mate, Arduino D2
int bluetoothRx = 2;  // RX-I pin of bluetooth mate, Arduino D3
int gas=A0;
int foto=A1;
int buz=5;
char op;
SoftwareSerial bluetooth(bluetoothTx, bluetoothRx);
 
void setup() 
{ 
  pinMode(gas,INPUT);  
  Serial.begin(9600);
  setupBluetooth();
  Serial.println("\nChat Sparkfun Version\n");
} 


void loop() {
  
  if(Serial.available())
  {
    (Serial.read());
  }
  if(bluetooth.available()){
    Serial.write(bluetooth.read());
  }

  
    op=bluetooth.read();
    if(op=='1'){
        tone(buz,1000,5000);
      delay(2000);
    }else{
      noTone(buz);
    }
      //sendData();

  
}



void sendData() {
    int valuegas= analogRead(gas);
    int valuefoto = analogRead(foto);

    bluetooth.print(valuegas);
    bluetooth.print("  ");
    bluetooth.print(valuefoto);

 /* Serial.print("Gas: ");
  Serial.println(valuegas);*/
  /*Serial.print("Luz: ");
  Serial.println(valuefoto);*/
  delay(1000);
  bluetooth.write(0xA);
  bluetooth.flush();  
  
} 
 
//Conexion, no borrar 
void setupBluetooth() {
  bluetooth.begin(115200); 
  bluetooth.print("$$$");
  delay(100); 
  bluetooth.println("U,9600,N"); 
  bluetooth.begin(9600);
}



