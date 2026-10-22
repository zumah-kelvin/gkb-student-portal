import React, { useState, useEffect } from 'react';
import {
  Cpu, Shield, Wrench, Phone, Mail, Globe,
  Send, Server, Terminal, Activity, Layers, ArrowRight,
  Sun, Moon, Zap, Wifi, Radio, Gauge, Lightbulb, CheckCircle2,
  BookOpen, GraduationCap, Award, HelpCircle, FileText, Check,
  Clock, DollarSign, Sparkles, MessageSquare, ExternalLink, RefreshCw
} from 'lucide-react';

type ProjectCategory = 'all' | 'iot' | 'agritech' | 'energy' | 'security' | 'robotics' | 'health';

interface PrototypeTemplate {
  id: string;
  title: string;
  category: ProjectCategory;
  department: string;
  hardware: string[];
  description: string;
  complexity: 'Moderate' | 'Advanced' | 'Expert';
  timeline: string;
}

const PROTOTYPE_CATALOG: PrototypeTemplate[] = [
  {
    id: 'GKB-STU-001',
    title: 'IoT Prepaid Smart Energy Meter with Remote Token Recharge',
    category: 'energy',
    department: 'Electrical & Electronic Engineering',
    hardware: ['ESP32 DevKit', 'PZEM-004T Sensor', 'Solid State Relay', '16x2 I2C LCD', 'Supabase Cloud'],
    description: 'Real-time electrical parameters monitoring (Voltage, Current, Active Power, Power Factor) with STS keypad token recharge and auto-disconnection upon zero balance.',
    complexity: 'Advanced',
    timeline: '2 - 3 Weeks'
  },
  {
    id: 'GKB-STU-002',
    title: 'Smart Home Security System with PIR Motion & GSM SMS/Call Dispatch',
    category: 'security',
    department: 'Computer / Telecommunications Engineering',
    hardware: ['Arduino Mega / ESP32', 'PIR Motion Sensor', 'SIM800L GSM Module', 'Piezo Alarm Siren', 'OLED Display'],
    description: 'Armed security perimeter alerting homeowners via automated voice call and SMS alerts upon intruder motion detection, backed by a high-decibel audible alarm.',
    complexity: 'Moderate',
    timeline: '1 - 2 Weeks'
  },
  {
    id: 'GKB-STU-003',
    title: 'Precision Agricultural Soil Moisture & Automated Solar Irrigation System',
    category: 'agritech',
    department: 'Agricultural / Mechanical Engineering',
    hardware: ['ESP32', 'Capacitive Soil Moisture Sensors', '12V Solar Panel & MPPT', 'Submersible DC Pump', 'Telemetry Dashboard'],
    description: 'Automated solar-powered drip irrigation regulating water delivery based on crop-specific soil conductivity thresholds, reducing water waste by up to 45%.',
    complexity: 'Moderate',
    timeline: '2 Weeks'
  },
  {
    id: 'GKB-STU-004',
    title: 'Smart Alcohol Breathalyzer with Engine Ignition Interlock System',
    category: 'security',
    department: 'Automotive & Electrical Engineering',
    hardware: ['MQ-3 Alcohol Sensor', 'Arduino Nano', 'Automotive Relay Switch', 'NEO-6M GPS Module', 'Buzzer Indicator'],
    description: 'Driver intoxication prevention unit that disables the vehicle starter motor if blood alcohol levels exceed legal thresholds, transmitting coordinates to a fleet hub.',
    complexity: 'Moderate',
    timeline: '1 - 2 Weeks'
  },
  {
    id: 'GKB-STU-005',
    title: 'Dual-Tank Overhead Water Level Monitor with Dry-Run Pump Protection',
    category: 'iot',
    department: 'Mechatronics & Civil Engineering',
    hardware: ['ESP8266 / NodeMCU', 'JSN-SR04T Waterproof Ultrasonic Sensors', 'Water Flow Hall Sensor', 'High-Load Contactor Relay'],
    description: 'Autonomous water supply management coordinating subterranean sumps and rooftop header tanks with automatic prime-failure pump cut-off.',
    complexity: 'Moderate',
    timeline: '1 - 2 Weeks'
  },
  {
    id: 'GKB-STU-006',
    title: 'Underground Fuel & Chemical Storage Tank Ultrasonic Volume Telemetry',
    category: 'iot',
    department: 'Petroleum & Systems Engineering',
    hardware: ['Industrial Non-Contact Ultrasonic Level Sensor', 'ESP32 Wi-Fi/LTE', 'ATEX Enclosure', 'Web Telemetry Portal'],
    description: 'Continuous millimeter-accurate fuel inventory tracking calculating volumetric liters, refuel history, and unauthorized siphoning alarms in real time.',
    complexity: 'Advanced',
    timeline: '2 - 3 Weeks'
  },
  {
    id: 'GKB-STU-007',
    title: 'Patient Vital Signs Remote Telemetry Monitor (SpO2, Heart Rate, Temp)',
    category: 'health',
    department: 'Biomedical Engineering',
    hardware: ['MAX30102 Pulse Oximeter', 'MLX90614 Contactless IR Temp Sensor', 'ESP32', 'OLED Screen', 'Emergency Telegram Bot'],
    description: 'Wearable health station capturing real-time pulse rates, blood oxygen saturation, and body temperatures with instant emergency alert broadcasting to triage doctors.',
    complexity: 'Advanced',
    timeline: '2 Weeks'
  },
  {
    id: 'GKB-STU-008',
    title: 'Multi-Channel Smart Home Relay Matrix with Microsecond Ping Diagnostics',
    category: 'iot',
    department: 'Electrical / IT Systems',
    hardware: ['8-Channel Optocoupled Relay Board', 'ESP32', 'Realtime WebSockets', 'Hardware Watchdog Timer'],
    description: 'Industrial-grade home automation hub switching heavy AC appliances with zero network latency, physical manual override switches, and live power status logs.',
    complexity: 'Moderate',
    timeline: '1 - 2 Weeks'
  }
];

