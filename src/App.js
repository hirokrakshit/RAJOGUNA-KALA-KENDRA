import React, { useState, useEffect } from 'react';
import { Lock, Mail, LogOut, Calendar, BookOpen, DollarSign, MessageCircle, Award, Bell, Users, Settings, Eye, EyeOff, Sparkles, X, Plus, Edit2, Trash2, Save, Upload, CheckCircle, AlertCircle, Download, FileText, Image, Video, Music, Clock, TrendingUp, UserX, RefreshCw } from 'lucide-react';

const USERS = {
  'admin@rajoguna.com': { password: 'Admin@123', role: 'admin', name: 'Admin User' },
  'student1@example.com': { password: 'Student@123', role: 'student', name: 'Priya Sharma', department: 'Dance' },
  'student2@example.com': { password: 'Student@123', role: 'student', name: 'Rahul Verma', department: 'Music' }
};

const RajogunaPWA = () => {
  // Auth State
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState('login');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });
  
  // Data State - Load from localStorage
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('rajoguna_students');
    return saved ? JSON.parse(saved) : [
      { id: 1, email: 'student1@example.com', name: 'Priya Sharma', dept: 'Dance', phone: '9876543211', totalFees: 50000, paidFees: 30000, enrollDate: '2024-01-15', blacklisted: false },
      { id: 2, email: 'student2@example.com', name: 'Rahul Verma', dept: 'Music', phone: '9876543212', totalFees: 45000, paidFees: 45000, enrollDate: '2024-02-01', blacklisted: false },
      { id: 3, email: 'student3@example.com', name: 'Anita Patel', dept: 'Dance', phone: '9876543213', totalFees: 50000, paidFees: 25000, enrollDate: '2024-03-10', blacklisted: false }
    ];
  });
  
  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem('rajoguna_attendance');
    return saved ? JSON.parse(saved) : [
      { id: 1, studentEmail: 'student1@example.com', date: '2025-10-15', present: true },
      { id: 2, studentEmail: 'student2@example.com', date: '2025-10-15', present: true },
      { id: 3, studentEmail: 'student1@example.com', date: '2025-10-14', present: true },
      { id: 4, studentEmail: 'student2@example.com', date: '2025-10-14', present: false }
    ];
  });
  
  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('rajoguna_payments');
    return saved ? JSON.parse(saved) : [
      { id: 1, studentEmail: 'student1@example.com', studentName: 'Priya Sharma', amount: 10000, date: '2025-10-01', status: 'verified', ref: 'TXN123', proof: null },
      { id: 2, studentEmail: 'student3@example.com', studentName: 'Anita Patel', amount: 5000, date: '2025-10-10', status: 'pending', ref: 'TXN789', proof: null }
    ];
  });
  
  const [notices, setNotices] = useState(() => {
    const saved = localStorage.getItem('rajoguna_notices');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Annual Function 2025', date: '2025-10-15', content: 'Annual function on Dec 20th', dept: 'all' },
      { id: 2, title: 'Dance Workshop', date: '2025-10-12', content: 'Kathak workshop by expert', dept: 'Dance' }
    ];
  });

  const [materials, setMaterials] = useState(() => {
    const saved = localStorage.getItem('rajoguna_materials');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Classical Dance Basics', type: 'PDF', dept: 'Dance', uploadDate: '2025-10-01', url: '#' },
      { id: 2, title: 'Music Theory 101', type: 'Video', dept: 'Music', uploadDate: '2025-10-05', url: '#' }
    ];
  });

  const [results, setResults] = useState(() => {
    const saved = localStorage.getItem('rajoguna_results');
    return saved ? JSON.parse(saved) : [
      { id: 1, studentEmail: 'student1@example.com', exam: 'Mid-Term 2024', subject: 'Dance', marks: 85, grade: 'A', date: '2025-09-30' }
    ];
  });

  const [certificates, setCertificates] = useState(() => {
    const saved = localStorage.getItem('rajoguna_certificates');
    return saved ? JSON.parse(saved) : [
      { id: 1, studentEmail: 'student1@example.com', title: 'Excellence Award', issueDate: '2025-09-01', url: '#' }
    ];
  });

  const [calendarEvents, setCalendarEvents] = useState(() => {
    const saved = localStorage.getItem('rajoguna_calendar');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Annual Day', date: '2025-12-20', type: 'event' },
      { id: 2, title: 'Dance Competition', date: '2025-11-15', type: 'competition' }
    ];
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('rajoguna_settings');
    return saved ? JSON.parse(saved) : {
      instituteName: 'RAJOGUNA KALA KENDRA',
      logo: null,
      banner: null,
      upiId: 'rajoguna@paytm',
      qrCode: null,
      bankName: 'State Bank of India',
      accountNumber: '1234567890',
      ifsc: 'SBIN0001234'
    };
  });
  
  // Modal States
  const [modals, setModals] = useState({ 
    addStudent: false, 
    editStudent: null, 
    addNotice: false, 
    addMaterial: false,
    addResult: false,
    addCertificate: false,
    addEvent: false,
    payment: false,
    attendance: false,
    settings: false,
    viewMaterial: null,
    viewCertificate: null
  });
  
  // Form States
  const [forms, setForms] = useState({
    student: { name: '', email: '', phone: '', dept: 'Dance', totalFees: 0, paidFees: 0 },
    notice: { title: '', content: '', dept: 'all' },
    material: { title: '', type: 'PDF', dept: 'Dance', file: null },
    result: { studentEmail: '', exam: '', subject: '', marks: '', grade: '' },
    certificate: { studentEmail: '', title: '', file: null },
    event: { title: '', date: '', type: 'event' },
    payment: { amount: '', ref: '', proof: null },
    attendanceDate: new Date().toISOString().split('T')[0],
    attendanceRecords: {}
  });
  
  const [chat, setChat] = useState({ 
    open: false, 
    messages: [{ sender: 'bot', text: 'Hello! How can I help you today? 😊' }], 
    input: '' 
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('rajoguna_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('rajoguna_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('rajoguna_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('rajoguna_notices', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem('rajoguna_materials', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem('rajoguna_results', JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    localStorage.setItem('rajoguna_certificates', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem('rajoguna_calendar', JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  useEffect(() => {
    localStorage.setItem('rajoguna_settings', JSON.stringify(settings));
  }, [settings]);

  // Login
  const login = () => {
    const u = USERS[email];
    if (!u || u.password !== password) { 
      setMsg({ text: 'Invalid credentials', type: 'error' }); 
      return; 
    }
    
    // Check if student is blacklisted
    if (u.role === 'student') {
      const student = students.find(s => s.email === email);
      if (student?.blacklisted) {
        setMsg({ text: 'Your account has been suspended. Contact admin.', type: 'error' });
        return;
      }
    }
    
    setUser({ ...u, email });
    setScreen(u.role === 'admin' ? 'admin' : 'student');
    setMsg({ text: 'Login successful!', type: 'success' });
  };

  const logout = () => { 
    setUser(null); 
    setScreen('login'); 
    setActiveTab('dashboard');
  };

  // Student CRUD
  const addStudent = () => {
    if (!forms.student.name || !forms.student.email) { 
      setMsg({ text: 'Fill required fields', type: 'error' }); 
      return; 
    }
    const newStudent = { 
      id: Date.now(), 
      ...forms.student, 
      enrollDate: new Date().toISOString().split('T')[0],
      blacklisted: false 
    };
    setStudents([...students, newStudent]);
    setForms({ ...forms, student: { name: '', email: '', phone: '', dept: 'Dance', totalFees: 0, paidFees: 0 } });
    setModals({ ...modals, addStudent: false });
    setMsg({ text: 'Student added successfully!', type: 'success' });
  };

  const deleteStudent = (id) => {
    if (window.confirm('Delete this student? This action cannot be undone.')) {
      setStudents(students.filter(s => s.id !== id));
      setMsg({ text: 'Student deleted!', type: 'success' });
    }
  };

  const saveStudent = () => {
    setStudents(students.map(s => s.id === modals.editStudent.id ? modals.editStudent : s));
    setModals({ ...modals, editStudent: null });
    setMsg({ text: 'Student updated!', type: 'success' });
  };

  const toggleBlacklist = (id) => {
    setStudents(students.map(s => s.id === id ? { ...s, blacklisted: !s.blacklisted } : s));
    setMsg({ text: 'Status updated!', type: 'success' });
  };

  // Attendance
  const markAttendance = () => {
    const date = forms.attendanceDate;
    const records = Object.entries(forms.attendanceRecords);
    
    if (records.length === 0) {
      setMsg({ text: 'Mark at least one student', type: 'error' });
      return;
    }

    // Remove old records for this date
    const filtered = attendance.filter(a => a.date !== date);
    
    // Add new records
    const newRecords = records.map(([email, present]) => ({
      id: Date.now() + Math.random(),
      studentEmail: email,
      date,
      present
    }));

    setAttendance([...filtered, ...newRecords]);
    setForms({ ...forms, attendanceRecords: {} });
    setModals({ ...modals, attendance: false });
    setMsg({ text: 'Attendance marked!', type: 'success' });
  };

  // Payment
  const submitPayment = () => {
    if (!forms.payment.amount || !forms.payment.ref) { 
      setMsg({ text: 'Fill all fields', type: 'error' }); 
      return; 
    }
    
    const proofURL = forms.payment.proof ? URL.createObjectURL(forms.payment.proof) : null;
    
    setPayments([...payments, { 
      id: Date.now(), 
      studentEmail: user.email, 
      studentName: user.name, 
      amount: Number(forms.payment.amount), 
      date: new Date().toISOString().split('T')[0], 
      status: 'pending', 
      ref: forms.payment.ref,
      proof: proofURL
    }]);
    setForms({ ...forms, payment: { amount: '', ref: '', proof: null } });
    setModals({ ...modals, payment: false });
    setMsg({ text: 'Payment submitted! Awaiting verification.', type: 'success' });
  };

  const verifyPayment = (id, status) => {
    setPayments(payments.map(p => p.id === id ? { ...p, status } : p));
    if (status === 'verified') {
      const p = payments.find(p => p.id === id);
      setStudents(students.map(s => s.email === p.studentEmail ? { ...s, paidFees: s.paidFees + p.amount } : s));
    }
    setMsg({ text: `Payment ${status}!`, type: 'success' });
  };

  // Notice
  const addNotice = () => {
    if (!forms.notice.title || !forms.notice.content) { 
      setMsg({ text: 'Fill all fields', type: 'error' }); 
      return; 
    }
    setNotices([{ 
      id: Date.now(), 
      ...forms.notice, 
      date: new Date().toISOString().split('T')[0] 
    }, ...notices]);
    setForms({ ...forms, notice: { title: '', content: '', dept: 'all' } });
    setModals({ ...modals, addNotice: false });
    setMsg({ text: 'Notice posted!', type: 'success' });
  };

  const deleteNotice = (id) => {
    if (window.confirm('Delete this notice?')) {
      setNotices(notices.filter(n => n.id !== id));
      setMsg({ text: 'Notice deleted!', type: 'success' });
    }
  };

  // Materials
  const addMaterial = () => {
    if (!forms.material.title || !forms.material.file) {
      setMsg({ text: 'Fill all fields and select a file', type: 'error' });
      return;
    }
    
    const fileURL = URL.createObjectURL(forms.material.file);
    const newMaterial = {
      id: Date.now(),
      title: forms.material.title,
      type: forms.material.type,
      dept: forms.material.dept,
      uploadDate: new Date().toISOString().split('T')[0],
      url: fileURL,
      fileName: forms.material.file.name
    };
    
    setMaterials([newMaterial, ...materials]);
    setForms({ ...forms, material: { title: '', type: 'PDF', dept: 'Dance', file: null } });
    setModals({ ...modals, addMaterial: false });
    setMsg({ text: 'Material uploaded!', type: 'success' });
  };

  const deleteMaterial = (id) => {
    if (window.confirm('Delete this material?')) {
      setMaterials(materials.filter(m => m.id !== id));
      setMsg({ text: 'Material deleted!', type: 'success' });
    }
  };

  // Results
  const addResult = () => {
    if (!forms.result.studentEmail || !forms.result.exam || !forms.result.marks) {
      setMsg({ text: 'Fill all required fields', type: 'error' });
      return;
    }
    
    setResults([{
      id: Date.now(),
      ...forms.result,
      marks: Number(forms.result.marks),
      date: new Date().toISOString().split('T')[0]
    }, ...results]);
    
    setForms({ ...forms, result: { studentEmail: '', exam: '', subject: '', marks: '', grade: '' } });
    setModals({ ...modals, addResult: false });
    setMsg({ text: 'Result added!', type: 'success' });
  };

  const deleteResult = (id) => {
    if (window.confirm('Delete this result?')) {
      setResults(results.filter(r => r.id !== id));
      setMsg({ text: 'Result deleted!', type: 'success' });
    }
  };

  // Certificates
  const addCertificate = () => {
    if (!forms.certificate.studentEmail || !forms.certificate.title) {
      setMsg({ text: 'Fill all required fields', type: 'error' });
      return;
    }
    
    const certURL = forms.certificate.file ? URL.createObjectURL(forms.certificate.file) : '#';
    
    setCertificates([{
      id: Date.now(),
      studentEmail: forms.certificate.studentEmail,
      title: forms.certificate.title,
      issueDate: new Date().toISOString().split('T')[0],
      url: certURL
    }, ...certificates]);
    
    setForms({ ...forms, certificate: { studentEmail: '', title: '', file: null } });
    setModals({ ...modals, addCertificate: false });
    setMsg({ text: 'Certificate added!', type: 'success' });
  };

  const deleteCertificate = (id) => {
    if (window.confirm('Delete this certificate?')) {
      setCertificates(certificates.filter(c => c.id !== id));
      setMsg({ text: 'Certificate deleted!', type: 'success' });
    }
  };

  // Calendar
  const addEvent = () => {
    if (!forms.event.title || !forms.event.date) {
      setMsg({ text: 'Fill all fields', type: 'error' });
      return;
    }
    
    setCalendarEvents([{ id: Date.now(), ...forms.event }, ...calendarEvents]);
    setForms({ ...forms, event: { title: '', date: '', type: 'event' } });
    setModals({ ...modals, addEvent: false });
    setMsg({ text: 'Event added!', type: 'success' });
  };

  const deleteEvent = (id) => {
    if (window.confirm('Delete this event?')) {
      setCalendarEvents(calendarEvents.filter(e => e.id !== id));
      setMsg({ text: 'Event deleted!', type: 'success' });
    }
  };

  // Settings
  const saveSettings = () => {
    setSettings({ ...settings });
    setModals({ ...modals, settings: false });
    setMsg({ text: 'Settings saved!', type: 'success' });
  };

  // Chat
  const sendChat = () => {
    if (!chat.input.trim()) return;
    const newMsgs = [...chat.messages, { sender: 'user', text: chat.input }];
    setChat({ ...chat, messages: newMsgs, input: '' });
    
    setTimeout(() => {
      let reply = 'I can help you with that!';
      const input = chat.input.toLowerCase();
      
      if (input.includes('fee') || input.includes('payment')) {
        reply = 'You can check your fee status in the Payments section. For any payment issues, contact the admin.';
      } else if (input.includes('attendance')) {
        reply = 'Your attendance record is available in the Dashboard. Maintain at least 75% attendance.';
      } else if (input.includes('material') || input.includes('download')) {
        reply = 'Study materials are available in the Materials section. Download what you need!';
      } else if (input.includes('certificate')) {
        reply = 'Certificates can be downloaded from the Certificates section once issued by admin.';
      } else if (input.includes('notice')) {
        reply = 'Check the Notices section for all announcements and updates.';
      } else if (input.includes('contact') || input.includes('help')) {
        reply = 'For support, email: admin@rajoguna.com or call: +91-9876543210';
      }
      
      setChat(prev => ({ 
        ...prev, 
        messages: [...prev.messages, { sender: 'bot', text: reply }] 
      }));
    }, 1000);
  };

  // Helper Functions
  const getAttendance = (email) => {
    const records = attendance.filter(a => a.studentEmail === email);
    if (!records.length) return 0;
    return Math.round((records.filter(a => a.present).length / records.length) * 100);
  };

  const getStudentData = () => {
    const s = students.find(s => s.email === user.email);
    if (!s) return null;
    return { 
      ...s, 
      attendance: getAttendance(user.email), 
      due: s.totalFees - s.paidFees,
      results: results.filter(r => r.studentEmail === user.email),
      certificates: certificates.filter(c => c.studentEmail === user.email)
    };
  };

  const getIcon = (type) => {
    switch(type) {
      case 'PDF': return <FileText className="w-5 h-5" />;
      case 'Video': return <Video className="w-5 h-5" />;
      case 'Audio': return <Music className="w-5 h-5" />;
      case 'Image': return <Image className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  // Auto-dismiss messages
  useEffect(() => {
    if (msg.text) setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  }, [msg]);

  // Components
  const Modal = ({ open, close, title, children, size = 'md' }) => !open ? null : (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-2xl w-full ${size === 'lg' ? 'max-w-4xl' : 'max-w-md'} p-6 max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <button onClick={close} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );

  const ChatWidget = () => (
    <>
      <button 
        onClick={() => setChat({ ...chat, open: !chat.open })} 
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-pink-500 text-white p-4 rounded-full shadow-lg z-50 hover:shadow-xl transition"
      >
        {chat.open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
      {chat.open && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl z-50" style={{ height: '500px' }}>
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-bold">AI Assistant</h3>
            </div>
          </div>
          <div className="overflow-y-auto p-4 space-y-3" style={{ height: 'calc(500px - 130px)' }}>
            {chat.messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${m.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}>
                  <p className="text-sm">{m.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={chat.input} 
                onChange={(e) => setChat({ ...chat, input: e.target.value })} 
                onKeyPress={(e) => e.key === 'Enter' && sendChat()} 
                className="flex-1 px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" 
                placeholder="Type your message..."
              />
              <button onClick={sendChat} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // LOGIN SCREEN
  if (screen === 'login') return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl mb-4">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">{settings.instituteName}</h1>
          <p className="text-gray-600">Institute Management System</p>
        </div>
        {msg.text && (
          <div className={`mb-4 p-3 border-l-4 rounded text-sm flex items-center gap-2 ${msg.type === 'error' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-green-50 border-green-500 text-green-700'}`}>
            {msg.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
            {msg.text}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                placeholder="Enter your email" 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type={showPwd ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' && login()} 
                className="w-full pl-12 pr-12 py-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                placeholder="Enter your password" 
              />
              <button 
                type="button" 
                onClick={() => setShowPwd(!showPwd)} 
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPwd ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
          </div>
          <button 
            onClick={login} 
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-600 transition"
          >
            Sign In
          </button>
        </div>
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs font-semibold mb-2 text-gray-700">Demo Credentials:</p>
          <div className="text-xs space-y-1 text-gray-600">
            <p><strong>Student:</strong> student1@example.com / Student@123</p>
          </div>
        </div>
      </div>
    </div>
  );

  // STUDENT DASHBOARD
  if (screen === 'student') {
    const data = getStudentData();
    if (!data) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-4 sticky top-0 z-40 shadow-lg">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8" />
              <div>
                <h1 className="text-xl font-bold">{settings.instituteName}</h1>
                <p className="text-sm opacity-90">Student Portal</p>
              </div>
            </div>
            <button onClick={logout} className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <nav className="bg-white shadow-sm border-b sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex space-x-1 overflow-x-auto">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: Award },
                { id: 'attendance', label: 'Attendance', icon: Calendar },
                { id: 'fees', label: 'Fees', icon: DollarSign },
                { id: 'materials', label: 'Materials', icon: BookOpen },
                { id: 'results', label: 'Results', icon: TrendingUp },
                { id: 'certificates', label: 'Certificates', icon: Award },
                { id: 'notices', label: 'Notices', icon: Bell },
                { id: 'calendar', label: 'Events', icon: Calendar }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition whitespace-nowrap ${
                    activeTab === tab.id ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-600 hover:text-purple-600'
                  }`}
                >
                  <tab.icon size={18} />
                  <span className="text-sm">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto p-4">
        {msg.text && (
          <div className={`mb-4 p-3 border-l-4 rounded text-sm flex items-center gap-2 ${msg.type === 'error' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-green-50 border-green-500 text-green-700'}`}>
            {msg.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
            {msg.text}
          </div>
        )}

        {activeTab === 'dashboard' && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total Students', value: students.length, icon: Users, color: 'blue' },
                { label: 'Dance', value: students.filter(s => s.dept === 'Dance').length, icon: Users, color: 'pink' },
                { label: 'Music', value: students.filter(s => s.dept === 'Music').length, icon: Music, color: 'purple' },
                { label: 'Pending Payments', value: payments.filter(p => p.status === 'pending').length, icon: AlertCircle, color: 'yellow' }
              ].map((s, i) => (
                <div key={i} className={`bg-white rounded-xl p-5 shadow-md border-l-4 border-${s.color}-500`}>
                  <s.icon className={`w-8 h-8 text-${s.color}-600 mb-2`} />
                  <span className="text-sm text-gray-600 block">{s.label}</span>
                  <p className="text-3xl font-bold mt-1">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <button onClick={() => setModals({ ...modals, addStudent: true })} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl flex flex-col items-center gap-2 transition">
                <Plus className="w-8 h-8 text-purple-600" />
                <span className="font-semibold">Add Student</span>
              </button>
              <button onClick={() => setModals({ ...modals, attendance: true })} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl flex flex-col items-center gap-2 transition">
                <Calendar className="w-8 h-8 text-green-600" />
                <span className="font-semibold">Mark Attendance</span>
              </button>
              <button onClick={() => setModals({ ...modals, addNotice: true })} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl flex flex-col items-center gap-2 transition">
                <Bell className="w-8 h-8 text-orange-600" />
                <span className="font-semibold">Post Notice</span>
              </button>
              <button onClick={() => setModals({ ...modals, addMaterial: true })} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl flex flex-col items-center gap-2 transition">
                <Upload className="w-8 h-8 text-blue-600" />
                <span className="font-semibold">Upload Material</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <AlertCircle className="text-yellow-600" />
                  Pending Payments
                </h3>
                <div className="space-y-3">
                  {payments.filter(p => p.status === 'pending').slice(0, 5).map(p => (
                    <div key={p.id} className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{p.studentName}</p>
                          <p className="text-sm text-gray-600">₹{p.amount} - {p.ref}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => verifyPayment(p.id, 'verified')} className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                            Verify
                          </button>
                          <button onClick={() => verifyPayment(p.id, 'rejected')} className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Users className="text-blue-600" />
                  Recent Students
                </h3>
                <div className="space-y-3">
                  {students.slice(0, 5).map(s => (
                    <div key={s.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold">{s.name}</p>
                        <p className="text-sm text-gray-600">{s.dept}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        s.blacklisted ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {s.blacklisted ? 'Blacklisted' : 'Active'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'students' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Student Management</h2>
              <button onClick={() => setModals({ ...modals, addStudent: true })} className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                <Plus size={20} />
                Add Student
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2">
                    <th className="text-left py-3 px-4 text-sm font-semibold">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Dept</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Phone</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Fees Due</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium">{s.name}</td>
                      <td className="py-3 px-4 text-sm">{s.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          s.dept === 'Dance' ? 'bg-pink-100 text-pink-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {s.dept}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">{s.phone}</td>
                      <td className="py-3 px-4 text-sm font-semibold text-red-600">₹{(s.totalFees - s.paidFees).toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <button onClick={() => toggleBlacklist(s.id)} className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          s.blacklisted ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {s.blacklisted ? 'Blacklisted' : 'Active'}
                        </button>
                      </td>
                      <td className="py-3 px-4 flex gap-2">
                        <button onClick={() => setModals({ ...modals, editStudent: s })} className="text-blue-600 hover:text-blue-800">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteStudent(s.id)} className="text-red-600 hover:text-red-800">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => toggleBlacklist(s.id)} className="text-orange-600 hover:text-orange-800">
                          <UserX className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Attendance Management</h2>
              <button onClick={() => setModals({ ...modals, attendance: true })} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                <Plus size={20} />
                Mark Attendance
              </button>
            </div>
            <div className="mb-6">
              <h3 className="font-bold mb-3">Recent Records</h3>
              <div className="space-y-2">
                {[...new Set(attendance.map(a => a.date))].slice(0, 10).map(date => {
                  const dayRecords = attendance.filter(a => a.date === date);
                  const presentCount = dayRecords.filter(a => a.present).length;
                  return (
                    <div key={date} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{date}</p>
                        <p className="text-sm text-gray-600">{presentCount} / {dayRecords.length} present</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">{Math.round((presentCount / dayRecords.length) * 100)}%</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Payment Verification</h2>
            <div className="space-y-4">
              {payments.map(p => (
                <div key={p.id} className={`p-4 rounded-lg border-2 ${
                  p.status === 'pending' ? 'bg-yellow-50 border-yellow-300' : 
                  p.status === 'verified' ? 'bg-green-50 border-green-300' : 
                  'bg-red-50 border-red-300'
                }`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-bold text-lg">{p.studentName}</p>
                      <p className="text-gray-600">{p.studentEmail}</p>
                      <p className="text-sm mt-2">Amount: <span className="font-bold text-green-600">₹{p.amount.toLocaleString()}</span></p>
                      <p className="text-sm">Ref: {p.ref}</p>
                      <p className="text-sm">Date: {p.date}</p>
                      <p className="text-sm mt-2">
                        Status: <span className={`font-semibold ${
                          p.status === 'verified' ? 'text-green-600' : 
                          p.status === 'rejected' ? 'text-red-600' : 
                          'text-yellow-600'
                        }`}>
                          {p.status.toUpperCase()}
                        </span>
                      </p>
                    </div>
                    {p.proof && (
                      <div className="ml-4">
                        <img src={p.proof} alt="Payment Proof" className="w-32 h-32 object-cover rounded-lg border-2" />
                      </div>
                    )}
                    {p.status === 'pending' && (
                      <div className="flex flex-col gap-2 ml-4">
                        <button onClick={() => verifyPayment(p.id, 'verified')} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                          <CheckCircle size={18} />
                          Approve
                        </button>
                        <button onClick={() => verifyPayment(p.id, 'rejected')} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2">
                          <X size={18} />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Study Materials</h2>
              <button onClick={() => setModals({ ...modals, addMaterial: true })} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                <Upload size={20} />
                Upload Material
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {materials.map(m => (
                <div key={m.id} className="p-4 border-2 rounded-lg hover:border-blue-500 transition">
                  <div className="flex justify-between items-start mb-3">
                    {getIcon(m.type)}
                    <button onClick={() => deleteMaterial(m.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <h3 className="font-bold mb-2">{m.title}</h3>
                  <p className="text-sm text-gray-600">{m.dept}</p>
                  <p className="text-xs text-gray-500 mt-1">{m.uploadDate}</p>
                  <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-xs rounded">{m.type}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Results Management</h2>
              <button onClick={() => setModals({ ...modals, addResult: true })} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                <Plus size={20} />
                Add Result
              </button>
            </div>
            <div className="space-y-3">
              {results.map(r => {
                const student = students.find(s => s.email === r.studentEmail);
                return (
                  <div key={r.id} className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-l-4 border-indigo-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold">{student?.name}</p>
                        <p className="text-sm text-gray-600">{r.exam} - {r.subject}</p>
                        <p className="text-xs text-gray-500">{r.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-indigo-600">{r.marks}</p>
                        <span className="px-2 py-1 bg-indigo-200 text-indigo-800 rounded text-sm">Grade {r.grade}</span>
                      </div>
                      <button onClick={() => deleteResult(r.id)} className="text-red-600 hover:text-red-800 ml-4">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'certificates' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Certificates Management</h2>
              <button onClick={() => setModals({ ...modals, addCertificate: true })} className="flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700">
                <Plus size={20} />
                Add Certificate
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {certificates.map(c => {
                const student = students.find(s => s.email === c.studentEmail);
                return (
                  <div key={c.id} className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <Award className="w-8 h-8 text-yellow-600" />
                      <button onClick={() => deleteCertificate(c.id)} className="text-red-600 hover:text-red-800">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <h3 className="font-bold mb-1">{c.title}</h3>
                    <p className="text-sm text-gray-600">{student?.name}</p>
                    <p className="text-xs text-gray-500 mt-1">Issued: {c.issueDate}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'notices' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Notices & Announcements</h2>
              <button onClick={() => setModals({ ...modals, addNotice: true })} className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
                <Plus size={20} />
                Post Notice
              </button>
            </div>
            <div className="space-y-4">
              {notices.map(n => (
                <div key={n.id} className="p-4 border-2 rounded-lg hover:border-orange-500 transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Bell className="text-orange-600" size={24} />
                        <h3 className="font-bold text-lg">{n.title}</h3>
                      </div>
                      <p className="text-gray-700 mb-3">{n.content}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full">{n.dept}</span>
                        <span>{n.date}</span>
                      </div>
                    </div>
                    <button onClick={() => deleteNotice(n.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Academic Calendar</h2>
              <button onClick={() => setModals({ ...modals, addEvent: true })} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                <Plus size={20} />
                Add Event
              </button>
            </div>
            <div className="space-y-3">
              {calendarEvents.sort((a, b) => new Date(a.date) - new Date(b.date)).map(e => (
                <div key={e.id} className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-l-4 border-green-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">{e.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{new Date(e.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${
                        e.type === 'event' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {e.type}
                      </span>
                    </div>
                    <button onClick={() => deleteEvent(e.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">System Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Institute Name</label>
                <input
                  type="text"
                  value={settings.instituteName}
                  onChange={(e) => setSettings({ ...settings, instituteName: e.target.value })}
                  className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">UPI ID</label>
                  <input
                    type="text"
                    value={settings.upiId}
                    onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                    className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Bank Name</label>
                  <input
                    type="text"
                    value={settings.bankName}
                    onChange={(e) => setSettings({ ...settings, bankName: e.target.value })}
                    className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Account Number</label>
                  <input
                    type="text"
                    value={settings.accountNumber}
                    onChange={(e) => setSettings({ ...settings, accountNumber: e.target.value })}
                    className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">IFSC Code</label>
                  <input
                    type="text"
                    value={settings.ifsc}
                    onChange={(e) => setSettings({ ...settings, ifsc: e.target.value })}
                    className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500"
                  />
                </div>
              </div>
              <button onClick={saveSettings} className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold">
                Save Settings
              </button>
            </div>
          </div>
        )}

        {/* Admin Modals */}
        <Modal open={modals.addStudent} close={() => setModals({ ...modals, addStudent: false })} title="Add New Student">
          <div className="space-y-4">
            <input type="text" placeholder="Full Name" value={forms.student.name} onChange={(e) => setForms({ ...forms, student: { ...forms.student, name: e.target.value } })} className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500" />
            <input type="email" placeholder="Email" value={forms.student.email} onChange={(e) => setForms({ ...forms, student: { ...forms.student, email: e.target.value } })} className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500" />
            <input type="tel" placeholder="Phone" value={forms.student.phone} onChange={(e) => setForms({ ...forms, student: { ...forms.student, phone: e.target.value } })} className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500" />
            <select value={forms.student.dept} onChange={(e) => setForms({ ...forms, student: { ...forms.student, dept: e.target.value } })} className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500">
              <option value="Dance">Dance</option>
              <option value="Music">Music</option>
              <option value="Drama">Drama</option>
            </select>
            <input type="number" placeholder="Total Fees" value={forms.student.totalFees} onChange={(e) => setForms({ ...forms, student: { ...forms.student, totalFees: e.target.value } })} className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500" />
            <input type="number" placeholder="Paid Fees" value={forms.student.paidFees} onChange={(e) => setForms({ ...forms, student: { ...forms.student, paidFees: e.target.value } })} className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500" />
            <button onClick={addStudent} className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold">Add Student</button>
          </div>
        </Modal>

        {modals.editStudent && (
          <Modal open={true} close={() => setModals({ ...modals, editStudent: null })} title="Edit Student">
            <div className="space-y-4">
              <input type="text" value={modals.editStudent.name} onChange={(e) => setModals({ ...modals, editStudent: { ...modals.editStudent, name: e.target.value } })} className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500" />
              <input type="email" value={modals.editStudent.email} onChange={(e) => setModals({ ...modals, editStudent: { ...modals.editStudent, email: e.target.value } })} className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500" />
              <input type="tel" value={modals.editStudent.phone} onChange={(e) => setModals({ ...modals, editStudent: { ...modals.editStudent, phone: e.target.value } })} className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500" />
              <select value={modals.editStudent.dept} onChange={(e) => setModals({ ...modals, editStudent: { ...modals.editStudent, dept: e.target.value } })} className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500">
                <option value="Dance">Dance</option>
                <option value="Music">Music</option>
                <option value="Drama">Drama</option>
              </select>
              <input type="number" placeholder="Total Fees" value={modals.editStudent.totalFees} onChange={(e) => setModals({ ...modals, editStudent: { ...modals.editStudent, totalFees: Number(e.target.value) } })} className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500" />
              <input type="number" placeholder="Paid Fees" value={modals.editStudent.paidFees} onChange={(e) => setModals({ ...modals, editStudent: { ...modals.editStudent, paidFees: Number(e.target.value) } })} className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500" />
              <button onClick={saveStudent} className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold flex items-center justify-center gap-2">
                <Save size={20} />
                Save Changes
              </button>
            </div>
          </Modal>
        )}

        <Modal open={modals.attendance} close={() => setModals({ ...modals, attendance: false })} title="Mark Attendance" size="lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Date</label>
              <input
                type="date"
                value={forms.attendanceDate}
                onChange={(e) => setForms({ ...forms, attendanceDate: e.target.value })}
                className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500"
              />
            </div>
            <div>
              <h3 className="font-semibold mb-3">Mark Students</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {students.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">{s.name}</p>
                      <p className="text-sm text-gray-600">{s.dept}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setForms({ ...forms, attendanceRecords: { ...forms.attendanceRecords, [s.email]: true } })}
                        className={`px-4 py-2 rounded-lg font-semibold ${
                          forms.attendanceRecords[s.email] === true ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => setForms({ ...forms, attendanceRecords: { ...forms.attendanceRecords, [s.email]: false } })}
                        className={`px-4 py-2 rounded-lg font-semibold ${
                          forms.attendanceRecords[s.email] === false ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        Absent
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={markAttendance} className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">
              Save Attendance
            </button>
          </div>
        </Modal>

        <Modal open={modals.addNotice} close={() => setModals({ ...modals, addNotice: false })} title="Post New Notice">
          <div className="space-y-4">
            <input type="text" placeholder="Notice Title" value={forms.notice.title} onChange={(e) => setForms({ ...forms, notice: { ...forms.notice, title: e.target.value } })} className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500" />
            <textarea placeholder="Notice Content" value={forms.notice.content} onChange={(e) => setForms({ ...forms, notice: { ...forms.notice, content: e.target.value } })} className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500 h-32" />
            <select value={forms.notice.dept} onChange={(e) => setForms({ ...forms, notice: { ...forms.notice, dept: e.target.value } })} className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500">
              <option value="all">All Departments</option>
              <option value="Dance">Dance</option>
              <option value="Music">Music</option>
              <option value="Drama">Drama</option>
            </select>
            <button onClick={addNotice} className="w-full py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold">Post Notice</button>
          </div>
        </Modal>

        <Modal open={modals.addMaterial} close={() => setModals({ ...modals, addMaterial: false })} title="Upload Study Material">
          <div className="space-y-4">
            <input type="text" placeholder="Material Title" value={forms.material.title} onChange={(e) => setForms({ ...forms, material: { ...forms.material, title: e.target.value } })} className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500" />
            <select value={forms.material.type} onChange={(e) => setForms({ ...forms, material: { ...forms.material, type: e.target.value } })} className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500">
              <option value="PDF">PDF Document</option>
              <option value="Video">Video</option>
              <option value="Audio">Audio</option>
              <option value="Image">Image</option>
            </select>
            <select value={forms.material.dept} onChange={(e) => setForms({ ...forms, material: { ...forms.material, dept: e.target.value } })} className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500">
              <option value="Dance">Dance</option>
              <option value="Music">Music</option>
              <option value="Drama">Drama</option>
              <option value="all">All Departments</option>
            </select>
            <div>
              <label className="block text-sm font-semibold mb-2">Upload File</label>
              <input
                type="file"
                onChange={(e) => setForms({ ...forms, material: { ...forms.material, file: e.target.files[0] } })}
                className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500"
                accept=".pdf,.mp4,.mp3,.jpg,.jpeg,.png"
              />
            </div>
            <button onClick={addMaterial} className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center gap-2">
              <Upload size={20} />
              Upload Material
            </button>
          </div>
        </Modal>

        <Modal open={modals.addResult} close={() => setModals({ ...modals, addResult: false })} title="Add Student Result">
          <div className="space-y-4">
            <select value={forms.result.studentEmail} onChange={(e) => setForms({ ...forms, result: { ...forms.result, studentEmail: e.target.value } })} className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500">
              <option value="">Select Student</option>
              {students.map(s => (
                <option key={s.id} value={s.email}>{s.name} - {s.dept}</option>
              ))}
            </select>
            <input type="text" placeholder="Exam Name (e.g., Mid-Term 2024)" value={forms.result.exam} onChange={(e) => setForms({ ...forms, result: { ...forms.result, exam: e.target.value } })} className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500" />
            <input type="text" placeholder="Subject" value={forms.result.subject} onChange={(e) => setForms({ ...forms, result: { ...forms.result, subject: e.target.value } })} className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500" />
            <input type="number" placeholder="Marks" value={forms.result.marks} onChange={(e) => setForms({ ...forms, result: { ...forms.result, marks: e.target.value } })} className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500" />
            <input type="text" placeholder="Grade (e.g., A, B+, C)" value={forms.result.grade} onChange={(e) => setForms({ ...forms, result: { ...forms.result, grade: e.target.value } })} className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500" />
            <button onClick={addResult} className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">Add Result</button>
          </div>
        </Modal>

        <Modal open={modals.addCertificate} close={() => setModals({ ...modals, addCertificate: false })} title="Add Certificate">
          <div className="space-y-4">
            <select value={forms.certificate.studentEmail} onChange={(e) => setForms({ ...forms, certificate: { ...forms.certificate, studentEmail: e.target.value } })} className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500">
              <option value="">Select Student</option>
              {students.map(s => (
                <option key={s.id} value={s.email}>{s.name} - {s.dept}</option>
              ))}
            </select>
            <input type="text" placeholder="Certificate Title" value={forms.certificate.title} onChange={(e) => setForms({ ...forms, certificate: { ...forms.certificate, title: e.target.value } })} className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500" />
            <div>
              <label className="block text-sm font-semibold mb-2">Upload Certificate (Optional)</label>
              <input
                type="file"
                onChange={(e) => setForms({ ...forms, certificate: { ...forms.certificate, file: e.target.files[0] } })}
                className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500"
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </div>
            <button onClick={addCertificate} className="w-full py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-semibold">Add Certificate</button>
          </div>
        </Modal>

        <Modal open={modals.addEvent} close={() => setModals({ ...modals, addEvent: false })} title="Add Calendar Event">
          <div className="space-y-4">
            <input type="text" placeholder="Event Title" value={forms.event.title} onChange={(e) => setForms({ ...forms, event: { ...forms.event, title: e.target.value } })} className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500" />
            <input type="date" value={forms.event.date} onChange={(e) => setForms({ ...forms, event: { ...forms.event, date: e.target.value } })} className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500" />
            <select value={forms.event.type} onChange={(e) => setForms({ ...forms, event: { ...forms.event, type: e.target.value } })} className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500">
              <option value="event">Event</option>
              <option value="competition">Competition</option>
              <option value="holiday">Holiday</option>
              <option value="exam">Exam</option>
            </select>
            <button onClick={addEvent} className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">Add Event</button>
          </div>
        </Modal>

        <ChatWidget />
      </div>
    </div>
  );

  return null;
};

export default RajogunaPWA;  {msg.text && (
            <div className={`mb-4 p-3 border-l-4 rounded text-sm flex items-center gap-2 ${msg.type === 'error' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-green-50 border-green-500 text-green-700'}`}>
              {msg.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
              {msg.text}
            </div>
          )}

          {activeTab === 'dashboard' && (
            <>
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white mb-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-2">Welcome, {data.name}! 👋</h2>
                <p className="opacity-90">Department: {data.dept}</p>
                <p className="text-sm opacity-80 mt-1">Enrolled: {data.enrollDate}</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Attendance', value: `${data.attendance}%`, icon: Calendar, color: 'green' },
                  { label: 'Total Fees', value: `₹${data.totalFees.toLocaleString()}`, icon: DollarSign, color: 'blue' },
                  { label: 'Paid', value: `₹${data.paidFees.toLocaleString()}`, icon: CheckCircle, color: 'yellow' },
                  { label: 'Due', value: `₹${data.due.toLocaleString()}`, icon: AlertCircle, color: 'red' }
                ].map((s, i) => (
                  <div key={i} className={`bg-white rounded-xl p-5 shadow-md border-l-4 border-${s.color}-500`}>
                    <s.icon className={`w-8 h-8 text-${s.color}-600 mb-2`} />
                    <span className="text-sm text-gray-600 block">{s.label}</span>
                    <p className="text-2xl font-bold mt-1">{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Bell className="text-blue-600" />
                    Recent Notices
                  </h3>
                  <div className="space-y-3">
                    {notices.filter(n => n.dept === 'all' || n.dept === data.dept).slice(0, 3).map(n => (
                      <div key={n.id} className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                        <h4 className="font-semibold">{n.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{n.content}</p>
                        <p className="text-xs text-gray-500 mt-2">{n.date}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Calendar className="text-green-600" />
                    Upcoming Events
                  </h3>
                  <div className="space-y-3">
                    {calendarEvents.slice(0, 3).map(e => (
                      <div key={e.id} className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                        <h4 className="font-semibold">{e.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{e.date}</p>
                        <span className="text-xs px-2 py-1 bg-green-200 text-green-800 rounded-full mt-2 inline-block">
                          {e.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'attendance' && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Calendar className="text-purple-600" />
                Attendance Record
              </h2>
              <div className="text-center py-8">
                <div className="inline-block relative">
                  <svg className="w-48 h-48">
                    <circle cx="96" cy="96" r="80" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="12"
                      strokeDasharray={`${(data.attendance / 100) * 502.4} 502.4`}
                      strokeLinecap="round"
                      transform="rotate(-90 96 96)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-5xl font-bold text-purple-600">{data.attendance}%</p>
                    <p className="text-gray-600 mt-2">Present</p>
                  </div>
                </div>
                <p className="mt-6 text-lg text-gray-600">
                  {data.attendance >= 75 ? '🎉 Excellent attendance!' : '⚠️ Please improve your attendance'}
                </p>
                <p className="text-sm text-gray-500 mt-2">Minimum required: 75%</p>
              </div>

              <div className="mt-6">
                <h3 className="font-bold mb-3">Recent Records</h3>
                <div className="space-y-2">
                  {attendance.filter(a => a.studentEmail === user.email).slice(0, 10).map(a => (
                    <div key={a.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm">{a.date}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        a.present ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {a.present ? 'Present' : 'Absent'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fees' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <DollarSign className="text-green-600" />
                  Fee Details
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="font-semibold">Total Fees</span>
                    <span className="text-2xl font-bold">₹{data.totalFees.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <span className="font-semibold">Paid</span>
                    <span className="text-2xl font-bold text-green-600">₹{data.paidFees.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                    <span className="font-semibold">Due</span>
                    <span className="text-2xl font-bold text-red-600">₹{data.due.toLocaleString()}</span>
                  </div>
                </div>
                {data.due > 0 && (
                  <button
                    onClick={() => setModals({ ...modals, payment: true })}
                    className="w-full mt-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:from-purple-700 hover:to-pink-600 font-semibold flex items-center justify-center gap-2"
                  >
                    <Upload size={20} />
                    Submit Payment
                  </button>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">Payment Information</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="font-semibold mb-2">UPI Payment</p>
                    <p className="text-purple-600 font-mono">{settings.upiId}</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="font-semibold mb-2">Bank Transfer</p>
                    <p className="text-sm">Bank: {settings.bankName}</p>
                    <p className="text-sm">A/C: {settings.accountNumber}</p>
                    <p className="text-sm">IFSC: {settings.ifsc}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">Payment History</h3>
                <div className="space-y-3">
                  {payments.filter(p => p.studentEmail === user.email).map(p => (
                    <div key={p.id} className={`p-4 rounded-lg border-2 ${
                      p.status === 'verified' ? 'bg-green-50 border-green-200' : 
                      p.status === 'pending' ? 'bg-yellow-50 border-yellow-200' : 
                      'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">₹{p.amount.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">Ref: {p.ref}</p>
                          <p className="text-xs text-gray-500">{p.date}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          p.status === 'verified' ? 'bg-green-200 text-green-800' : 
                          p.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : 
                          'bg-red-200 text-red-800'
                        }`}>
                          {p.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'materials' && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <BookOpen className="text-orange-600" />
                Study Materials
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {materials.filter(m => m.dept === data.dept || m.dept === 'all').map(m => (
                  <div key={m.id} className="p-4 border-2 rounded-lg hover:border-purple-500 transition hover:shadow-lg">
                    <div className="flex items-start justify-between mb-3">
                      {getIcon(m.type)}
                      <span className="px-2 py-1 bg-gray-100 text-xs rounded">{m.type}</span>
                    </div>
                    <h3 className="font-bold mb-2">{m.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{m.dept}</p>
                    <p className="text-xs text-gray-500 mb-3">Uploaded: {m.uploadDate}</p>
                    <button 
                      onClick={() => setModals({ ...modals, viewMaterial: m })}
                      className="w-full py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 flex items-center justify-center gap-2"
                    >
                      <Download size={16} />
                      <span>Download</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="text-blue-600" />
                Exam Results
              </h2>
              <div className="space-y-4">
                {data.results.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No results available yet</p>
                  </div>
                ) : (
                  data.results.map(r => (
                    <div key={r.id} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-blue-500">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">{r.exam}</h3>
                          <p className="text-sm text-gray-600">{r.subject}</p>
                          <p className="text-xs text-gray-500 mt-1">{r.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-blue-600">{r.marks}</p>
                          <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm font-semibold">
                            Grade {r.grade}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'certificates' && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Award className="text-yellow-600" />
                Certificates
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.certificates.length === 0 ? (
                  <div className="col-span-2 text-center py-12 text-gray-500">
                    <Award className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No certificates issued yet</p>
                  </div>
                ) : (
                  data.certificates.map(c => (
                    <div key={c.id} className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-200 hover:shadow-lg transition">
                      <Award className="w-12 h-12 text-yellow-600 mb-3" />
                      <h3 className="font-bold text-lg mb-2">{c.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">Issued: {c.issueDate}</p>
                      <button 
                        onClick={() => setModals({ ...modals, viewCertificate: c })}
                        className="w-full py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center justify-center gap-2"
                      >
                        <Download size={16} />
                        Download Certificate
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'notices' && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Bell className="text-red-600" />
                Notices & Announcements
              </h2>
              <div className="space-y-4">
                {notices.filter(n => n.dept === 'all' || n.dept === data.dept).map(n => (
                  <div key={n.id} className="p-4 border-2 rounded-lg hover:border-purple-500 transition">
                    <div className="flex items-center gap-3 mb-2">
                      <Bell className="text-purple-600" size={24} />
                      <h3 className="font-bold text-lg">{n.title}</h3>
                    </div>
                    <p className="text-gray-700 mb-3">{n.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">{n.dept}</span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {n.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Calendar className="text-green-600" />
                Academic Calendar
              </h2>
              <div className="space-y-3">
                {calendarEvents.sort((a, b) => new Date(a.date) - new Date(b.date)).map(e => (
                  <div key={e.id} className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-l-4 border-green-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">{e.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{new Date(e.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        e.type === 'event' ? 'bg-blue-200 text-blue-800' : 
                        e.type === 'competition' ? 'bg-purple-200 text-purple-800' : 
                        'bg-green-200 text-green-800'
                      }`}>
                        {e.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Student Modals */}
        <Modal open={modals.payment} close={() => setModals({ ...modals, payment: false })} title="Submit Payment">
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg text-sm">
              <p className="font-semibold mb-2">📋 Payment Instructions:</p>
              <ol className="list-decimal list-inside space-y-1 text-gray-700">
                <li>Pay via UPI: <span className="font-mono text-purple-600">{settings.upiId}</span></li>
                <li>Take screenshot of successful transaction</li>
                <li>Enter amount and transaction reference</li>
                <li>Upload payment proof</li>
                <li>Admin will verify within 24 hours</li>
              </ol>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Amount (₹)</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={forms.payment.amount}
                onChange={(e) => setForms({ ...forms, payment: { ...forms.payment, amount: e.target.value } })}
                className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Transaction Reference</label>
              <input
                type="text"
                placeholder="Enter UPI transaction ID"
                value={forms.payment.ref}
                onChange={(e) => setForms({ ...forms, payment: { ...forms.payment, ref: e.target.value } })}
                className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Upload Payment Proof</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setForms({ ...forms, payment: { ...forms.payment, proof: e.target.files[0] } })}
                className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500 focus:outline-none"
              />
            </div>
            <button
              onClick={submitPayment}
              className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
            >
              Submit Payment
            </button>
          </div>
        </Modal>

        <Modal open={modals.viewMaterial} close={() => setModals({ ...modals, viewMaterial: null })} title="Download Material">
          {modals.viewMaterial && (
            <div className="text-center py-6">
              {getIcon(modals.viewMaterial.type)}
              <h3 className="text-xl font-bold mt-4 mb-2">{modals.viewMaterial.title}</h3>
              <p className="text-gray-600 mb-4">{modals.viewMaterial.fileName || 'File ready for download'}</p>
              <a
                href={modals.viewMaterial.url}
                download
                className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Download Now
              </a>
            </div>
          )}
        </Modal>

        <Modal open={modals.viewCertificate} close={() => setModals({ ...modals, viewCertificate: null })} title="Download Certificate">
          {modals.viewCertificate && (
            <div className="text-center py-6">
              <Award className="w-24 h-24 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">{modals.viewCertificate.title}</h3>
              <p className="text-gray-600 mb-6">Issued on: {modals.viewCertificate.issueDate}</p>
              <a
                href={modals.viewCertificate.url}
                download
                className="inline-block px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
              >
                Download Certificate
              </a>
            </div>
          )}
        </Modal>

        <ChatWidget />
      </div>
    );
  }

  // ADMIN DASHBOARD
  if (screen === 'admin') return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-4 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold">{settings.instituteName}</h1>
              <p className="text-sm opacity-90">Admin Panel</p>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <nav className="bg-white shadow-sm border-b sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Award },
              { id: 'students', label: 'Students', icon: Users },
              { id: 'attendance', label: 'Attendance', icon: Calendar },
              { id: 'payments', label: 'Payments', icon: DollarSign },
              { id: 'materials', label: 'Materials', icon: BookOpen },
              { id: 'results', label: 'Results', icon: TrendingUp },
              { id: 'certificates', label: 'Certificates', icon: Award },
              { id: 'notices', label: 'Notices', icon: Bell },
              { id: 'calendar', label: 'Calendar', icon: Calendar },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition whitespace-nowrap ${
                  activeTab === tab.id ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-600 hover:text-purple-600'
                }`}
              >
                <tab.icon size={18} />
                <span className="text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4">
        </div>
      </div>
    </div>
  );
}

return null;
};

export default RajogunaPWA;
