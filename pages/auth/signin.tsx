import { Button, Col, Form, Row, Alert, Container, Card } from 'react-bootstrap';
import { useRouter } from 'next/router'
import styles from '@/styles/Home.module.scss'
import { useState } from 'react';
import Link from "next/link";
import { ChangeEvent } from 'react';
import Seo from '@/shared/layout-components/seo/seo';
import axios from 'axios';
import React from 'react';
import { StaffLogin } from '@/interfaces/StaffLogin';
import { toast } from 'react-toastify';


const Home = () => {
    const [loading, setLoading] = useState(false);
    const [err, setError] = useState("");
    const [data, setData] = useState({
        contact: "",
        password: ""
    })
    const [serverMessage, setServerMessage] = useState("");
    const { contact, password } = data;
    let navigate = useRouter();

    // Get redirect URL from query params
    const redirectUrl = navigate.query.redirect as string;
    const returnParams = navigate.query.returnParams as string;

    React.useEffect(() => {
        // const user = localStorage.getItem("skooltym_user");
    }, [])
    const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setData({ ...data, [e.target.name]: e.target.value })
        setError("");
        setServerMessage("");
    }

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setServerMessage("");

        try {
            const response = await axios.post('/api/auth/login', {
                staff_contact: contact,
                staff_password: password
            });

            setLoading(false);

            if (response.status === 200) {
                const { user, message, sessionId } = response.data;

                // Store user data and session in localStorage for compatibility
                localStorage.setItem("skooltym_user", JSON.stringify({
                    ...user,
                    sessionId
                }));

                // Display server message if available
                if (message) {
                    setServerMessage(message);
                }

                // Role-based navigation
                if (user.role === 'Admin' || user.role === 'Finance') {
                    if (user.isNewUser === true) {
                        toast.info("Logged in successfully, but first change your password.");
                        // Use window.location to ensure proper cookie handling
                        window.location.href = '/dashboard/ChangePassword';
                    } else {
                        toast.success(message || "Logged in successfully.");

                        // Determine where to redirect
                        let targetUrl = '/dashboard'; // default

                        if (redirectUrl) {
                            targetUrl = redirectUrl;
                            // Add back the original query params if they existed
                            if (returnParams) {
                                targetUrl += returnParams;
                            }
                        }

                        // Use window.location to ensure proper cookie handling
                        window.location.href = targetUrl;
                    }
                } else {
                    toast.error("You are not authorized to access this page");
                    setError("You are not authorized to access this page");
                }
            }
        } catch (error: any) {
            setLoading(false);
            console.log(error)
            // Handle different types of errors from the server
            if (error.response?.data) {
                const { message, code } = error.response.data;

                switch (code) {
                    case 'MISSING_CREDENTIALS':
                        setError("Please provide both email and password");
                        toast.error("Please provide both email and password");
                        break;
                    case 'INVALID_CREDENTIALS':
                        setError("Invalid email or password");
                        toast.error("Invalid email or password");
                        break;
                    case 'SERVER_ERROR':
                        setError("Server error occurred. Please try again later.");
                        toast.error("Server error occurred. Please try again later.");
                        break;
                    default:
                        setError(message || "Login failed");
                        toast.error(message || "Login failed");
                }
            } else {
                setError("Network error. Please check your connection.");
                toast.error("Network error. Please check your connection.");
            }
        }
    };

    return (
        <div className={styles.container}>
            <Seo title='Login' />
            <div className="page main-signin-wrapper">
                <Row className="signpages text-center" >
                    <Col md={12}>
                        <Card>
                            <Row className="row-lg">
                                <Col
                                    lg={12}
                                    xl={5}
                                    className="d-none d-lg-block text-center bg-primary details"
                                >
                                    <div className="pl-10 pt-5 my-auto p-2 position-absolute">
                                        <img
                                            src={`/imgs/login.png`}
                                            className="pl-3 header-brand-img mb-4"
                                            width={250}
                                            height={250}
                                            alt="logo-light"
                                        />
                                        <div className="clearfix"></div>

                                        <h5 className="mt-4 font-satoshi font-bold text-white">Skooltym</h5>
                                        <span className="text-white-6 text-md font-normal">
                                            Monitor student drop offs and pickups
                                        </span>
                                    </div>
                                </Col>
                                <Col lg={12} xl={7} xs={12} sm={12} className="login_form ">
                                    <Container fluid>
                                        <Row className="row-sm">
                                            <Card.Body className="mt-2 mb-2">
                                                <div className="clearfix"></div>
                                                {err && <Alert variant="danger">{err}</Alert>}
                                                {serverMessage && <Alert variant="success">{serverMessage}</Alert>}
                                                <Form onSubmit={handleLogin}>
                                                    <h5 className="text-start font-bold text-xl mb-2">
                                                        SignIn to Your Account
                                                    </h5>
                                                    <p className="mb-4 text-muted fs-13 ms-0 text-start">
                                                        Sign In to create, discover and connect with the global
                                                        community
                                                    </p>
                                                    <Form.Group className="text-start form-group" controlId="formEmail">
                                                        <Form.Label>Phone Number</Form.Label>
                                                        <Form.Control
                                                            className="form-control"
                                                            placeholder="Enter your registered contact"
                                                            name="contact"
                                                            type='phone'
                                                            isInvalid={err.length > 0 ? true : false}
                                                            value={contact}
                                                            disabled={loading}
                                                            onChange={changeHandler}

                                                        />
                                                    </Form.Group>
                                                    <Form.Group
                                                        className="text-start form-group"
                                                        controlId="formpassword"
                                                    >
                                                        <Form.Label>Password</Form.Label>
                                                        <Form.Control
                                                            className="form-control"
                                                            placeholder="Enter your password"
                                                            name="password"
                                                            type='password'
                                                            isInvalid={err.length > 0 ? true : false}
                                                            value={password}
                                                            onChange={changeHandler}
                                                            disabled={loading}

                                                        />
                                                    </Form.Group><div className="d-grid">
                                                        <div className="text-end mt-1 mb-2 ms-0">
                                                            <div className="mb-1">
                                                                <Link
                                                                    href="/auth/forgot-password"
                                                                > Forgot password ?
                                                                </Link>
                                                            </div>
                                                        </div>
                                                        <Button disabled={loading} type='submit'>
                                                            {loading ? 'Signing in.....' : ' Sign In'}
                                                        </Button>
                                                    </div>
                                                </Form>
                                            </Card.Body>
                                        </Row>
                                    </Container>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    )
}


export default Home