export default function StudentProjectPortal() {
  const [activeTab, setActiveTab] = useState<'portal' | 'ideas' | 'mentorship' | 'contact'>('portal');
  const [isLightMode, setIsLightMode] = useState(
    () => window.localStorage.getItem('gkb-theme') === 'light'
  );

  // Proposal Form State
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [institution, setInstitution] = useState('');
  const [department, setDepartment] = useState('');
  const [academicLevel, setAcademicLevel] = useState('Final Year (Degree / HND)');
  const [projectTitle, setProjectTitle] = useState('');
  const [projectCategory, setProjectCategory] = useState<ProjectCategory>('iot');
  const [budgetEstimate, setBudgetEstimate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [hardwareModules, setHardwareModules] = useState('');
  const [projectAbstract, setProjectAbstract] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState('');

  // Idea bank filter
  const [selectedCatalogCategory, setSelectedCatalogCategory] = useState<ProjectCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Consultation message state
  const [consultationName, setConsultationName] = useState('');
  const [consultationPhone, setConsultationPhone] = useState('');
  const [consultationMessage, setConsultationMessage] = useState('');
  const [consultationSent, setConsultationSent] = useState(false);

  useEffect(() => {
    if (isLightMode) {
      document.documentElement.classList.add('light-mode');
      window.localStorage.setItem('gkb-theme', 'light');
    } else {
      document.documentElement.classList.remove('light-mode');
      window.localStorage.setItem('gkb-theme', 'dark');
    }
  }, [isLightMode]);

  const toggleTheme = () => setIsLightMode(prev => !prev);

  const handleUseTemplate = (template: PrototypeTemplate) => {
    setProjectTitle(template.title);
    setProjectCategory(template.category);
    setDepartment(template.department);
    setHardwareModules(template.hardware.join(', '));
    setProjectAbstract(`Prototype objective based on ${template.title}:\n${template.description}`);
    setActiveTab('portal');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !studentPhone || !projectTitle) {
      alert('Please fill in your name, phone number, and project title.');
      return;
    }

    const message = `*GKB TECHNOLOGIES — NEW STUDENT PROJECT PROPOSAL*
-----------------------------------------
*Student:* ${studentName}
*Phone:* ${studentPhone}
*Email:* ${studentEmail || 'N/A'}
*Institution:* ${institution || 'N/A'}
*Department:* ${department || 'N/A'}
*Academic Level:* ${academicLevel}
*Target Defense Date:* ${deadline || 'Flexible'}
*Budget Scope:* GHS ${budgetEstimate || 'To be discussed'}

*Project Title:*
${projectTitle}

*Category:* ${projectCategory.toUpperCase()}
*Sensors / Hardware Needed:*
${hardwareModules || 'Pending consultation'}

*Abstract & Objectives:*
${projectAbstract || 'Detailed proposal to be discussed in meeting.'}
-----------------------------------------
Sent via GKB Student Engineering Portal`;

    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/233552117787?text=${encoded}`;
    setWhatsappLink(waUrl);
    setSubmitted(true);

    // Save to local submission history
    try {
      const existing = JSON.parse(localStorage.getItem('gkb_student_proposals') || '[]');
      existing.push({
        id: Date.now(),
        studentName,
        projectTitle,
        institution,
        date: new Date().toISOString()
      });
      localStorage.setItem('gkb_student_proposals', JSON.stringify(existing));
    } catch {
      // Ignore storage errors
    }
  };

  const handleConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultationName || !consultationPhone || !consultationMessage) {
      alert('Please complete all consultation fields.');
      return;
    }
    const message = `*GKB CONSULTATION INQUIRY*\n*From:* ${consultationName} (${consultationPhone})\n*Message:* ${consultationMessage}`;
    const waUrl = `https://wa.me/233552117787?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
    setConsultationSent(true);
    setTimeout(() => {
      setConsultationSent(false);
      setConsultationName('');
      setConsultationPhone('');
      setConsultationMessage('');
    }, 4000);
  };

  const filteredCatalog = PROTOTYPE_CATALOG.filter(item => {
    const matchesCategory = selectedCatalogCategory === 'all' || item.category === selectedCatalogCategory;
    const matchesQuery = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.hardware.some(h => h.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Background Cyberpunk Grid Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.15),rgba(255,255,255,0))]"></div>
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[128px]"></div>
      </div>

      {/* TOP NOTIFICATION / MARQUEE BAR */}
      <div className="relative z-20 border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-md px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-slate-400">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono text-cyan-300 font-semibold">2026/2027 ACADEMIC YEAR PROPOSAL WINDOW IS LIVE:</span>
            <span>Final-Year Projects • Mini-Projects • Capstone Build-ups</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <a href="tel:0552117787" className="text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1 font-mono">
              <Phone className="w-3.5 h-3.5 text-cyan-400" /> +233 55 211 7787
            </a>
            <span className="text-slate-600">•</span>
            <span className="text-purple-300 font-medium">CEO Zumah Kelvin Mentorship</span>
          </div>
        </div>
      </div>

      {/* MAIN NAVIGATION HEADER */}
      <header className="sticky top-0 z-30 border-b border-cyan-500/20 bg-slate-950/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('portal')}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur opacity-40 group-hover:opacity-75 transition duration-500"></div>
              <img
                src="/gkb-company-logo.png"
                alt="GKB Technologies"
                className="relative h-12 w-auto object-contain rounded-lg p-1 bg-slate-950/80 border border-cyan-500/30"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400">
                  GKB TECHNOLOGIES
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                  Student Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono tracking-tight hidden sm:block">
                God Knows Best • Built Beyond Limits • Academic Engineering
              </p>
            </div>
          </div>

          {/* Navigation Tabs & Theme Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <nav className="flex space-x-1 sm:space-x-2 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('portal')}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'portal'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Submit Proposal</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ideas')}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'ideas'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Idea Bank</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('mentorship')}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 hidden md:flex ${
                  activeTab === 'mentorship'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-purple-300" />
                <span>Mentorship</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('contact')}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'contact'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contact</span>
              </button>
            </nav>

            {/* Dark / Light Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle visual theme"
              className="p-2.5 rounded-xl border border-cyan-500/20 bg-slate-900/60 text-slate-300 hover:text-cyan-300 hover:border-cyan-400 transition-colors"
            >
              {isLightMode ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN VIEW CONTENT */}
      <main className="flex-1 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* ================= TAB 1: PROPOSAL SUBMISSION & OVERVIEW ================= */}
        {activeTab === 'portal' && (
          <div className="space-y-12 animate-fadeIn">
            {/* Hero Banner */}
            <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-cyan-500/30 bg-gradient-to-br from-slate-900/90 via-slate-950/80 to-slate-900/90 backdrop-blur-xl shadow-[0_0_50px_rgba(6,182,212,0.1)]">
              <div className="absolute -right-16 -top-16 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10 max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  ACADEMIC ENGINEERING HUB • PROTOTYPE SPECIALISTS
                </div>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                  ENGINEERING DREAMS INTO <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400">WORKING HARDWARE</span>
                </h1>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Turn your abstract concept or final-year thesis topic into a fully functional, bench-tested physical prototype. We provide schematic design, custom PCB etching, microcode firmware, and comprehensive defense documentation.
                </p>

                {/* Quick stats grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
                  <div>
                    <p className="text-2xl font-bold font-mono text-cyan-400">120+</p>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Prototypes Built</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-mono text-emerald-400">100%</p>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Defense Approval</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-mono text-purple-400">15+</p>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Tertiary Institutions</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-mono text-amber-400">24/7</p>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Lab Support</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  <a
                    href="#proposal-form"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" /> Submit Project Proposal
                  </a>
                  <button
                    type="button"
                    onClick={() => setActiveTab('ideas')}
                    className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-200 font-bold text-sm transition-all flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" /> Browse Idea Bank
                  </button>
                </div>
              </div>
            </div>

            {/* Disciplines Covered */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" /> Supported Engineering Fields & Disciplines
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: 'Electrical & Electronic Eng.', desc: 'High-voltage relay systems, power metering, solar charge controllers, inverter topologies, and circuit board design.' },
                  { title: 'Computer Science & IT', desc: 'IoT microcontrollers (ESP32, Raspberry Pi), cloud telemetry dashboards, real-time WebSockets, and database sync.' },
                  { title: 'Agricultural Engineering', desc: 'Automated solar irrigation, soil NPK/moisture telemetry, smart greenhouse atmospheric regulation, and poultry automation.' },
                  { title: 'Biomedical & Pharmacy Systems', desc: 'Contactless temperature scanners, pulse oximetry data loggers, automated pill dispensers, and emergency telemetry.' },
                  { title: 'Telecommunications & Networks', desc: 'GSM/GPRS remote notification modules, LoRa long-range telemetry networks, and GPS coordinate tracking.' },
                  { title: 'Mechatronics & Embedded Robotics', desc: 'Ultrasonic depth sensing, motor driver regulation, stepper controllers, and autonomous obstacle avoidance.' }
                ].map((item, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all">
                    <h3 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Proposal Submission Form Section */}
            <section id="proposal-form" className="rounded-3xl border border-cyan-500/30 bg-slate-900/70 p-6 sm:p-10 backdrop-blur-xl">
              <div className="max-w-3xl mb-8">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400">
                  Direct Student Intake Application
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                  Submit Your Project Scope & Hardware Requirements
                </h2>
                <p className="text-slate-400 text-sm mt-2">
                  Fill in your project topic and requirements below. Our engineering leads will review your abstract, assess component availability, and prepare a verified budget and milestone timeline within 24 hours.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 animate-fadeIn">
                  <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Proposal Successfully Packaged!</h3>
                  <p className="text-slate-300 text-sm max-w-lg mx-auto">
                    Your project details for <span className="font-semibold text-cyan-300">"{projectTitle}"</span> have been formatted. To ensure an immediate response from CEO Zumah Kelvin, click below to open your proposal directly in WhatsApp:
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 pt-2">
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" /> Open Proposal in WhatsApp
                    </a>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-all"
                    >
                      Edit Submission
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleProposalSubmit} className="space-y-6">
                  {/* Row 1: Student Contact Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 uppercase mb-2">
                        Student Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={studentName}
                        onChange={e => setStudentName(e.target.value)}
                        placeholder="e.g. Kelvin Zumah"
                        className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-300 uppercase mb-2">
                        WhatsApp / Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={studentPhone}
                        onChange={e => setStudentPhone(e.target.value)}
                        placeholder="e.g. 0552117787"
                        className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-300 uppercase mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={studentEmail}
                        onChange={e => setStudentEmail(e.target.value)}
                        placeholder="student@st.knust.edu.gh"
                        className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Row 2: Academic Institution & Academic Level */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 uppercase mb-2">
                        Tertiary Institution
                      </label>
                      <input
                        type="text"
                        value={institution}
                        onChange={e => setInstitution(e.target.value)}
                        placeholder="e.g. KNUST / ATU / KsTU / Legon"
                        className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-300 uppercase mb-2">
                        Department / Program
                      </label>
                      <input
                        type="text"
                        value={department}
                        onChange={e => setDepartment(e.target.value)}
                        placeholder="e.g. Electrical & Electronic Eng."
                        className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-300 uppercase mb-2">
                        Project Level
                      </label>
                      <select
                        value={academicLevel}
                        onChange={e => setAcademicLevel(e.target.value)}
                        className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                      >
                        <option value="Final Year (Degree / HND)">Final Year (Degree / HND)</option>
                        <option value="Third Year Mini Project">Third Year Mini Project</option>
                        <option value="Master's / Postgraduate Thesis">Master's / Postgraduate Thesis</option>
                        <option value="Innovation Competition / Prototype">Innovation Competition / Prototype</option>
                        <option value="Personal Hardware Venture">Personal Hardware Venture</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Project Title & Domain */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-mono text-slate-300 uppercase mb-2">
                        Project Topic / Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={projectTitle}
                        onChange={e => setProjectTitle(e.target.value)}
                        placeholder="e.g. IoT Smart Prepaid Energy Meter with Keypad Token Recharge"
                        className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-300 uppercase mb-2">
                        Domain Category
                      </label>
                      <select
                        value={projectCategory}
                        onChange={e => setProjectCategory(e.target.value as ProjectCategory)}
                        className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                      >
                        <option value="iot">IoT & Cloud Telemetry</option>
                        <option value="agritech">Smart Agriculture & Irrigation</option>
                        <option value="energy">Power, Solar & Smart Metering</option>
                        <option value="security">Security, PIR & Alarms</option>
                        <option value="robotics">Automation & Embedded Robotics</option>
                        <option value="health">Healthcare & Biomedical</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 4: Deadline & Budget */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 uppercase mb-2">
                        Target Defense / Completion Date
                      </label>
                      <input
                        type="date"
                        value={deadline}
                        onChange={e => setDeadline(e.target.value)}
                        className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-300 uppercase mb-2">
                        Estimated Budget Range (GHS)
                      </label>
                      <input
                        type="text"
                        value={budgetEstimate}
                        onChange={e => setBudgetEstimate(e.target.value)}
                        placeholder="e.g. 1,500 - 2,500 GHS"
                        className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Row 5: Hardware & Sensors Needed */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase mb-2">
                      Sensors, Microcontrollers & Key Hardware (Optional)
                    </label>
                    <input
                      type="text"
                      value={hardwareModules}
                      onChange={e => setHardwareModules(e.target.value)}
                      placeholder="e.g. ESP32, GSM SIM800L, Ultrasonic Sensor, Relay Module, LCD Display"
                      className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>

                  {/* Row 6: Project Abstract / Scope Description */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase mb-2">
                      Project Abstract, Objectives & Special Requirements
                    </label>
                    <textarea
                      rows={5}
                      value={projectAbstract}
                      onChange={e => setProjectAbstract(e.target.value)}
                      placeholder="Describe what the system should do, how it operates, inputs/outputs, and any specific thesis guidelines provided by your supervisor..."
                      className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
                    <p className="text-xs text-slate-400 flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-cyan-400" />
                      100% Plagiarism-free guarantee. Your research code & circuit IP remain completely private.
                    </p>
                    <button
                      type="submit"
                      className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" /> Package & Dispatch Proposal
                    </button>
                  </div>
                </form>
              )}
            </section>
          </div>
        )}

        {/* ================= TAB 2: IDEA BANK & PROTOTYPE SHOWCASE ================= */}
        {activeTab === 'ideas' && (
          <div className="space-y-8 animate-fadeIn">
            <header className="max-w-3xl space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                GKB Verified Prototype Repository
              </span>
              <h1 className="text-3xl font-black text-white">
                Final-Year Idea Bank & Prototype Catalog
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                Stuck choosing a project topic? Explore our proven, high-scoring engineering project templates. Click <strong>"Use As Project Template"</strong> on any project to automatically load its architecture into your proposal form.
              </p>
            </header>

            {/* Filter and Search Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
              {/* Category Pills */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'All Projects' },
                  { id: 'iot', label: 'IoT & Telemetry' },
                  { id: 'energy', label: 'Power & Solar' },
                  { id: 'agritech', label: 'Smart Agriculture' },
                  { id: 'security', label: 'Security & Alarms' },
                  { id: 'health', label: 'Biomedical' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCatalogCategory(cat.id as ProjectCategory)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedCatalogCategory === cat.id
                        ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Filter by sensor, keyword..."
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCatalog.map(item => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl flex flex-col justify-between hover:border-cyan-500/40 transition-all group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded">
                        {item.id}
                      </span>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-400 font-mono flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-400" /> {item.timeline}
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="text-purple-300 font-semibold">{item.complexity}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-purple-400 font-mono mt-0.5">{item.department}</p>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.description}
                    </p>

                    <div>
                      <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2">
                        Hardware & Sensor Architecture:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {item.hardware.map((hw, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300"
                          >
                            {hw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Bench Tested
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUseTemplate(item)}
                      className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500 hover:text-black text-cyan-300 text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      Use As Project Template <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: ACADEMIC MENTORSHIP & THESIS DEFENSE ================= */}
        {activeTab === 'mentorship' && (
          <div className="space-y-12 animate-fadeIn">
            <header className="max-w-3xl space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-purple-400">
                Engineering Guidance Under Zumah Kelvin
              </span>
              <h1 className="text-3xl font-black text-white">
                Comprehensive Defense & Hardware Mentorship
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                Building the physical circuit is only half the battle. We coach you through the underlying electrical principles, firmware logic, and thesis documentation so you ace your university presentation.
              </p>
            </header>

            {/* 6-Phase Engineering Pipeline */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: '01',
                  title: 'Scope Alignment & Feasibility',
                  desc: 'We review your university guidelines, supervisor instructions, and budget limits to settle on realistic, attainable objectives.'
                },
                {
                  step: '02',
                  title: 'Schematic Design & Simulation',
                  desc: 'Complete circuit diagrams modeled in Proteus or EasyEDA, ensuring voltage levels, pull-up resistors, and relay isolation match theoretical physics.'
                },
                {
                  step: '03',
                  title: 'Clean Embedded Firmware',
                  desc: 'Written in pure C/C++ or MicroPython. Highly commented, modular, and plagiarism-free, ready for your supervisor to review without red flags.'
                },
                {
                  step: '04',
                  title: 'PCB Fabrication & Soldering',
                  desc: 'Breadboards are converted into robust, vibration-resistant soldered prototype boards housed in tailored, labeled acrylic or 3D enclosures.'
                },
                {
                  step: '05',
                  title: 'Thesis Chapter 3 & 4 Support',
                  desc: 'We furnish high-res block diagrams, system flowcharts, circuit schematics, and measured performance tables for your final report.'
                },
                {
                  step: '06',
                  title: 'Pre-Defense Mock Presentation',
                  desc: 'Practice runs with CEO Zumah Kelvin anticipating tough panel questions: sensor calibration, power dissipation, and alternative microcontrollers.'
                }
              ].map((phase, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl relative overflow-hidden group hover:border-purple-500/40 transition-all"
                >
                  <span className="text-4xl font-black font-mono text-purple-500/10 group-hover:text-purple-500/20 transition-colors absolute top-4 right-4">
                    {phase.step}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-mono text-xs font-bold mb-4">
                    {phase.step}
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{phase.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{phase.desc}</p>
                </div>
              ))}
            </div>

            {/* Why Work With GKB Banner */}
            <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-cyan-500/30">
              <h2 className="text-xl font-bold text-white mb-6 text-center">
                The GKB Technologies Academic Commitment
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: 'Original Code Guarantee', desc: 'No copied internet repos. Every single function is tailor-written to match your chosen hardware sensors.' },
                  { title: 'Strict Milestone Deadlines', desc: 'We deliver your prototype 1-2 weeks ahead of your department submission to allow ample bench testing.' },
                  { title: 'Student-Conscious Pricing', desc: 'Component sourcing directly from authorized distributors to keep hardware costs within student budgets.' },
                  { title: 'Post-Delivery Bug Fixes', desc: 'If a component burns during campus testing, our lab offers instant repair or replacement support.' },
                  { title: 'One-on-One Code Walkthrough', desc: 'We explain every single line of code so you understand the logic when answering panel questions.' },
                  { title: 'Physical Enclosure Finishing', desc: 'Neat, presentable prototypes with labeled ports, LEDs, and terminal blocks ready for high marks.' }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="text-cyan-400 font-bold mb-1 flex items-center gap-2 text-sm">
                      <Shield className="w-4 h-4 text-purple-400" />
                      <span>{item.title}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: DIRECT CONSULTATION & CONTACT ================= */}
        {activeTab === 'contact' && (
          <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
            <header className="space-y-2 text-center">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                Direct Engineering Helpdesk
              </span>
              <h1 className="text-3xl font-black text-white">
                Schedule a Consultation with CEO Zumah Kelvin
              </h1>
              <p className="text-slate-400 text-sm max-w-xl mx-auto">
                Need immediate hardware troubleshooting, emergency sensor sourcing, or quick project advice? Reach out directly via call, WhatsApp, or the form below.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a
                href="https://wa.me/233552117787"
                target="_blank"
                rel="noopener noreferrer"
                className="p-6 rounded-2xl bg-slate-900/60 border border-emerald-500/30 hover:border-emerald-400 transition-all text-center group"
              >
                <div className="inline-flex p-3 rounded-xl bg-emerald-500/10 text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white text-base">WhatsApp Hotline</h3>
                <p className="text-xs text-emerald-300 font-mono mt-1">+233 55 211 7787</p>
                <p className="text-xs text-slate-400 mt-2">Instant messaging for fast project quotes & audio notes.</p>
              </a>

              <a
                href="tel:0552117787"
                className="p-6 rounded-2xl bg-slate-900/60 border border-cyan-500/30 hover:border-cyan-400 transition-all text-center group"
              >
                <div className="inline-flex p-3 rounded-xl bg-cyan-500/10 text-cyan-400 mb-3 group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white text-base">Voice Call</h3>
                <p className="text-xs text-cyan-300 font-mono mt-1">055 211 7787</p>
                <p className="text-xs text-slate-400 mt-2">Direct telephone line for emergency student project queries.</p>
              </a>

              <a
                href="mailto:kelvinzumah@gmail.com"
                className="p-6 rounded-2xl bg-slate-900/60 border border-purple-500/30 hover:border-purple-400 transition-all text-center group"
              >
                <div className="inline-flex p-3 rounded-xl bg-purple-500/10 text-purple-400 mb-3 group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white text-base">Official Email</h3>
                <p className="text-xs text-purple-300 font-mono mt-1">kelvinzumah@gmail.com</p>
                <p className="text-xs text-slate-400 mt-2">Send schematics, project outlines, and research papers.</p>
              </a>
            </div>

            {/* Quick Consultation Form */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white mb-2">Send a Quick Message to the Engineering Desk</h2>
              <p className="text-xs text-slate-400 mb-6">We respond to student inquiries within a few hours.</p>

              {consultationSent ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Your message has been received! We will reach out shortly.
                </div>
              ) : (
                <form onSubmit={handleConsultationSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={consultationName}
                        onChange={e => setConsultationName(e.target.value)}
                        placeholder="e.g. Ama Serwaa"
                        className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-300 uppercase mb-1">Phone / WhatsApp</label>
                      <input
                        type="tel"
                        required
                        value={consultationPhone}
                        onChange={e => setConsultationPhone(e.target.value)}
                        placeholder="e.g. 024XXXXXXX"
                        className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase mb-1">What help do you need?</label>
                    <textarea
                      rows={4}
                      required
                      value={consultationMessage}
                      onChange={e => setConsultationMessage(e.target.value)}
                      placeholder="e.g. My ESP32 fails to read the ultrasonic sensor, or I need an urgent GSM SIM800L module before Friday..."
                      className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" /> Send Direct Inquiry via WhatsApp
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="relative z-20 border-t border-cyan-500/20 bg-slate-950/95 backdrop-blur-xl py-8 mt-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <div className="flex items-center space-x-3">
            <img src="/gkb-company-logo.png" alt="GKB Logo" className="h-6 w-auto opacity-70" />
            <span>&copy; {new Date().getFullYear()} GKB Technologies • All Rights Reserved</span>
          </div>
          <div className="text-center sm:text-right font-mono text-slate-400">
            God Knows Best • Engineering Prototypes • CEO Zumah Kelvin
          </div>
        </div>
      </footer>
    </div>
  );
}
