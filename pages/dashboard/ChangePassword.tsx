import PageHeader from '@/shared/layout-components/page-header/page-header';
import Seo from '@/shared/layout-components/seo/seo';
import React from 'react';
import { Row, Col, Card, Container, Form, Button } from 'react-bootstrap';

const ChangePassword = () => {
    interface DemoChangerElement extends HTMLElement {
        style: CSSStyleDeclaration;
    }

    const handleChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

    }
    return (
        <div>
            <Seo title="Change Password" />
            <PageHeader title="Change Password" item="Ecommerce" active_item="Add Product" />
            {/* ui for change password */}
            <Row className="text-center">
                <Col lg={12}>
                    <Card>
                        <Row>
                            <Col
                                lg={7}
                                xl={5}
                                className="d-none d-lg-block text-center bg-primary details"
                            >
                                <div className="mt-5 pt-2 p-2 position-absolute">

                                    <img
                                        src={"/imgs/change_pass.svg"}
                                        className="header-brand-img mb-4"
                                        width={150}
                                        height={150}
                                        alt="logo"
                                    />

                                    {/* <div className="clearfix"></div> */}

                                    <h5 className="mt-4 text-center text-fixed-white">Reset Your Password</h5>
                                    <span className="text-white-6 fs-13 mb-5 mt-xl-0">
                                        SignUp to create, discover and connect with the global
                                        community
                                    </span>
                                </div>
                            </Col>
                            <Col lg={6} xl={7} xs={12} sm={12} className=" login_form ">
                                <Container>
                                    <Row className=" row-md">
                                        <Card.Body className="mt-2 mb-2">
                                            {/* <img src='/imgs/change_pass.svg' /> */}
                                            <div className="clearfix"></div>
                                            <h5 className="text-start mb-2">Reset Your Password</h5>
                                            <p className="mb-4 text-muted fs-13 ms-0 text-start">
                                                {` It's`} free to signup and only takes a minute.
                                            </p>
                                            <Form onSubmit={handleChangePassword}>

                                                <Form.Group
                                                    className="text-start form-group"
                                                    controlId="formNewPassword"
                                                >
                                                    <Form.Label>New Password</Form.Label>
                                                    <Form.Control
                                                        placeholder="Enter your password"
                                                        type="password"
                                                        onChange={(e) => { }}
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
                                                        onChange={(e) => { }}
                                                    />
                                                </Form.Group>

                                                <div className="d-grid">
                                                    <Button type='submit' className="btn btn-primary">Update Password</Button>
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

            {/* end of ui for change password */}
        </div>
    );
};

ChangePassword.layout = "Contentlayout";
export default ChangePassword;