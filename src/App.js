import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, Phone, LogOut, Menu, X, Home, Calendar, BookOpen, FileText, DollarSign, MessageCircle, Award, Bell, Users, Settings, Eye, EyeOff, Music, Sparkles } from 'lucide-react';

// Mock Database (In production, connect to Firebase)
const MOCK_USERS = {
  'admin@rajoguna.com': {
    password: 'Admin@123',
    role: 'admin',
    name: 'Admin User',
    phone: '9876543210'
  },
  'student1@example.com': {
    password: 'Student@123',
    role: 'student',
    name: 'Priya Sharma',
    phone: '9876543211',
    department: 'Dance',
    attendance: 85,
    totalFees: 50000,
    paidFees: 30000,
    dueDate: '2025-10-25'
  },
  'student2@example.com': {
    password: 'Student@123',
    role: 'student',
    name: 'Rahul Verma',
    phone: '9876543212',
    department: 'Music',
    attendance: 92,
    totalFees: 45000,
    paidFees: 45000,
    dueDate: null
  }
};

const MOCK_NOTICES = [
  { id: 1, title: 'Annual Function 2025', date: '2025-10-15', content: 'Annual function will be held on December 20th, 2025', dept: 'all' },
  { id: 2, title: 'Dance Workshop', date: '2025-10-12', content: 'Special Kathak workshop by renowned artist', dept: 'Dance' },
  { id: 3, title: 'Music Competition', date: '2025-10-10', content: 'Inter-institute music competition registration open', dept: 'Music' }
];

const MOCK_CALENDAR = [
  { id: 1, title: 'Diwali Break', date: '2025-11-01', type: 'holiday' },
  { id: 2, title: 'Dance Exam', date: '2025-11-15', type: 'exam', dept: 'Dance' },
  { id: 3, title: 'Music Recital', date: '2025-11-20', type: 'event', dept: 'Music' }
];

const MOCK_RESOURCES = [
  { id: 1, title: 'Classical Dance Basics - PDF', type: 'pdf', dept: 'Dance', url: '#' },
  { id: 2, title: 'Raag Theory - Video', type: 'video', dept: 'Music', url: '#' },
  { id: 3, title: 'Tabla Practice Sessions', type: 'audio', dept: 'Music', url: '#' }
];

