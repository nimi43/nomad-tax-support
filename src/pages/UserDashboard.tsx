import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, LogOut, Clock, CheckCircle, AlertCircle, User } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "admin";
  timestamp: Date;
  status?: "sent" | "delivered" | "read";
}

interface Request {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  createdAt: Date;
  messages: Message[];
}

const UserDashboard = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [newRequestTitle, setNewRequestTitle] = useState("");
  const [newRequestDescription, setNewRequestDescription] = useState("");
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userType = localStorage.getItem("userType");
    if (userType !== "user") {
      navigate("/");
    }

    // Load mock data
    const mockRequests: Request[] = [
      {
        id: "1",
        title: "Tax Payment Assistance",
        description: "Need help with home country tax payment for my family",
        status: "in-progress",
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
        title: "Medical Bill Payment",
        description: "Emergency medical payment needed for my mother",
        status: "completed",
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
      }
    ];
    setRequests(mockRequests);
    if (mockRequests.length > 0) {
      setActiveRequestId(mockRequests[0].id);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeRequestId) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user",
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

  const handleCreateRequest = () => {
    if (!newRequestTitle.trim() || !newRequestDescription.trim()) return;

    const newRequest: Request = {
      id: Date.now().toString(),
      title: newRequestTitle,
      description: newRequestDescription,
      status: "pending",
      createdAt: new Date(),
      messages: [
        {
          id: Date.now().toString(),
          text: newRequestDescription,
          sender: "user",
          timestamp: new Date(),
          status: "sent"
        }
      ]
    };

    setRequests(prev => [newRequest, ...prev]);
    setActiveRequestId(newRequest.id);
    setNewRequestTitle("");
    setNewRequestDescription("");
    setShowNewRequestForm(false);
  };

  const activeRequest = requests.find(req => req.id === activeRequestId);
  const userEmail = localStorage.getItem("userEmail") || "user@example.com";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-warning text-yellow-800";
      case "in-progress": return "bg-info text-blue-800";
      case "completed": return "bg-success text-green-800";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-card border-b shadow-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Work Buddy</h1>
              <p className="text-sm text-muted-foreground">User Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{userEmail}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
          {/* Requests Sidebar */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">My Requests</CardTitle>
                <Button 
                  size="sm" 
                  onClick={() => setShowNewRequestForm(!showNewRequestForm)}
                  variant="gradient"
                >
                  New Request
                </Button>
              </div>
              <CardDescription>Manage your support requests</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {showNewRequestForm && (
                <div className="p-4 border-b bg-muted/30">
                  <div className="space-y-3">
                    <Input
                      placeholder="Request title..."
                      value={newRequestTitle}
                      onChange={(e) => setNewRequestTitle(e.target.value)}
                    />
                    <Input
                      placeholder="Describe your request..."
                      value={newRequestDescription}
                      onChange={(e) => setNewRequestDescription(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleCreateRequest} variant="success">
                        Create
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setShowNewRequestForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              <ScrollArea className="h-[calc(100vh-280px)]">
                <div className="space-y-2 p-4 pt-2">
                  {requests.map((request) => (
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
                        <Badge className={getStatusColor(request.status)}>
                          {getStatusIcon(request.status)}
                          {request.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {request.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {request.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Interface */}
          <Card className="lg:col-span-2 flex flex-col">
            <CardHeader className="pb-3">
              {activeRequest ? (
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {activeRequest.title}
                    <Badge className={getStatusColor(activeRequest.status)}>
                      {getStatusIcon(activeRequest.status)}
                      {activeRequest.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{activeRequest.description}</CardDescription>
                </div>
              ) : (
                <CardTitle>Select a request to start chatting</CardTitle>
              )}
            </CardHeader>
            
            {activeRequest && (
              <>
                <CardContent className="flex-1 p-0">
                  <ScrollArea className="h-[calc(100vh-300px)] p-4">
                    <div className="space-y-4">
                      {activeRequest.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`flex items-start gap-2 max-w-[70%]`}>
                            {message.sender === "admin" && (
                              <Avatar className="w-6 h-6 mt-1">
                                <AvatarFallback className="text-xs bg-secondary">A</AvatarFallback>
                              </Avatar>
                            )}
                            <div
                              className={`p-3 rounded-lg ${
                                message.sender === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              <p className="text-sm">{message.text}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <p className="text-xs opacity-70">
                                  {message.timestamp.toLocaleTimeString()}
                                </p>
                                {message.sender === "user" && message.status && (
                                  <div className="text-xs opacity-70">
                                    {message.status === "sent" && "✓"}
                                    {message.status === "delivered" && "✓✓"}
                                    {message.status === "read" && "✓✓"}
                                  </div>
                                )}
                              </div>
                            </div>
                            {message.sender === "user" && (
                              <Avatar className="w-6 h-6 mt-1">
                                <AvatarFallback className="text-xs bg-primary">U</AvatarFallback>
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
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} size="sm" variant="gradient">
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

export default UserDashboard;