import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import { resetAuthenticatedUserPassword } from '@/utils/auth';
import { useRouter } from 'next/router';
import React from 'react';
import { Row, Col, Card, Container, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const ChangePassword = () => {
    const [loading, setLoading] = React.useState(false);
    const router = useRouter();
    // handle change password
    const [passwordData, setPasswordData] = React.useState({
        newPassword: "",
        confirmPassword: ""
    });
    const [error, setError] = React.useState("");
    const handleChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        // ensure all fields are filled
        if (!passwordData.newPassword || !passwordData.confirmPassword) {
            setLoading(false);
            toast.error("All fields are required");
            setError("All fields are required");
        }
        // ensure password and confirm password match
        else if (passwordData.newPassword !== passwordData.confirmPassword) {
            setLoading(false);
            toast.error("Password mismatch.");
            setError("Password mismatch");
        }
        else {
            setError("");
            // send data to backend
            const formData = new FormData();
            formData.append("new_password", passwordData.newPassword);
            formData.append("confirm_password", passwordData.confirmPassword);

            // handle success and error
            resetAuthenticatedUserPassword(formData).then((res) => {
                setLoading(false);
                setError("");
                toast.success("Password changed successfully..");
                router.push("/dashboard", "dashboard", {
                    shallow: true,
                }).then((value) => {
                    console.log(value);
                });
            }).catch((error) => {
                setLoading(false);

            });
        }
    }
    return (
        <div>
            <Seo title="Change Password" />
            <PageHeader title="Change Password" item="Dashboard" active_item="Change Password" />
            {/* ui for change password */}
            <Row className="text-center d-flex justify-content-center align-items-center mt-10">
                <Col lg={12} className="w-4/5 mt-10">
                    <Card>
                        <Row>
                            <Col
                                lg={7}
                                xl={5}
                                className="d-none d-lg-block text-center bg-primary details"
                            >
                                <div className="p-2 flex flex-col justify-center items-center">

                                    <img
                                        src={"/imgs/change_pass.svg"}
                                        className="header-brand-img object-cover mb-0"
                                        width={350}
                                        height={350}
                                        alt="logo"
                                    />

                                    {/* <div className="clearfix"></div> */}

                                    <h5 className="mt-0 text-center text-fixed-white">Reset Your Password</h5>
                                    <span className="text-white-6 fs-13 text-center mb-5 mt-xl-0">
                                        SignUp to create, discover and  connect with the  <br />global
                                        community
                                    </span>
                                </div>
                            </Col>
                            <Col lg={6} xl={7} xs={12} sm={12} className=" login_form ">
                                <Container>
                                    <Row className=" row-md">
                                        <Card.Body className="my-auto mb-0">
                                            {/* <img src='/imgs/change_pass.svg' /> */}
                                            <div className="clearfix"></div>
                                            <h5 className="text-start mb-2">Reset Your Password</h5>
                                            <p className="mb-4 text-muted fs-13 ms-0 text-start">
                                                {` It's`} free to signup and only takes a minute.
                                            </p>
                                            <Form onSubmit={handleChangePassword} data-tour="password-form">

                                                <Form.Group
                                                    className="text-start form-group"
                                                    controlId="formNewPassword"
                                                >
                                                    <Form.Label>New Password</Form.Label>
                                                    <Form.Control
                                                        placeholder="Enter your password"
                                                        type="password"
                                                        value={passwordData.newPassword}
                                                        isInvalid={error.length > 0 ? true : false}
                                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                    />
                                                </Form.Group>
                                                <Form.Group
                                                    className="text-start form-group"
                                                    controlId="formpassword"
                                                >
                                                    <Form.Label>Confirm Password</Form.Label>
                                                    <Form.Control
                                                        placeholder="Enter your password"
                                                        type="password"
                                                        isInvalid={error.length > 0 ? true : false}
                                                        value={passwordData.confirmPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                    />
                                                </Form.Group>
                                                {/* handle errors due to no form data */}
                                                {error && (
                                                    <div className="alert alert-danger">
                                                        {error}
                                                    </div>
                                                )}
                                                <div className="d-grid">
                                                    <Button type='submit' disabled={loading} className="btn btn-primary">
                                                        {loading ? 'Updating password...' : 'Update Password'}
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
    );
};

ChangePassword.layout = "Contentlayout";
export default ChangePassword;