const RajogunaPWA = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('login');
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hello! I\'m your assistant. How can I help you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Admin States
  const [students, setStudents] = useState([
    { email: 'student1@example.com', name: 'Priya Sharma', dept: 'Dance', phone: '9876543211' },
    { email: 'student2@example.com', name: 'Rahul Verma', dept: 'Music', phone: '9876543212' }
  ]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    
    const user = MOCK_USERS[loginEmail];
    if (user && user.password === loginPassword) {
      setCurrentUser({ ...user, email: loginEmail });
      setCurrentScreen(user.role === 'admin' ? 'admin-dashboard' : 'student-dashboard');
    } else {
      setLoginError('Invalid email or password');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentScreen('login');
    setMenuOpen(false);
  };

  const handleChatSend = () => {
    if (chatInput.trim()) {
      setChatMessages([...chatMessages, { sender: 'user', text: chatInput }]);
      
      // Simple bot responses
      setTimeout(() => {
        let botResponse = 'I understand your query. Let me help you with that.';
        if (chatInput.toLowerCase().includes('fee')) {
          botResponse = 'You can check your fee status in the Payments section. For payment issues, please contact admin.';
        } else if (chatInput.toLowerCase().includes('attendance')) {
          botResponse = 'Your attendance is visible in the Attendance section of your dashboard.';
        } else if (chatInput.toLowerCase().includes('certificate')) {
          botResponse = 'Certificates are available in the Certificates section once issued by admin.';
        }
        setChatMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
      }, 1000);
      
      setChatInput('');
    }
  };

  // Login Screen
  const LoginScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl mb-4">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">RAJOGUNA KALA KENDRA</h1>
          <p className="text-gray-600">Dance & Music Institute</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {loginError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-600 transition-all shadow-lg"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 font-semibold mb-2">Demo Credentials:</p>
          <div className="text-xs text-gray-700 space-y-1">
            <p><strong>Admin:</strong> admin@rajoguna.com / Admin@123</p>
            <p><strong>Student:</strong> student1@example.com / Student@123</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Student Dashboard
  const StudentDashboard = () => {
    const userData = currentUser;
    const dueAmount = userData.totalFees - userData.paidFees;

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-4 sticky top-0 z-40 shadow-lg">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden">
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <h1 className="text-xl font-bold">RAJOGUNA</h1>
            </div>
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform" />
              <button onClick={handleLogout} className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg hover:bg-white/30 transition-all">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto p-4">
          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white mb-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-2">Welcome back, {userData.name}! 👋</h2>
            <p className="opacity-90">Department: {userData.department}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Attendance</span>
                <Calendar className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-gray-800">{userData.attendance}%</p>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Total Fees</span>
                <DollarSign className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-gray-800">₹{userData.totalFees.toLocaleString()}</p>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-yellow-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Paid</span>
                <DollarSign className="w-5 h-5 text-yellow-500" />
              </div>
              <p className="text-3xl font-bold text-gray-800">₹{userData.paidFees.toLocaleString()}</p>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-red-500">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Due Amount</span>
                <DollarSign className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-3xl font-bold text-red-600">₹{dueAmount.toLocaleString()}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { icon: Calendar, label: 'Attendance', color: 'purple' },
              { icon: DollarSign, label: 'Pay Fees', color: 'pink' },
              { icon: BookOpen, label: 'Resources', color: 'orange' },
              { icon: Award, label: 'Certificates', color: 'blue' }
            ].map((action, idx) => (
              <button
                key={idx}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all hover:scale-105 flex flex-col items-center gap-2"
              >
                <action.icon className={`w-8 h-8 text-${action.color}-500`} />
                <span className="text-sm font-semibold text-gray-700">{action.label}</span>
              </button>
            ))}
          </div>

          {/* Notices */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Bell className="w-6 h-6 text-purple-600" />
              Recent Notices
            </h3>
            <div className="space-y-3">
              {MOCK_NOTICES.filter(n => n.dept === 'all' || n.dept === userData.department).map(notice => (
                <div key={notice.id} className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <h4 className="font-semibold text-gray-800">{notice.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{notice.content}</p>
                  <p className="text-xs text-gray-500 mt-2">{notice.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Section */}
          {dueAmount > 0 && (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl shadow-md p-6 border-2 border-red-200">
              <h3 className="text-xl font-bold text-red-700 mb-4 flex items-center gap-2">
                <DollarSign className="w-6 h-6" />
                Fee Payment Required
              </h3>
              <p className="text-gray-700 mb-4">Amount Due: <strong className="text-2xl text-red-600">₹{dueAmount.toLocaleString()}</strong></p>
              <p className="text-sm text-gray-600 mb-4">Due Date: {userData.dueDate}</p>
              
              <div className="bg-white rounded-lg p-4 mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Pay via UPI:</p>
                <p className="text-lg font-mono text-purple-600 mb-3">rajoguna@paytm</p>
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <p className="text-xs text-gray-500 mb-2">Scan QR Code</p>
                  <div className="w-32 h-32 bg-white mx-auto rounded-lg flex items-center justify-center border-2 border-gray-300">
                    <p className="text-xs text-gray-400">QR Code</p>
                  </div>
                </div>
              </div>
              
              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-600 transition-all">
                Upload Payment Proof
              </button>
            </div>
          )}
        </div>

        {/* Chatbot */}
        <ChatbotWidget />
      </div>
    );
  };

  // Admin Dashboard
  const AdminDashboard = () => (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-4 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6" />
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg hover:bg-white/30 transition-all">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Students', value: students.length, icon: Users, color: 'blue' },
            { label: 'Dance Students', value: students.filter(s => s.dept === 'Dance').length, icon: Music, color: 'pink' },
            { label: 'Music Students', value: students.filter(s => s.dept === 'Music').length, icon: Music, color: 'purple' },
            { label: 'Pending Payments', value: '₹20,000', icon: DollarSign, color: 'orange' }
          ].map((stat, idx) => (
            <div key={idx} className={`bg-white rounded-xl p-5 shadow-md border-l-4 border-${stat.color}-500`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">{stat.label}</span>
                <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
              </div>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { icon: Users, label: 'Manage Students', color: 'purple' },
            { icon: Calendar, label: 'Attendance', color: 'blue' },
            { icon: DollarSign, label: 'Payments', color: 'green' },
            { icon: Bell, label: 'Post Notice', color: 'orange' }
          ].map((action, idx) => (
            <button
              key={idx}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all hover:scale-105 flex flex-col items-center gap-2"
            >
              <action.icon className={`w-8 h-8 text-${action.color}-500`} />
              <span className="text-sm font-semibold text-gray-700">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Student List */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-600" />
            Student Management
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Department</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Phone</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">{student.name}</td>
                    <td className="py-3 px-4 text-sm">{student.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${student.dept === 'Dance' ? 'bg-pink-100 text-pink-700' : 'bg-purple-100 text-purple-700'}`}>
                        {student.dept}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">{student.phone}</td>
                    <td className="py-3 px-4">
                      <button className="text-purple-600 hover:text-purple-800 text-sm font-semibold">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  // Chatbot Widget
  const ChatbotWidget = () => (
    <>
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-pink-500 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-all z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {chatOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl z-50 flex flex-col" style={{ height: '500px' }}>
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <h3 className="font-bold">User Support</h3>
            <button onClick={() => setChatOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${msg.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              />
              <button
                onClick={handleChatSend}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // Render current screen
  return (
    <>
      {currentScreen === 'login' && <LoginScreen />}
      {currentScreen === 'student-dashboard' && <StudentDashboard />}
      {currentScreen === 'admin-dashboard' && <AdminDashboard />}
    </>
  );
};

export default RajogunaPWA;
