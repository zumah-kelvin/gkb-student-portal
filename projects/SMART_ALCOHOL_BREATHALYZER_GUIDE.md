# GKB Technologies — Student Engineering Project Specification
## Project Reference: GKB-STU-004
### Smart Alcohol Breathalyzer with Engine Ignition Interlock System

---

### 1. Project Abstract
Driver intoxication is a leading cause of preventable vehicular collisions and traffic fatalities globally. This project details the design, construction, and deployment of an onboard embedded **Smart Alcohol Breathalyzer and Ignition Interlock Device (IID)**. 

The system intercepts the vehicle's 12V starter motor circuit. Before the engine can be turned over, the driver must complete a 5-second forced breath test into an enclosed sampling chamber equipped with an **MQ-3 Tin Dioxide ($SnO_2$) Semiconductor Gas Sensor**. If the measured Blood Alcohol Concentration (BAC) remains below the legal limit ($0.05\%$ BAC / $0.25\text{ mg/L}$ breath alcohol), the microcontroller energizes an automotive relay, allowing the starter motor to crank the engine. If the driver fails the breath test, the starter circuit remains locked out, a high-decibel alarm sounds, and an optional GPS/GSM module transmits the lockout coordinates to a centralized fleet safety portal.

---

### 2. Hardware Bill of Materials (BOM)

| Component | Specification | Quantity | Role |
| :--- | :--- | :---: | :--- |
| **Microcontroller** | ESP32 Dev Module (or Arduino Nano) | 1 | Real-time ADC sampling, decision logic, & BLE/Wi-Fi telemetry |
| **Alcohol Sensor** | MQ-3 Gas Sensor Module | 1 | Alcohol vapor detection via resistance change in $SnO_2$ |
| **Starter Relay** | 12V / 30A SPDT Automotive Relay | 1 | Ignition interlock switch interrupting starter solenoid wire |
| **Piezo Buzzer** | 5V Active / Passive Piezo Buzzer | 1 | Audio chimes and loud alarm on intoxication lockout |
| **Display Unit** | 0.96" I2C SSD1306 OLED (or 16x2 LCD) | 1 | Driver prompt, BAC readout, and countdown timer |
| **Visual Indicators** | 5mm LEDs (1x Green, 1x Red) | 2 | Green = Start Allowed, Red = Lockout Active |
| **Resistors** | 220Ω (LED current limiting) | 2 | Protection resistors |
| **Power Supply** | LM2596 DC-DC Buck Converter (12V to 5V) | 1 | Steps down 12V vehicle battery to clean 5V logic power |

---

### 3. Pinout & Interconnection Map

| ESP32 Pin | Connected Component | Function / Signal Description |
| :--- | :--- | :--- |
| **GPIO 34** | MQ-3 `AOUT` (Analog Output) | High-precision ADC1 analog input (unaffected by Wi-Fi) |
| **GPIO 23** | 12V Relay `IN` (Input Signal) | Starter motor solenoid interlock relay trigger |
| **GPIO 19** | Piezo Buzzer `+` | Intoxication and test prompt audio alerts |
| **GPIO 18** | Green LED Anode (via 220Ω) | Sober test passed indicator |
| **GPIO 5** | Red LED Anode (via 220Ω) | Intoxication lockout indicator |
| **GPIO 21** | OLED / LCD `SDA` | I2C Data bus |
| **GPIO 22** | OLED / LCD `SCL` | I2C Clock bus |
| **VIN / 5V** | Sensor `VCC`, Relay `VCC` | 5V regulated system power rail |
| **GND** | Sensor `GND`, Relay `GND`, LEDs | Common ground return |

---

### 4. Vehicle Wiring Intercept Safety Guide
> [!CAUTION]
> **Safety Interlock Rule**: The relay must ONLY interrupt the **Starter Motor Solenoid wire** (the wire energized only while cranking the key to "START"). 
> **NEVER interrupt the ignition coil or fuel pump power while the car is in motion!** An interlock device must prevent the car from starting, but must never stall an already moving vehicle on the highway.

1. Locate the vehicle ignition switch harness under the steering column.
2. Identify the **Crank / Starter wire** (typically energized only when turning the key past "ON" to "START").
3. Cut the starter wire and splice both ends to the relay:
   - Wire from Key Switch $\rightarrow$ Relay `COM` (Common terminal).
   - Wire to Starter Solenoid $\rightarrow$ Relay `NO` (Normally Open terminal).
4. When the driver passes the breath test, the relay energizes, closing `COM` to `NO` for 60 seconds so the key turn engages the starter.

---

### 5. Firmware Deployment
The complete ready-to-flash Arduino C++ firmware is provided in:
`gkb-student-portal/firmware/Smart_Alcohol_Breathalyzer_Ignition_Interlock/GKB_ESP32_Smart_Alcohol_Breathalyzer.ino`

1. Open Arduino IDE.
2. Select Board: **ESP32 Dev Module** (or Arduino Nano if using the ATmega328P variant).
3. Connect your USB cable and upload.
4. Open Serial Monitor at **115200 baud** to view real-time ADC calibration and breath sampling feedback.

---

*Authored by GKB Technologies Academic Projects Engineering Division.*  
*God Knows Best • Built Beyond Limits*
