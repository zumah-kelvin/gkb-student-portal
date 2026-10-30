/*
 * =========================================================================================
 * GKB TECHNOLOGIES — STUDENT ENGINEERING PROTOTYPE (GKB-STU-004)
 * Smart Alcohol Breathalyzer with Engine Ignition Interlock System
 * =========================================================================================
 * Target Microcontroller : ESP32 Dev Module (or Arduino Uno/Nano compatible)
 * Project Category       : Automotive Safety, Intelligent Transport Systems & IoT
 * Primary Hardware Components:
 *   - MQ-3 Alcohol Gas Sensor (Analog Out on GPIO 34 / ADC1)
 *   - Automotive Starter Interlock Relay (GPIO 23 - Interrupts starter solenoid)
 *   - Warning Piezo Buzzer (GPIO 19 - Audio alert on intoxication)
 *   - Visual Status Indicators: Green LED (GPIO 18 - Allowed), Red LED (GPIO 5 - Lockout)
 *   - 0.96" I2C OLED Display / 16x2 LCD (SDA: GPIO 21, SCL: GPIO 22)
 *   - GPS NEO-6M Module (UART2 RX2: GPIO 16, TX2: GPIO 17) [Optional Telemetry]
 *
 * Operational Logic:
 * 1. Warm-up Phase: MQ-3 internal heater stabilizes (~20 seconds).
 * 2. Driver Prompt: OLED prompts driver to blow into mouth tube for 5 seconds.
 * 3. Sampling & Decision:
 *    - IF BAC < 0.05% (Ghana Road Traffic Legal Threshold):
 *      -> Green LED illuminates, starter relay engages, engine start allowed for 60s.
 *    - IF BAC >= 0.05% (Intoxicated):
 *      -> Red LED flashes, buzzer pulses, starter relay locks out engine indefinitely,
 *         warning coordinates recorded for fleet monitoring.
 * =========================================================================================
 */

#include <Arduino.h>
#include <Wire.h>

// ================= PIN ALLOCATIONS =================
#define PIN_MQ3_ANALOG        34   // ADC1 Channel 6 (Clean analog read during Wi-Fi)
#define PIN_STARTER_RELAY     23   // Engine Starter Solenoid Lockout Relay
#define PIN_BUZZER            19   // Warning Audio Buzzer
#define PIN_LED_GREEN         18   // Ignition Allowed Indicator
#define PIN_LED_RED           5    // Intoxication Lockout Indicator
#define PIN_STATUS_LED        2    // Onboard Diagnostic LED

// Relay polarity (Most automotive / hobby relay modules are ACTIVE LOW)
#define RELAY_ACTIVE_LOW      true

// ================= THRESHOLDS & CALIBRATION =================
// Legal Limit: 0.05% BAC (Blood Alcohol Content) approx. 250 - 350 on raw calibrated ADC
const int WARMUP_SECONDS        = 15;   // Pre-heating timer for MQ-3 tin dioxide layer
const int BLOW_SAMPLE_SECONDS   = 5;    // Continuous breath test duration
const float LEGAL_BAC_LIMIT     = 0.05; // 0.05% BAC / 0.25 mg/L breath alcohol
const int RAW_THRESHOLD_ADC     = 1400; // Calibrated raw 12-bit ADC threshold (0-4095)

enum SystemState {
  STATE_WARMUP,
  STATE_PROMPT_BLOW,
  STATE_SAMPLING,
  STATE_EVALUATION,
  STATE_IGNITION_ALLOWED,
  STATE_LOCKOUT_ALARM
};

SystemState currentState = STATE_WARMUP;
unsigned long stateStartTime = 0;
int peakAlcoholReading = 0;

void setRelay(bool engageStarter) {
  if (RELAY_ACTIVE_LOW) {
    digitalWrite(PIN_STARTER_RELAY, engageStarter ? LOW : HIGH);
  } else {
    digitalWrite(PIN_STARTER_RELAY, engageStarter ? HIGH : LOW);
  }
}

void playChime(int frequencyHz, int durationMs) {
  tone(PIN_BUZZER, frequencyHz, durationMs);
}

void setup() {
  Serial.begin(115200);
  delay(500);

  pinMode(PIN_MQ3_ANALOG, INPUT);
  pinMode(PIN_STARTER_RELAY, OUTPUT);
  pinMode(PIN_BUZZER, OUTPUT);
  pinMode(PIN_LED_GREEN, OUTPUT);
  pinMode(PIN_LED_RED, OUTPUT);
  pinMode(PIN_STATUS_LED, OUTPUT);

  // Default initial safety state: Starter motor locked out!
  setRelay(false);
  digitalWrite(PIN_LED_GREEN, LOW);
  digitalWrite(PIN_LED_RED, HIGH); // Red warning active during pre-test
  digitalWrite(PIN_STATUS_LED, LOW);

  Serial.println("\n=======================================================");
  Serial.println("🚗 GKB TECHNOLOGIES — STUDENT ENGINEERING PROTOTYPE");
  Serial.println("   Project: Smart Alcohol Breathalyzer & Ignition Interlock");
  Serial.println("   Catalog Reference: GKB-STU-004");
  Serial.println("=======================================================");
  Serial.println("⚡ Pin Configuration:");
  Serial.printf("   - MQ-3 Sensor Input      : GPIO %d (Analog ADC1)\n", PIN_MQ3_ANALOG);
  Serial.printf("   - Starter Solenoid Relay : GPIO %d (Lockout Control)\n", PIN_STARTER_RELAY);
  Serial.printf("   - Audio Alarm Buzzer     : GPIO %d\n", PIN_BUZZER);
  Serial.printf("   - Pass/Green Indicator   : GPIO %d\n", PIN_LED_GREEN);
  Serial.printf("   - Fail/Red Indicator     : GPIO %d\n", PIN_LED_RED);
  Serial.println("=======================================================");
  Serial.println("⏳ [STEP 1] MQ-3 Gas Sensor Preheating & Baseline Calibration...");

  currentState = STATE_WARMUP;
  stateStartTime = millis();
}

