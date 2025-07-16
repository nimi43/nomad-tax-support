import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Shield, 
  Send, 
  LogOut, 
  Users, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Settings
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "admin";
  timestamp: Date;
  status?: "sent" | "delivered" | "read";
}

interface User {
  id: string;
  email: string;
  name: string;
  country: string;
  activeRequests: number;
  lastActive: Date;
}

interface Request {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  createdAt: Date;
  messages: Message[];
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const userType = localStorage.getItem("userType");
    if (userType !== "admin") {
      navigate("/");
    }

    // Load mock data
    const mockUsers: User[] = [
      {
        id: "1",
        email: "john.doe@email.com",
        name: "John Doe",
        country: "USA → India",
        activeRequests: 2,
        lastActive: new Date(Date.now() - 3600000)
      },
      {
        id: "2",
        email: "maria.garcia@email.com", 
        name: "Maria Garcia",
        country: "Canada → Mexico",
        activeRequests: 1,
        lastActive: new Date(Date.now() - 7200000)
      },
      {
        id: "3",
        email: "ahmed.hassan@email.com",
        name: "Ahmed Hassan", 
        country: "UK → Egypt",
        activeRequests: 0,
        lastActive: new Date(Date.now() - 86400000)
      }
    ];

    const mockRequests: Request[] = [
      {
        id: "1",
        userId: "1",
        title: "Tax Payment Assistance",
        description: "Need help with home country tax payment for my family",
        status: "in-progress",
        priority: "high",
        createdAt: new Date(Date.now() - 86400000),
        messages: [
          {
            id: "1",
            text: "Hello! I need help with tax payment for my family back home. The deadline is approaching.",
            sender: "user",
            timestamp: new Date(Date.now() - 86400000),
            status: "read"
          },
          {
            id: "2",
            text: "Hi! I understand you need assistance with tax payments. I'll help you with the process. Can you provide more details about the tax type and amount?",
            sender: "admin",
            timestamp: new Date(Date.now() - 82800000),
            status: "read"
          },
          {
            id: "3",
            text: "It's property tax for my parents' house. The amount is $2,500 and due next week.",
            sender: "user",
            timestamp: new Date(Date.now() - 82400000),
            status: "read"
          }
        ]
      },
      {
        id: "2",
        userId: "1",
        title: "Medical Bill Payment",
        description: "Emergency medical payment needed for my mother",
        status: "completed",
        priority: "high",
        createdAt: new Date(Date.now() - 172800000),
        messages: [
          {
            id: "4",
            text: "My mother had an emergency surgery. I need to send money urgently for medical bills.",
            sender: "user",
            timestamp: new Date(Date.now() - 172800000),
            status: "read"
          },
          {
            id: "5",
            text: "I've processed the medical payment. The transaction has been completed successfully.",
            sender: "admin",
            timestamp: new Date(Date.now() - 169200000),
            status: "read"
          }
        ]
      },
      {
        id: "3", 
        userId: "2",
        title: "University Fee Payment",
        description: "Need to pay university fees for my sister",
        status: "pending",
        priority: "medium",
        createdAt: new Date(Date.now() - 43200000),
        messages: [
          {
            id: "6",
            text: "Hi, I need to pay university fees for my sister. The amount is $3,000 and the deadline is in 2 days.",
            sender: "user",
            timestamp: new Date(Date.now() - 43200000),
            status: "delivered"
          }
        ]
      }
    ];

