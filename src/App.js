import React, { useState, useEffect } from 'react';
import { Lock, Mail, LogOut, Calendar, BookOpen, DollarSign, MessageCircle, Award, Bell, Users, Settings, Eye, EyeOff, Sparkles, X, Edit, Trash2, Plus, Upload, Download, CheckCircle, AlertCircle, Search, Filter } from 'lucide-react';

// Mock Data Store (Replace with Firebase later)
const INITIAL_STUDENTS = [
  { id: 1, name: 'Priya Sharma', email: 'priya@example.com', department: 'Dance', phone: '9876543210', attendance: 92, totalFees: 15000, paidFees: 10000, enrollDate: '2024-01-15', status: 'active' },
  { id: 2, name: 'Rahul Verma', email: 'rahul@example.com', department: 'Music', phone: '9876543211', attendance: 88, totalFees: 12000, paidFees: 12000, enrollDate: '2024-02-01', status: 'active' },
  { id: 3, name: 'Anita Singh', email: 'anita@example.com', department: 'Drama', phone: '9876543212', attendance: 95, totalFees: 10000, paidFees: 8000, enrollDate: '2024-01-20', status: 'active' }
];

const INITIAL_NOTICES = [
  { id: 1, title: 'Annual Day Event', content: 'Our annual day will be held on December 20th', date: '2024-10-15', department: 'All' },
  { id: 2, title: 'Dance Workshop', content: 'Special workshop on classical dance this weekend', date: '2024-10-14', department: 'Dance' }
];

const INITIAL_MATERIALS = [
  { id: 1, title: 'Classical Dance Basics', type: 'PDF', url: '#', department: 'Dance', uploadDate: '2024-10-01' },
  { id: 2, title: 'Music Theory Guide', type: 'PDF', url: '#', department: 'Music', uploadDate: '2024-10-05' }
];

const INITIAL_RESULTS = [
  { id: 1, studentId: 1, exam: 'Mid-Term 2024', marks: 85, grade: 'A', date: '2024-09-30' }
];

const INITIAL_CERTIFICATES = [
  { id: 1, studentId: 1, title: 'Dance Excellence Award', issueDate: '2024-09-01', url: '#' }
];

const PAYMENT_CONFIG = {
  upiId: 'rajoguna@paytm',
  qrCode: 'https://via.placeholder.com/200?text=UPI+QR+Code',
  bankName: 'State Bank of India',
  accountNumber: '1234567890',
  ifsc: 'SBIN0001234'
};