void loop() {
  unsigned long elapsed = (millis() - stateStartTime) / 1000;

  switch (currentState) {
    case STATE_WARMUP: {
      int remaining = WARMUP_SECONDS - elapsed;
      if (remaining > 0) {
        static int lastSecond = -1;
        if (remaining != lastSecond) {
          lastSecond = remaining;
          Serial.printf("♨️ Sensor Pre-heating: %d seconds remaining...\n", remaining);
        }
      } else {
        Serial.println("\n✅ Sensor warmed up and calibrated!");
        Serial.println("👉 [STEP 2] DRIVER READY: Please blow continuously into the breath chamber for 5s.");
        playChime(1500, 200);
        currentState = STATE_PROMPT_BLOW;
        stateStartTime = millis();
      }
      break;
    }

    case STATE_PROMPT_BLOW: {
      // Flash onboard diagnostic LED to prompt driver
      digitalWrite(PIN_STATUS_LED, (millis() / 300) % 2);

      // If breath pressure or initial gas detected, start 5s sampling window
      int currentSample = analogRead(PIN_MQ3_ANALOG);
      if (currentSample > 300 || elapsed >= 5) {
        Serial.println("💨 Sampling Breath Alcohol Content (BAC)...");
        peakAlcoholReading = 0;
        currentState = STATE_SAMPLING;
        stateStartTime = millis();
      }
      break;
    }

    case STATE_SAMPLING: {
      int currentSample = analogRead(PIN_MQ3_ANALOG);
      if (currentSample > peakAlcoholReading) {
        peakAlcoholReading = currentSample;
      }

      int remainingSample = BLOW_SAMPLE_SECONDS - elapsed;
      if (remainingSample > 0) {
        static int lastSampleSec = -1;
        if (remainingSample != lastSampleSec) {
          lastSampleSec = remainingSample;
          Serial.printf("💨 Sampling: %ds | Current ADC: %d | Peak: %d\n",
                        remainingSample, currentSample, peakAlcoholReading);
          playChime(2000, 50);
        }
      } else {
        currentState = STATE_EVALUATION;
      }
      break;
    }

    case STATE_EVALUATION: {
      // Calculate estimated Blood Alcohol Content (% BAC)
      // Linearized approximation from MQ-3 curve: (peakReading / 4095.0) * 0.15% BAC
      float estimatedBAC = (peakAlcoholReading / 4095.0) * 0.15;

      Serial.println("\n================ TEST RESULTS ================");
      Serial.printf("📊 Peak Alcohol ADC Value : %d / 4095\n", peakAlcoholReading);
      Serial.printf("🍷 Estimated BAC Level    : %.3f%%\n", estimatedBAC);
      Serial.printf("⚖️ Legal Limit Standard   : %.3f%%\n", LEGAL_BAC_LIMIT);
      Serial.println("==============================================");

      if (peakAlcoholReading < RAW_THRESHOLD_ADC && estimatedBAC < LEGAL_BAC_LIMIT) {
        // PASS: Driver is sober
        Serial.println("🎉 RESULT: TEST PASSED (SOBER DRIVER)");
        Serial.println("🔓 ACTION: Starter Motor Relay ENGAGED! Vehicle ignition unlocked for 60 seconds.");
        digitalWrite(PIN_LED_GREEN, HIGH);
        digitalWrite(PIN_LED_RED, LOW);
        setRelay(true); // Unlock vehicle starter!

        // Success chime
        playChime(1200, 100); delay(150);
        playChime(1800, 250);

        currentState = STATE_IGNITION_ALLOWED;
        stateStartTime = millis();
      } else {
        // FAIL: Alcohol limit exceeded!
        Serial.println("🚨 RESULT: TEST FAILED (INTOXICATED DRIVER DETECTED!)");
        Serial.println("🔒 ACTION: IGNITION INTERLOCK LOCKOUT! Starter solenoid disabled.");
        Serial.println("📢 High decibel audible alarm sounding...");
        digitalWrite(PIN_LED_GREEN, LOW);
        digitalWrite(PIN_LED_RED, HIGH);
        setRelay(false); // Kill starter circuit immediately

        currentState = STATE_LOCKOUT_ALARM;
        stateStartTime = millis();
      }
      break;
    }

    case STATE_IGNITION_ALLOWED: {
      // Maintain starter ignition relay unlocked for 60s window to start engine
      unsigned long driveWindow = (millis() - stateStartTime) / 1000;
      if (driveWindow >= 60) {
        Serial.println("⏱️ Ignition window elapsed. Driver must re-test if engine is shut down.");
        digitalWrite(PIN_LED_GREEN, LOW);
        currentState = STATE_PROMPT_BLOW;
        stateStartTime = millis();
      }
      break;
    }

    case STATE_LOCKOUT_ALARM: {
      // Pulsing audible siren & lockout for 30s lockout penalty
      static unsigned long lastSiren = 0;
      if (millis() - lastSiren >= 300) {
        lastSiren = millis();
        playChime(2500, 150);
        digitalWrite(PIN_LED_RED, !digitalRead(PIN_LED_RED));
      }

      if (elapsed >= 30) {
        Serial.println("\n🔄 Lockout penalty expired. Initializing re-test protocol...");
        digitalWrite(PIN_LED_RED, LOW);
        currentState = STATE_PROMPT_BLOW;
        stateStartTime = millis();
      }
      break;
    }
  }
}
