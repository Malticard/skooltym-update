import React, { Fragment } from 'react'
import Seo from '@/shared/layout-components/seo/seo'
import { Card, Col, Container, Form, Row } from "react-bootstrap";
import Link from "next/link"
import { forgotPassword } from '@/utils/auth';
import { useRouter } from 'next/router'




const ForgotPassword = () => {
    interface DemoChangerElement extends HTMLElement {
        style: CSSStyleDeclaration;
    }
    const navigate = useRouter();
    const [phone, setPhone] = React.useState("");
    const [errorText, setErrorText] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    // function to handle triggering forgot password
    const handleForgotPassword = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData();
        if (phone.length > 0) {
            setLoading(true);
            formData.append('staff_contact', `${parseInt(phone)}`);
            forgotPassword(formData).then((res) => {
                if (res.status == 200) {
                    console.log(res.data)
                    navigate.replace('/auth/otp-verify', { query: res.data });
                    setLoading(false);
                }

                setLoading(false);
            }).catch((err) => {
                setErrorText(err.toString())
                console.log(err)
                setLoading(false);
            })
        } else if ((phone.length > 0) && ((phone.length) < 11)) {
            setErrorText("Phone number must have 10 characters");
            setLoading(false);
        } else {
            setErrorText("Phone number is required");
            setLoading(false);
        }

    }
    function remove() {
        let demoChanger: DemoChangerElement | null = document.querySelector(".demo_changer")
        if (demoChanger) {
            demoChanger.style.right = "-270px";
        }
        document.querySelector(".demo_changer")?.classList.remove("active");
    }
    return (
        <div>
            <Seo title="Forgot Password" />

            {/* <!-- Row --> */}
            <Fragment>
                <div className="page main-signin-wrapper" >
                    <Row className="signpages text-center"
                        onClick={() => remove()}
                    >
                        <Col md={12}>
                            <Card>
                                <Row className="row-sm">
                                    <Col
                                        lg={6}
                                        xl={5}
                                        className="d-none d-lg-block text-center bg-primary details"
                                    >
                                        <div className="mt-3 pt-3 p-2 position-absolute">
                                            <Link href="/components/dashboard/dashboard">
                                                <img
                                                    src={"/imgs/forgot.svg"}
                                                    className="header-brand-img mx-auto"
                                                    alt="logo"
                                                    width={150}
                                                    height={150}
                                                />
                                            </Link>

                                            <div className="clearfix"></div>

                                            <h5 className="mt-4 text-fixed-white">Reset Your Password</h5>
                                            <span className="text-white-6 fs-13 mb-5 mt-xl-0">
                                                Signup to create, discover and connect with the global
                                                community
                                            </span>
                                        </div>
                                    </Col>
                                    <Col lg={6} xl={7} xs={12} sm={12} className=" login_form ">
                                        <Container fluid>
                                            <Row className=" row-sm">
                                                <Card.Body className="card-body mt-2 mb-2">

                                                    <div className="clearfix"></div>
                                                    <h5 className="text-start mb-2">Forgot Password</h5>
                                                    <p className="mb-4 text-muted fs-13 ms-0 text-start">
                                                        {`It's`} free to signup and only takes a minute.
                                                    </p>
                                                    <Form onSubmit={handleForgotPassword}>
                                                        <div className="form-group text-start">
                                                            <label className="form-label">Phone number</label>
                                                            <input className={`form-control ${errorText ? "is-invalid" : ""}`} placeholder="07-xxx-xxx" type="phone" onChange={(e) => setPhone(e.target.value)} value={phone} />
                                                            {errorText && <div className="invalid-feedback">{errorText}</div>}
                                                        </div>
                                                        <div className="d-grid">
                                                            <button disabled={loading} type="submit" className="btn btn-primary"> {loading ? `Requesting...` : `Request password`}</button>
                                                        </div>

                                                    </Form>
                                                    <div className="card-footer border-top-0 ps-0 mt-3 text-start ">
                                                        <p className="mb-1">Did you remember your password?</p>
                                                        <p className="mb-0">
                                                            Try to
                                                            <Link
                                                                href="/"> Signin
                                                            </Link>
                                                        </p>
                                                    </div>
                                                </Card.Body>
                                            </Row>
                                        </Container>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </div>

                {/* <!-- End Row --> */}
            </Fragment>
            {/* <!-- End Row --> */}
        </div>
    )
}
ForgotPassword.layout = "Authenticationlayout"

export default ForgotPassword