    setUsers(mockUsers);
    setRequests(mockRequests);
    if (mockRequests.length > 0) {
      setActiveRequestId(mockRequests[0].id);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userType");
    navigate("/");
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeRequestId) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "admin",
      timestamp: new Date(),
      status: "sent"
    };

    setRequests(prev => prev.map(req => 
      req.id === activeRequestId 
        ? { ...req, messages: [...req.messages, newMsg] }
        : req
    ));
    setNewMessage("");
  };

  const handleStatusChange = (requestId: string, newStatus: "pending" | "in-progress" | "completed") => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: newStatus } : req
    ));
  };

  const filteredRequests = requests.filter(req => 
    statusFilter === "all" || req.status === statusFilter
  );

  const activeRequest = requests.find(req => req.id === activeRequestId);
  const requestUser = activeRequest ? users.find(user => user.id === activeRequest.userId) : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-warning text-yellow-800";
      case "in-progress": return "bg-info text-blue-800";
      case "completed": return "bg-success text-green-800";
      default: return "bg-muted";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive text-destructive-foreground";
      case "medium": return "bg-warning text-yellow-800";
      case "low": return "bg-muted text-muted-foreground";
      default: return "bg-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-3 h-3" />;
      case "in-progress": return <AlertCircle className="w-3 h-3" />;
      case "completed": return <CheckCircle className="w-3 h-3" />;
      default: return null;
    }
  };

  const stats = {
    totalRequests: requests.length,
    pendingRequests: requests.filter(r => r.status === "pending").length,
    inProgressRequests: requests.filter(r => r.status === "in-progress").length,
    completedRequests: requests.filter(r => r.status === "completed").length,
    activeUsers: users.filter(u => u.activeRequests > 0).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-card border-b shadow-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-slate-800 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Work Buddy Admin</h1>
              <p className="text-sm text-muted-foreground">Administrative Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                  <p className="text-2xl font-bold">{stats.totalRequests}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-warning">{stats.pendingRequests}</p>
                </div>
                <Clock className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold text-info">{stats.inProgressRequests}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-info" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-success">{stats.completedRequests}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold text-primary">{stats.activeUsers}</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
          {/* Requests Sidebar */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Support Requests</CardTitle>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <CardDescription>Manage user support requests</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-350px)]">
                <div className="space-y-2 p-4 pt-2">
                  {filteredRequests.map((request) => {
                    const user = users.find(u => u.id === request.userId);
                    return (
                      <div
                        key={request.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          activeRequestId === request.id 
                            ? "bg-primary/10 border-primary" 
                            : "bg-card hover:bg-muted/50"
                        }`}
                        onClick={() => setActiveRequestId(request.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{request.title}</h4>
                          <div className="flex gap-1">
                            <Badge className={getPriorityColor(request.priority)}>
                              {request.priority}
                            </Badge>
                            <Badge className={getStatusColor(request.status)}>
                              {getStatusIcon(request.status)}
                              {request.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {request.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{user?.email}</span>
                          <span>{request.createdAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Interface */}
          <Card className="lg:col-span-2 flex flex-col">
            <CardHeader className="pb-3">
              {activeRequest && requestUser ? (
                <div>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {activeRequest.title}
                      <Badge className={getStatusColor(activeRequest.status)}>
                        {getStatusIcon(activeRequest.status)}
                        {activeRequest.status}
                      </Badge>
                    </CardTitle>
                    <Select
                      value={activeRequest.status}
                      onValueChange={(value: "pending" | "in-progress" | "completed") => 
                        handleStatusChange(activeRequest.id, value)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <CardDescription>
                    Chatting with {requestUser.name} ({requestUser.email}) • {requestUser.country}
                  </CardDescription>
                </div>
              ) : (
                <CardTitle>Select a request to start chatting</CardTitle>
              )}
            </CardHeader>
            
            {activeRequest && (
              <>
                <CardContent className="flex-1 p-0">
                  <ScrollArea className="h-[calc(100vh-400px)] p-4">
                    <div className="space-y-4">
                      {activeRequest.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === "admin" ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`flex items-start gap-2 max-w-[70%]`}>
                            {message.sender === "user" && (
                              <Avatar className="w-6 h-6 mt-1">
                                <AvatarFallback className="text-xs bg-primary">U</AvatarFallback>
                              </Avatar>
                            )}
                            <div
                              className={`p-3 rounded-lg ${
                                message.sender === "admin"
                                  ? "bg-secondary text-secondary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              <p className="text-sm">{message.text}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <p className="text-xs opacity-70">
                                  {message.timestamp.toLocaleTimeString()}
                                </p>
                                {message.status && (
                                  <div className="text-xs opacity-70">
                                    {message.status === "sent" && "✓"}
                                    {message.status === "delivered" && "✓✓"}
                                    {message.status === "read" && "✓✓"}
                                  </div>
                                )}
                              </div>
                            </div>
                            {message.sender === "admin" && (
                              <Avatar className="w-6 h-6 mt-1">
                                <AvatarFallback className="text-xs bg-secondary">A</AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
                
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your response..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} size="sm" variant="secondary">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;