#include <SoftwareSerial.h>

SoftwareSerial BT(4,2); //RX,TX puertos
void setup() {
  Serial.begin(9600);
  BT.begin(9600);
}

void loop() {
  if(Serial.available())
  {
    
(Serial.read());
  }
  if(BT.available()){
    Serial.write(BT.read());
  }


}

void setupBluetooth() {
  BT.begin(115200);  // The Bluetooth Mate defaults to 115200bps
  BT.print("$$$");  // Enter command mode
  delay(100);  // Short delay, wait for the Mate to send back CMD
  BT.println("U,9600,N");  // Temporarily Change the baudrate to 9600, no parity
  // 115200 can be too fast at times for NewSoftSerial to relay the data reliably
  BT.begin(9600);  // Start bluetooth serial at 9600
}
