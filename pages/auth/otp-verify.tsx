import React, { Fragment } from 'react'
import Seo from '@/shared/layout-components/seo/seo'
import { Card, Col, Container, Form, Row } from "react-bootstrap";
import Link from "next/link"
import { forgotPassword, handleOtpVerification } from '@/utils/auth';
import { useRouter } from 'next/router';
import { useSearchParams } from "next/navigation";
// import "./otp.css";
const OtpVerify = () => {
    interface DemoChangerElement extends HTMLElement {
        style: CSSStyleDeclaration;
    }
    const queryParams = useSearchParams();
    const navigate = useRouter();
    const otpLength = 6; // Set the OTP length (e.g., 4 or 6)
    const [otp, setOtp] = React.useState(Array(otpLength).fill("")); // OTP digits as an array
    const [otpErrorText, setOtpErrorText] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    React.useEffect(() => {
        console.log(queryParams.get("id"))
    }, [])
    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) { // Allow only digits
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Auto-focus next input
            if (value && index < otpLength - 1) {
                const nextInput = document.getElementById(`otp-input-${index + 1}`);
                if (nextInput) nextInput.focus();
            }
        }
    };
    const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            // Move focus to the previous input on backspace
            const prevInput = document.getElementById(`otp-input-${index - 1}`);
            if (prevInput) prevInput.focus();
        } else if (e.key === "ArrowLeft" && index > 0) {
            // Move focus to the left
            const prevInput = document.getElementById(`otp-input-${index - 1}`);
            if (prevInput) prevInput.focus();
        } else if (e.key === "ArrowRight" && index < otpLength - 1) {
            // Move focus to the right
            const prev = document.getElementById(`otp-input-${index + 1}`);
            if (prev) prev.focus();
        }
    };
    // function to handle triggering forgot password
    const handleOptVerify = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setOtpErrorText("");
        const formData = new FormData();
        try {
            const otpCode = otp.join(""); // Combine OTP digits into a single string
            formData.append("new_otp", otpCode);
            formData.append("id", queryParams.get("id") as string);
            // Call your OTP verification API
            const response = await handleOtpVerification(formData);
            if (response.status == 200) {
                navigate.replace("/auth/reset-password", { query: response.data });
            }
        } catch (error: any) {
            console.log(error);
            setOtpErrorText("Invalid OTP. Please try again.");
        } finally {
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
            <Seo title="Verify OTP" />

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
                                        <div className="mt-3 mx-auto flex flex-col justify-center items-center pt-3 p-2 position-absolute">
                                            <Link href="">
                                                <img
                                                    src={"/imgs/forgot.svg"}
                                                    className="header-brand-img mx-auto"
                                                    alt="logo"
                                                    width={150}
                                                    height={150}
                                                />
                                            </Link>

                                            <div className="clearfix"></div>

                                            <h5 className="mt-4 text-center text-fixed-white">Verify Otp</h5>
                                            <span className="text-white-6 text-center">
                                                Verify otp to reset your password.
                                            </span>
                                        </div>
                                    </Col>
                                    <Col lg={6} xl={7} xs={12} sm={12} className=" login_form ">
                                        <Container fluid>
                                            <Row className=" row-sm">
                                                <Card.Body className="card-body mt-2 mb-2">

                                                    <div className="clearfix"></div>
                                                    <h5 className="text-start mb-2">Verify OTP</h5>
                                                    <p className="mb-4 text-muted fs-13 ms-0 text-start">
                                                        {`It's`} free to signup and only takes a minute.
                                                    </p>
                                                    <Form onSubmit={handleOptVerify}>
                                                        <div className="form-group text-start">
                                                            <label className="form-label">Enter OTP {navigate.query.id}</label>

                                                            <div className="d-flex gap-2 justify-content-center">
                                                                {[...Array(otpLength)].map((_, index) => (
                                                                    <input
                                                                        key={index}
                                                                        className={`form-control text-center ${otpErrorText ? "is-invalid" : ""}`}
                                                                        type="text"
                                                                        id={`otp-input-${index}`}
                                                                        maxLength={1}
                                                                        value={otp[index] || ""}
                                                                        onChange={(e) => handleOtpChange(e, index)}
                                                                        onKeyDownCapture={(e) => handleOtpKeyDown(e, index)}
                                                                        disabled={loading}
                                                                    />
                                                                ))}
                                                            </div>
                                                            {otpErrorText && <div className="invalid-feedback">{otpErrorText}</div>}
                                                        </div>

                                                        <div className="d-grid mt-3">
                                                            <button
                                                                disabled={loading || otp.length !== otpLength}
                                                                type="submit"
                                                                className="btn btn-primary"
                                                            >
                                                                {loading ? `Verifying OTP...` : `Verify OTP`}
                                                            </button>
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

                {/* <!-- End Row --> */}
            </Fragment>
            {/* <!-- End Row --> */}
        </div>
    )
}
OtpVerify.layout = "Authenticationlayout"

export default OtpVerify;