const RajogunaPWA = () => {
  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  // Data State
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [notices, setNotices] = useState(INITIAL_NOTICES);
  const [materials, setMaterials] = useState(INITIAL_MATERIALS);
  const [results, setResults] = useState(INITIAL_RESULTS);
  const [certificates, setCertificates] = useState(INITIAL_CERTIFICATES);
  const [paymentConfig, setPaymentConfig] = useState(PAYMENT_CONFIG);
  const [paymentProofs, setPaymentProofs] = useState([]);

  // UI State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  
  // Modal States
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  // Form States
  const [studentForm, setStudentForm] = useState({
    name: '', email: '', department: 'Dance', phone: '', totalFees: '', paidFees: '', enrollDate: new Date().toISOString().split('T')[0]
  });
  const [noticeForm, setNoticeForm] = useState({ title: '', content: '', department: 'All' });
  const [materialForm, setMaterialForm] = useState({ title: '', type: 'PDF', department: 'Dance', file: null });
  const [paymentForm, setPaymentForm] = useState({ amount: '', proof: null });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('rajogunaData');
    if (saved) {
      const data = JSON.parse(saved);
      setStudents(data.students || INITIAL_STUDENTS);
      setNotices(data.notices || INITIAL_NOTICES);
      setMaterials(data.materials || INITIAL_MATERIALS);
      setResults(data.results || INITIAL_RESULTS);
      setCertificates(data.certificates || INITIAL_CERTIFICATES);
      setPaymentProofs(data.paymentProofs || []);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem('rajogunaData', JSON.stringify({
        students, notices, materials, results, certificates, paymentProofs
      }));
    }
  }, [students, notices, materials, results, certificates, paymentProofs, isLoggedIn]);

  // Login Handler
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.email === 'admin@rajoguna.com' && loginData.password === 'Admin@123') {
      setUser({ name: 'Admin', email: loginData.email, role: 'admin' });
      setIsLoggedIn(true);
    } else {
      const student = students.find(s => s.email === loginData.email);
      if (student && loginData.password === 'Student@123') {
        setUser({ ...student, role: 'student' });
        setIsLoggedIn(true);
      } else {
        alert('Invalid credentials!');
      }
    }
  };

  // Student CRUD
  const handleAddStudent = () => {
    const newStudent = {
      id: Date.now(),
      ...studentForm,
      attendance: 0,
      status: 'active'
    };
    setStudents([...students, newStudent]);
    setShowStudentModal(false);
    resetStudentForm();
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setStudentForm(student);
    setShowStudentModal(true);
  };

  const handleUpdateStudent = () => {
    setStudents(students.map(s => s.id === editingStudent.id ? { ...s, ...studentForm } : s));
    setShowStudentModal(false);
    setEditingStudent(null);
    resetStudentForm();
  };

  const handleDeleteStudent = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const resetStudentForm = () => {
    setStudentForm({ name: '', email: '', department: 'Dance', phone: '', totalFees: '', paidFees: '', enrollDate: new Date().toISOString().split('T')[0] });
    setEditingStudent(null);
  };

  // Notice CRUD
  const handleAddNotice = () => {
    const newNotice = {
      id: Date.now(),
      ...noticeForm,
      date: new Date().toISOString().split('T')[0]
    };
    setNotices([newNotice, ...notices]);
    setShowNoticeModal(false);
    setNoticeForm({ title: '', content: '', department: 'All' });
  };

  const handleDeleteNotice = (id) => {
    if (window.confirm('Delete this notice?')) {
      setNotices(notices.filter(n => n.id !== id));
    }
  };

  // Material Management
  const handleAddMaterial = () => {
    const newMaterial = {
      id: Date.now(),
      ...materialForm,
      uploadDate: new Date().toISOString().split('T')[0],
      url: materialForm.file ? URL.createObjectURL(materialForm.file) : '#'
    };
    setMaterials([newMaterial, ...materials]);
    setShowMaterialModal(false);
    setMaterialForm({ title: '', type: 'PDF', department: 'Dance', file: null });
  };

  // Payment Handling
  const handleSubmitPayment = () => {
    const newProof = {
      id: Date.now(),
      studentId: user.id,
      amount: paymentForm.amount,
      proof: paymentForm.proof ? URL.createObjectURL(paymentForm.proof) : null,
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    setPaymentProofs([newProof, ...paymentProofs]);
    setShowPaymentModal(false);
    setPaymentForm({ amount: '', proof: null });
    alert('Payment proof submitted! Admin will verify soon.');
  };

  const handleVerifyPayment = (proofId, approved) => {
    const proof = paymentProofs.find(p => p.id === proofId);
    if (approved && proof) {
      const student = students.find(s => s.id === proof.studentId);
      if (student) {
        setStudents(students.map(s => 
          s.id === proof.studentId 
            ? { ...s, paidFees: s.paidFees + parseInt(proof.amount) }
            : s
        ));
      }
    }
    setPaymentProofs(paymentProofs.map(p => 
      p.id === proofId ? { ...p, status: approved ? 'approved' : 'rejected' } : p
    ));
  };

  // Chatbot
  const handleSendMessage = (message) => {
    setChatMessages([...chatMessages, { text: message, sender: 'user', time: new Date().toLocaleTimeString() }]);
    setTimeout(() => {
      const responses = [
        'Hello! How can I help you today?',
        'For fee payment, please go to the Payment section.',
        'You can check your attendance in the Dashboard.',
        'Study materials are available in the Resources section.',
        'For any queries, contact admin@rajoguna.com'
      ];
      const reply = responses[Math.floor(Math.random() * responses.length)];
      setChatMessages(prev => [...prev, { text: reply, sender: 'bot', time: new Date().toLocaleTimeString() }]);
    }, 1000);
  };

  // Stats Calculation
  const totalStudents = students.length;
  const totalDues = students.reduce((sum, s) => sum + (s.totalFees - s.paidFees), 0);
  const totalCollection = students.reduce((sum, s) => sum + s.paidFees, 0);
  const avgAttendance = (students.reduce((sum, s) => sum + s.attendance, 0) / totalStudents).toFixed(1);

  // Filtered Data
  const filteredStudents = students.filter(s => 
    (filterDept === 'All' || s.department === filterDept) &&
    (s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredNotices = notices.filter(n => 
    user?.role === 'admin' || n.department === 'All' || n.department === user?.department
  );

  const filteredMaterials = materials.filter(m => 
    user?.role === 'admin' || m.department === user?.department
  );

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full mx-auto flex items-center justify-center">
              <Award className="text-white" size={40} />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">RAJOGUNA</h1>
            <p className="text-gray-600">KALA KENDRA</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                placeholder="Email"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition"
            >
              Login
            </button>
          </form>
          <div className="text-center text-sm text-gray-500 space-y-1">
            <p>Demo Admin: admin@rajoguna.com / Admin@123</p>
            <p>Demo Student: priya@example.com / Student@123</p>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  if (user.role === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Award size={32} />
              <div>
                <h1 className="text-xl font-bold">RAJOGUNA KALA KENDRA</h1>
                <p className="text-sm opacity-90">Admin Portal</p>
              </div>
            </div>
            <button onClick={() => { setIsLoggedIn(false); setUser(null); }} className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex space-x-1 overflow-x-auto">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: Award },
                { id: 'students', label: 'Students', icon: Users },
                { id: 'payments', label: 'Payments', icon: DollarSign },
                { id: 'materials', label: 'Materials', icon: BookOpen },
                { id: 'notices', label: 'Notices', icon: Bell },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition ${
                    activeTab === tab.id ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-600 hover:text-purple-600'
                  }`}
                >
                  <tab.icon size={18} />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Content */}
        <main className="max-w-7xl mx-auto p-4 space-y-6">
          {activeTab === 'dashboard' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
                  <Users size={32} className="mb-2 opacity-80" />
                  <h3 className="text-3xl font-bold">{totalStudents}</h3>
                  <p className="opacity-90">Total Students</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
                  <DollarSign size={32} className="mb-2 opacity-80" />
                  <h3 className="text-3xl font-bold">₹{totalCollection}</h3>
                  <p className="opacity-90">Total Collection</p>
                </div>
                <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-2xl shadow-lg">
                  <AlertCircle size={32} className="mb-2 opacity-80" />
                  <h3 className="text-3xl font-bold">₹{totalDues}</h3>
                  <p className="opacity-90">Total Dues</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
                  <Calendar size={32} className="mb-2 opacity-80" />
                  <h3 className="text-3xl font-bold">{avgAttendance}%</h3>
                  <p className="opacity-90">Avg Attendance</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-md">
                  <h3 className="text-xl font-bold mb-4 flex items-center"><AlertCircle className="mr-2 text-red-500" />Pending Payments</h3>
                  <div className="space-y-3">
                    {paymentProofs.filter(p => p.status === 'pending').slice(0, 5).map(proof => {
                      const student = students.find(s => s.id === proof.studentId);
                      return (
                        <div key={proof.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-semibold">{student?.name}</p>
                            <p className="text-sm text-gray-600">₹{proof.amount} - {proof.date}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button onClick={() => handleVerifyPayment(proof.id, true)} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                              <CheckCircle size={18} />
                            </button>
                            <button onClick={() => handleVerifyPayment(proof.id, false)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                              <X size={18} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-md">
                  <h3 className="text-xl font-bold mb-4 flex items-center"><Bell className="mr-2 text-blue-500" />Recent Notices</h3>
                  <div className="space-y-3">
                    {notices.slice(0, 5).map(notice => (
                      <div key={notice.id} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-semibold">{notice.title}</p>
                        <p className="text-sm text-gray-600">{notice.department} - {notice.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'students' && (
            <>
              <div className="bg-white p-6 rounded-2xl shadow-md">
                <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Student Management</h2>
                  <button onClick={() => { setShowStudentModal(true); resetStudentForm(); }} className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                    <Plus size={20} />
                    <span>Add Student</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search students..."
                      className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <select
                    className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    value={filterDept}
                    onChange={(e) => setFilterDept(e.target.value)}
                  >
                    <option value="All">All Departments</option>
                    <option value="Dance">Dance</option>
                    <option value="Music">Music</option>
                    <option value="Drama">Drama</option>
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-left">Department</th>
                        <th className="px-4 py-3 text-left">Contact</th>
                        <th className="px-4 py-3 text-left">Attendance</th>
                        <th className="px-4 py-3 text-left">Fees</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map(student => (
                        <tr key={student.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <p className="font-semibold">{student.name}</p>
                            <p className="text-sm text-gray-600">{student.email}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">{student.department}</span>
                          </td>
                          <td className="px-4 py-3 text-sm">{student.phone}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${student.attendance}%` }}></div>
                              </div>
                              <span className="text-sm font-semibold">{student.attendance}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm">Paid: ₹{student.paidFees}</p>
                            <p className="text-sm text-red-600">Due: ₹{student.totalFees - student.paidFees}</p>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex space-x-2">
                              <button onClick={() => handleEditStudent(student)} className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                <Edit size={16} />
                              </button>
                              <button onClick={() => handleDeleteStudent(student.id)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'payments' && (
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h2 className="text-2xl font-bold mb-6">Payment Verification</h2>
              <div className="space-y-4">
                {paymentProofs.map(proof => {
                  const student = students.find(s => s.id === proof.studentId);
                  return (
                    <div key={proof.id} className={`p-4 rounded-lg border-2 ${proof.status === 'pending' ? 'border-yellow-300 bg-yellow-50' : proof.status === 'approved' ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-bold text-lg">{student?.name}</p>
                          <p className="text-gray-600">{student?.email} - {student?.department}</p>
                          <p className="text-sm mt-2">Amount: <span className="font-bold text-green-600">₹{proof.amount}</span></p>
                          <p className="text-sm">Date: {proof.date}</p>
                          <p className="text-sm">Status: <span className={`font-semibold ${proof.status === 'approved' ? 'text-green-600' : proof.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>{proof.status.toUpperCase()}</span></p>
                        </div>
                        {proof.proof && (
                          <div className="ml-4">
                            <img src={proof.proof} alt="Payment Proof" className="w-32 h-32 object-cover rounded-lg border-2" />
                          </div>
                        )}
                        {proof.status === 'pending' && (
                          <div className="flex flex-col space-y-2 ml-4">
                            <button onClick={() => handleVerifyPayment(proof.id, true)} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center space-x-2">
                              <CheckCircle size={18} />
                              <span>Approve</span>
                            </button>
                            <button onClick={() => handleVerifyPayment(proof.id, false)} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center space-x-2">
                              <X size={18} />
                              <span>Reject</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'materials' && (
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Study Materials</h2>
                <button onClick={() => setShowMaterialModal(true)} className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                  <Plus size={20} />
                  <span>Upload Material</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {materials.map(material => (
                  <div key={material.id} className="p-4 border-2 rounded-lg hover:border-purple-500 transition">
                    <div className="flex items-start justify-between mb-3">
                      <BookOpen className="text-purple-600" size={32} />
                      <span className="px-2 py-1 bg-gray-100 text-xs rounded">{material.type}</span>
                    </div>
                    <h3 className="font-bold mb-2">{material.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{material.department}</p>
                    <p className="text-xs text-gray-500 mb-3">Uploaded: {material.uploadDate}</p>
                    <button className="w-full py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 flex items-center justify-center space-x-2">
                      <Download size={16} />
                      <span>Download</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notices' && (
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Notices & Announcements</h2>
                <button onClick={() => setShowNoticeModal(true)} className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                  <Plus size={20} />
                  <span>Post Notice</span>
                </button>
              </div>
              <div className="space-y-4">
                {notices.map(notice => (
                  <div key={notice.id} className="p-4 border-2 rounded-lg hover:border-purple-500 transition">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Bell className="text-purple-600" size={24} />
                          <h3 className="font-bold text-lg">{notice.title}</h3>
                        </div>
                        <p className="text-gray-700 mb-3">{notice.content}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">{notice.department}</span>
                          <span>{notice.date}</span>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteNotice(notice.id)} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h2 className="text-2xl font-bold mb-6">Payment Settings</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">UPI ID</label>
                    <input
                      type="text"
                      value={paymentConfig.upiId}
                      onChange={(e) => setPaymentConfig({ ...paymentConfig, upiId: e.target.value })}
                      className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Bank Name</label>
                    <input
                      type="text"
                      value={paymentConfig.bankName}
                      onChange={(e) => setPaymentConfig({ ...paymentConfig, bankName: e.target.value })}
                      className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Account Number</label>
                    <input
                      type="text"
                      value={paymentConfig.accountNumber}
                      onChange={(e) => setPaymentConfig({ ...paymentConfig, accountNumber: e.target.value })}
                      className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">IFSC Code</label>
                    <input
                      type="text"
                      value={paymentConfig.ifsc}
                      onChange={(e) => setPaymentConfig({ ...paymentConfig, ifsc: e.target.value })}
                      className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
                <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold">
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Modals */}
        {showStudentModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{editingStudent ? 'Edit Student' : 'Add New Student'}</h3>
                <button onClick={() => { setShowStudentModal(false); resetStudentForm(); }} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Full Name</label>
                  <input
                    type="text"
                    value={studentForm.name}
                    onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                    className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                    className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Phone</label>
                  <input
                    type="tel"
                    value={studentForm.phone}
                    onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                    className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Department</label>
                  <select
                    value={studentForm.department}
                    onChange={(e) => setStudentForm({ ...studentForm, department: e.target.value })}
                    className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500 focus:outline-none"
                  >
                    <option value="Dance">Dance</option>
                    <option value="Music">Music</option>
                    <option value="Drama">Drama</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Total Fees</label>
                  <input
                    type="number"
                    value={studentForm.totalFees}
                    onChange={(e) => setStudentForm({ ...studentForm, totalFees: e.target.value })}
                    className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Paid Fees</label>
                  <input
                    type="number"
                    value={studentForm.paidFees}
                    onChange={(e) => setStudentForm({ ...studentForm, paidFees: e.target.value })}
                    className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500 focus:outline-none"
                    required
                  />
                </div>
                {editingStudent && (
                  <div>
                    <label className="block text-sm font-semibold mb-2">Attendance %</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={studentForm.attendance}
                      onChange={(e) => setStudentForm({ ...studentForm, attendance: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                )}
                <button
                  onClick={editingStudent ? handleUpdateStudent : handleAddStudent}
                  className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
                >
                  {editingStudent ? 'Update Student' : 'Add Student'}
                </button>
              </div>
            </div>
          </div>
        )}

        {showNoticeModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Post New Notice</h3>
                <button onClick={() => setShowNoticeModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Title</label>
                  <input
                    type="text"
                    value={noticeForm.title}
                    onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                    className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Content</label>
                  <textarea
                    value={noticeForm.content}
                    onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                    className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500 focus:outline-none h-32"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Target Department</label>
                  <select
                    value={noticeForm.department}
                    onChange={(e) => setNoticeForm({ ...noticeForm, department: e.target.value })}
                    className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500 focus:outline-none"
                  >
                    <option value="All">All Departments</option>
                    <option value="Dance">Dance</option>
                    <option value="Music">Music</option>
                    <option value="Drama">Drama</option>
                  </select>
                </div>
                <button
                  onClick={handleAddNotice}
                  className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
                >
                  Post Notice
                </button>
              </div>
            </div>
          </div>
        )}

        {showMaterialModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Upload Study Material</h3>
                <button onClick={() => setShowMaterialModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Title</label>
                  <input
                    type="text"
                    value={materialForm.title}
                    onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                    className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Type</label>
                  <select
                    value={materialForm.type}
                    onChange={(e) => setMaterialForm({ ...materialForm, type: e.target.value })}
                    className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500 focus:outline-none"
                  >
                    <option value="PDF">PDF</option>
                    <option value="Video">Video</option>
                    <option value="Audio">Audio</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Department</label>
                  <select
                    value={materialForm.department}
                    onChange={(e) => setMaterialForm({ ...materialForm, department: e.target.value })}
                    className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500 focus:outline-none"
                  >
                    <option value="Dance">Dance</option>
                    <option value="Music">Music</option>
                    <option value="Drama">Drama</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Upload File</label>
                  <input
                    type="file"
                    onChange={(e) => setMaterialForm({ ...materialForm, file: e.target.files[0] })}
                    className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500 focus:outline-none"
                    accept=".pdf,.mp4,.mp3"
                  />
                </div>
                <button
                  onClick={handleAddMaterial}
                  className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
                >
                  Upload Material
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Student Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Award size={32} />
            <div>
              <h1 className="text-xl font-bold">RAJOGUNA KALA KENDRA</h1>
              <p className="text-sm opacity-90">Student Portal</p>
            </div>
          </div>
          <button onClick={() => { setIsLoggedIn(false); setUser(null); }} className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Award },
              { id: 'attendance', label: 'Attendance', icon: Calendar },
              { id: 'fees', label: 'Fees', icon: DollarSign },
              { id: 'materials', label: 'Materials', icon: BookOpen },
              { id: 'notices', label: 'Notices', icon: Bell }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition ${
                  activeTab === tab.id ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-600 hover:text-purple-600'
                }`}
              >
                <tab.icon size={18} />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto p-4 space-y-6">
        {activeTab === 'dashboard' && (
          <>
            <div className="bg-gradient-to-br from-purple-600 to-pink-500 text-white p-6 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold mb-2">Welcome, {user.name}!</h2>
              <p className="opacity-90">{user.department} Department</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-md">
                <Calendar className="text-purple-600 mb-2" size={32} />
                <h3 className="text-3xl font-bold">{user.attendance}%</h3>
                <p className="text-gray-600">Attendance</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-md">
                <DollarSign className="text-green-600 mb-2" size={32} />
                <h3 className="text-3xl font-bold">₹{user.paidFees}</h3>
                <p className="text-gray-600">Fees Paid</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-md">
                <AlertCircle className="text-red-600 mb-2" size={32} />
                <h3 className="text-3xl font-bold">₹{user.totalFees - user.paidFees}</h3>
                <p className="text-gray-600">Fees Due</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h3 className="text-xl font-bold mb-4 flex items-center"><Bell className="mr-2 text-blue-500" />Recent Notices</h3>
              <div className="space-y-3">
                {filteredNotices.slice(0, 3).map(notice => (
                  <div key={notice.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-semibold">{notice.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{notice.content}</p>
                    <p className="text-xs text-gray-500 mt-2">{notice.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'attendance' && (
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-6">Attendance Record</h2>
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
                    strokeDasharray={`${(user.attendance / 100) * 502.4} 502.4`}
                    strokeLinecap="round"
                    transform="rotate(-90 96 96)"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-4xl font-bold text-purple-600">{user.attendance}%</p>
                  <p className="text-gray-600">Present</p>
                </div>
              </div>
              <p className="mt-6 text-gray-600">Your attendance is {user.attendance >= 75 ? 'excellent' : 'needs improvement'}!</p>
            </div>
          </div>
        )}

        {activeTab === 'fees' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h2 className="text-2xl font-bold mb-6">Fee Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-semibold">Total Fees</span>
                  <span className="text-xl font-bold">₹{user.totalFees}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <span className="font-semibold">Paid</span>
                  <span className="text-xl font-bold text-green-600">₹{user.paidFees}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                  <span className="font-semibold">Due</span>
                  <span className="text-xl font-bold text-red-600">₹{user.totalFees - user.paidFees}</span>
                </div>
              </div>
              {user.totalFees > user.paidFees && (
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full mt-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold flex items-center justify-center space-x-2"
                >
                  <Upload size={20} />
                  <span>Pay Now</span>
                </button>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h3 className="text-xl font-bold mb-4">Payment Information</h3>
              <div className="space-y-3 text-sm">
                <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
                <p className="font-semibold mb-1">Payment Instructions:</p>
                <p>1. Pay via UPI: {paymentConfig.upiId}</p>
                <p>2. Take screenshot of transaction</p>
                <p>3. Upload screenshot here</p>
                <p>4. Admin will verify within 24 hours</p>
              </div>
              <button
                onClick={handleSubmitPayment}
                className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
              >
                Submit Payment Proof
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chatbot */}
      <button
        onClick={() => setShowChatbot(!showChatbot)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition flex items-center justify-center z-40"
      >
        {showChatbot ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {showChatbot && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl z-40">
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-4 rounded-t-2xl flex items-center space-x-3">
            <Sparkles size={24} />
            <div>
              <h3 className="font-bold">AI Assistant</h3>
              <p className="text-xs opacity-90">How can I help you?</p>
            </div>
          </div>
          <div className="h-80 overflow-y-auto p-4 space-y-3">
            {chatMessages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <MessageCircle size={48} className="mx-auto mb-3 opacity-50" />
                <p>Start a conversation!</p>
              </div>
            ) : (
              chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-3 rounded-lg ${msg.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t">
            <form onSubmit={(e) => { e.preventDefault(); const msg = e.target.message.value; if (msg.trim()) { handleSendMessage(msg); e.target.message.value = ''; } }}>
              <input
                type="text"
                name="message"
                placeholder="Type your message..."
                className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500 focus:outline-none"
              />
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RajogunaPWA;3 bg-gray-50 rounded-lg">
                  <p className="font-semibold">UPI ID</p>
                  <p className="text-purple-600">{paymentConfig.upiId}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-semibold">Bank Details</p>
                  <p>{paymentConfig.bankName}</p>
                  <p>A/C: {paymentConfig.accountNumber}</p>
                  <p>IFSC: {paymentConfig.ifsc}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-6">Study Materials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMaterials.map(material => (
                <div key={material.id} className="p-4 border-2 rounded-lg hover:border-purple-500 transition">
                  <div className="flex items-start justify-between mb-3">
                    <BookOpen className="text-purple-600" size={32} />
                    <span className="px-2 py-1 bg-gray-100 text-xs rounded">{material.type}</span>
                  </div>
                  <h3 className="font-bold mb-2">{material.title}</h3>
                  <p className="text-xs text-gray-500 mb-3">Uploaded: {material.uploadDate}</p>
                  <button className="w-full py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 flex items-center justify-center space-x-2">
                    <Download size={16} />
                    <span>Download</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'notices' && (
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-6">Notices & Announcements</h2>
            <div className="space-y-4">
              {filteredNotices.map(notice => (
                <div key={notice.id} className="p-4 border-2 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <Bell className="text-purple-600" size={24} />
                    <h3 className="font-bold text-lg">{notice.title}</h3>
                  </div>
                  <p className="text-gray-700 mb-3">{notice.content}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">{notice.department}</span>
                    <span>{notice.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Submit Payment</h3>
              <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Amount</label>
                <input
                  type="number"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                  className="w-full px-4 py-2 border-2 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="Enter amount"
                  required
                />
              </div>
              <div>return (
    <>
      {currentScreen === 'login' && <LoginScreen />}
      {currentScreen === 'student-dashboard' && <StudentDashboard />}
      {currentScreen === 'admin-dashboard' && <AdminDashboard />}
    </>
  );
};

export default RajogunaPWA;
