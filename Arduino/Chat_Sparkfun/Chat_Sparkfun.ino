#include <SoftwareSerial.h>
#include <dht.h>

#define dht_apin A0 
 
int bluetoothTx = 2;  // TX-O pin of bluetooth mate, Arduino D2
int bluetoothRx = 4;  // RX-I pin of bluetooth mate, Arduino D3
int gas=A1;
int flama=A2;
char op;
dht DHT;


SoftwareSerial bluetooth(bluetoothTx, bluetoothRx);
 
void setup() 
{ 
  pinMode(gas,INPUT);
  pinMode(flama,INPUT);  
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

    sendData();

  
}



void sendData() {
    DHT.read11(dht_apin);
    int valuegas= analogRead(gas);
    int valuehumedad =DHT.humidity;
    int valueflama= analogRead(flama);

    bluetooth.print(valuegas);
    bluetooth.print("  ");
    bluetooth.print(valuehumedad);
    bluetooth.print("  ");
    bluetooth.print(valueflama);
 /* Serial.print("Gas: ");
  Serial.println(valuegas);
  Serial.print("Humedad: ");
  Serial.println(valuehumedad);
  Serial.print("Flama: ");
  Serial.println(valueflama); */
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



