import React, { Fragment } from 'react'
import Seo from '@/shared/layout-components/seo/seo'
import { useRouter } from 'next/router'
import Link from "next/link"
import { Row, Col, Card, Container, Form, Button } from "react-bootstrap";
import { resetPassword } from '@/utils/auth';
import { useSearchParams } from 'next/navigation';

const ResetPassword = () => {
  interface DemoChangerElement extends HTMLElement {
    style: CSSStyleDeclaration;
  }
  const queryParams = useSearchParams();
  const navigate = useRouter();
  // state management
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [errorPassword, setErrorPassword] = React.useState("");
  const [errorConfirmPassword, setErrorConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  function remove() {
    let demoChanger: DemoChangerElement | null = document.querySelector(".demo_changer")
    if (demoChanger) {
      demoChanger.style.right = "-270px";
    }
    document.querySelector(".demo_changer")?.classList.remove("active");
  }
  // helper functions
  const handleResetPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password.length == 0 && confirmPassword.length == 0) {
      setErrorPassword("Password is required");
      setErrorConfirmPassword("Confirm Password is required");
    } else if (password !== confirmPassword) {
      setErrorPassword("");
      setErrorConfirmPassword("Passwords do not match");
    } else {
      setErrorPassword("");
      setErrorConfirmPassword("");
      // start loader
      setLoading(true);
      const formData = new FormData();
      formData.append("id", queryParams.get("id") as string);
      formData.append("new_password", password);
      formData.append("confirm_password", confirmPassword),

        resetPassword(formData).then((res) => {
          // stop loader
          setLoading(false);
          // redirect to login page
          if (res.status == 200) {
            navigate.replace("/");
          }

        }).catch((err) => {
          // stop loader
          setLoading(false);
          // show error message
          setErrorPassword(err.toString());
        })
    }
  }
  return (
    <div>
      <Seo title="Reset Password" />
      {/* <!-- Row --> */}
      <Fragment>
        <div className="page main-signin-wrapper">

          <Row className="signpages text-center" onClick={() => remove()} >
            <Col md={12}>
              <Card>
                <Row className="row-sm">
                  <Col
                    lg={6}
                    xl={5}
                    className="d-none d-lg-block text-center bg-primary details"
                  >
                    <div className="mt-5 pt-5 p-2 position-absolute">
                      <Link href="/components/dashboard/dashboard">

                      </Link>
                      <div className="clearfix"></div>
                      <img
                        src={"../../../assets/images/svgs/user.svg"}
                        className="mx-auto h-40 mb-0"
                        alt="user"
                      />
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
                        <Card.Body className="mt-2 mb-2">

                          <div className="clearfix"></div>
                          <h5 className="text-start mb-2">Reset Your Password</h5>
                          <p className="mb-4 text-muted fs-13 ms-0 text-start">
                            {` It's`} free to signup and only takes a minute.
                          </p>
                          <Form onSubmit={handleResetPassword}>

                            <Form.Group
                              className="text-start form-group"
                              controlId="formNewPassword"
                            >
                              <Form.Label>New Password</Form.Label>
                              <Form.Control
                                placeholder="***********"
                                type="password"
                                isInvalid={!!errorPassword}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                              />
                              {errorPassword && (
                                <Form.Control.Feedback type="invalid">
                                  {errorPassword}
                                </Form.Control.Feedback>
                              )}
                            </Form.Group>
                            <Form.Group
                              className="text-start form-group"
                              controlId="formpassword"
                            >
                              <Form.Label>Confirm Password</Form.Label>
                              <Form.Control
                                placeholder="**********"
                                isInvalid={!!errorConfirmPassword}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                type="password"
                              />
                              {errorConfirmPassword && (
                                <Form.Control.Feedback type="invalid">
                                  {errorConfirmPassword}
                                </Form.Control.Feedback>
                              )}
                            </Form.Group>

                            <div className="d-grid">
                              <Button variant="primary" disabled={loading} type="submit">
                                {loading ? "Resetting..." : "Reset Password"}
                              </Button>
                            </div>

                          </Form>
                          <div className="text-start mt-5 ms-0">
                            <p className="mb-0">
                              Already have an account?
                              <Link className='ms-2'
                                href={`/`}>
                                Sign In
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
ResetPassword.layout = "Authenticationlayout"

export default ResetPassword