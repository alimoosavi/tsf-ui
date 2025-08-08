import { useState } from "react";

// Mock axios for demo purposes
const mockAxios = {
    post: async (url, data) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (url === "token/" && data.username && data.password) {
            return { data: { access: "mock-token-123", refresh: "mock-refresh-456" } };
        }
        if (url === "register/" && data.username && data.password) {
            return { data: { message: "User registered successfully" } };
        }
        throw new Error("Invalid credentials");
    }
};

const AuthApp = () => {
    const [currentView, setCurrentView] = useState('login'); // 'login', 'register'
    const [token, setToken] = useState(null);

    const switchToRegister = () => setCurrentView('register');
    const switchToLogin = () => setCurrentView('login');
    const handleAuthSuccess = (authToken) => {
        setToken(authToken);
        // You can add callback here to notify parent component about successful auth
        console.log('Authentication successful:', authToken);
    };

    // Shared styles
    const styles = {
        container: {
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            padding: '1rem'
        },
        card: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '2.5rem',
            width: '100%',
            maxWidth: '400px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
        },
        header: {
            textAlign: 'center',
            marginBottom: '2rem'
        },
        title: {
            fontSize: '2rem',
            fontWeight: '700',
            color: '#1a202c',
            marginBottom: '0.5rem',
            margin: '0 0 0.5rem 0'
        },
        subtitle: {
            color: '#718096',
            fontSize: '0.9rem',
            margin: '0'
        },
        formContainer: {
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
        },
        inputGroup: {
            position: 'relative'
        },
        input: {
            width: '100%',
            padding: '1rem',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '1rem',
            backgroundColor: '#fff',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s ease'
        },
        inputFocused: {
            borderColor: '#667eea',
            boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
        },
        button: {
            width: '100%',
            padding: '1rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            marginTop: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
        },
        buttonDisabled: {
            opacity: '0.6',
            cursor: 'not-allowed'
        },
        linkContainer: {
            textAlign: 'center',
            marginTop: '2rem',
            paddingTop: '2rem',
            borderTop: '1px solid #e2e8f0'
        },
        link: {
            color: '#667eea',
            cursor: 'pointer',
            fontWeight: '500',
            textDecoration: 'underline'
        },
        message: {
            padding: '1rem',
            borderRadius: '8px',
            marginTop: '1rem',
            textAlign: 'center',
            fontSize: '0.9rem'
        },
        successMessage: {
            backgroundColor: '#f0fff4',
            color: '#38a169',
            border: '1px solid #9ae6b4'
        },
        errorMessage: {
            backgroundColor: '#fff5f5',
            color: '#e53e3e',
            border: '1px solid #feb2b2'
        },
        spinner: {
            width: '16px',
            height: '16px',
            border: '2px solid #ffffff',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
        }
    };

    const Login = () => {
        const [form, setForm] = useState({ username: "", password: "" });
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState("");
        const [focusedField, setFocusedField] = useState("");

        const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);
            setError("");

            try {
                const res = await mockAxios.post("token/", form);
                // Handle successful login
                handleAuthSuccess(res.data.access);
                // Store tokens (in real app, you'd use your auth context/state management)
                localStorage.setItem("access_token", res.data.access);
                localStorage.setItem("refresh_token", res.data.refresh);
            } catch (err) {
                setError("Login failed. Please check your credentials.");
            } finally {
                setLoading(false);
            }
        };

        return (
            <div style={styles.container}>
                <style>
                    {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
                </style>
                <div style={styles.card}>
                    <div style={styles.header}>
                        <h1 style={styles.title}>Welcome Back</h1>
                        <p style={styles.subtitle}>Sign in to your analytics dashboard</p>
                    </div>

                    <div style={styles.formContainer} onSubmit={handleSubmit}>
                        <div style={styles.inputGroup}>
                            <input
                                type="text"
                                placeholder="Username"
                                required
                                value={form.username}
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                                onFocus={() => setFocusedField("username")}
                                onBlur={() => setFocusedField("")}
                                style={{
                                    ...styles.input,
                                    ...(focusedField === "username" ? styles.inputFocused : {})
                                }}
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <input
                                type="password"
                                placeholder="Password"
                                required
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                onFocus={() => setFocusedField("password")}
                                onBlur={() => setFocusedField("")}
                                style={{
                                    ...styles.input,
                                    ...(focusedField === "password" ? styles.inputFocused : {})
                                }}
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            style={{
                                ...styles.button,
                                ...(loading ? styles.buttonDisabled : {}),
                            }}
                        >
                            {loading && <div style={styles.spinner}></div>}
                            {loading ? "Signing In..." : "Sign In"}
                        </button>
                    </div>

                    {token && (
                        <div style={{ ...styles.message, ...styles.successMessage }}>
                            Login successful! Token received.
                        </div>
                    )}

                    {error && (
                        <div style={{ ...styles.message, ...styles.errorMessage }}>
                            {error}
                        </div>
                    )}

                    <div style={styles.linkContainer}>
                        <p style={{ color: '#718096', margin: 0 }}>
                            Don't have an account?{' '}
                            <span style={styles.link} onClick={switchToRegister}>
                                Sign up here
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    const Register = () => {
        const [form, setForm] = useState({ username: "", password: "" });
        const [message, setMessage] = useState("");
        const [loading, setLoading] = useState(false);
        const [isSuccess, setIsSuccess] = useState(false);
        const [focusedField, setFocusedField] = useState("");

        const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);
            setMessage("");

            try {
                await mockAxios.post("register/", form);
                setMessage("Account created successfully! You can now sign in.");
                setIsSuccess(true);
                setForm({ username: "", password: "" });
                // Auto-switch to login after 2 seconds
                setTimeout(() => {
                    switchToLogin();
                }, 2000);
            } catch (err) {
                setMessage("Registration failed. Please try again.");
                setIsSuccess(false);
            } finally {
                setLoading(false);
            }
        };

        return (
            <div style={styles.container}>
                <style>
                    {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
                </style>
                <div style={styles.card}>
                    <div style={styles.header}>
                        <h1 style={styles.title}>Create Account</h1>
                        <p style={styles.subtitle}>Join our analytics platform</p>
                    </div>

                    <div style={styles.formContainer}>
                        <div style={styles.inputGroup}>
                            <input
                                type="text"
                                placeholder="Username"
                                required
                                value={form.username}
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                                onFocus={() => setFocusedField("username")}
                                onBlur={() => setFocusedField("")}
                                style={{
                                    ...styles.input,
                                    ...(focusedField === "username" ? styles.inputFocused : {})
                                }}
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <input
                                type="password"
                                placeholder="Password"
                                required
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                onFocus={() => setFocusedField("password")}
                                onBlur={() => setFocusedField("")}
                                style={{
                                    ...styles.input,
                                    ...(focusedField === "password" ? styles.inputFocused : {})
                                }}
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            style={{
                                ...styles.button,
                                ...(loading ? styles.buttonDisabled : {}),
                            }}
                        >
                            {loading && <div style={styles.spinner}></div>}
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </div>

                    {message && (
                        <div style={{
                            ...styles.message,
                            ...(isSuccess ? styles.successMessage : styles.errorMessage)
                        }}>
                            {message}
                        </div>
                    )}

                    <div style={styles.linkContainer}>
                        <p style={{ color: '#718096', margin: 0 }}>
                            Already have an account?{' '}
                            <span style={styles.link} onClick={switchToLogin}>
                                Sign in here
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    const Dashboard = () => {
        return (
            <div style={{
                padding: '2rem',
                textAlign: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
                <div style={{
                    maxWidth: '800px',
                    margin: '0 auto',
                    background: 'white',
                    borderRadius: '16px',
                    padding: '3rem',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
                }}>
                    <h1 style={{
                        color: '#1a202c',
                        marginBottom: '1rem',
                        fontSize: '2.5rem',
                        fontWeight: '700'
                    }}>
                        Analytics Dashboard
                    </h1>
                    <p style={{
                        color: '#718096',
                        fontSize: '1.1rem',
                        marginBottom: '2rem'
                    }}>
                        Welcome to your data analytics platform! 📊
                    </p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1.5rem',
                        marginBottom: '3rem'
                    }}>
                        {['Data Sources', 'ML Models', 'Reports', 'Pipelines'].map((item, i) => (
                            <div key={i} style={{
                                padding: '1.5rem',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                borderRadius: '12px',
                                fontWeight: '600'
                            }}>
                                {item}
                            </div>
                        ))}
                    </div>

                    <button
                        style={{
                            ...styles.button,
                            maxWidth: '200px',
                            margin: '0 auto'
                        }}
                        onClick={() => console.log("salam")}
                    >
                        Logout
                    </button>
                </div>
            </div>
        );
    };

    // Render current view - only Login or Register
    if (currentView === 'register') {
        return <Register />;
    } else {
        return <Login />;
    }
};

export default AuthApp;