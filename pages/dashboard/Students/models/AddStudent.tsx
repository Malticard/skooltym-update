
import { StudentResult } from '@/interfaces/StudentsModel';
import React from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import FormElement from './FormElement';
import SelectComponent, { Option } from './SelectComponent';
import SwitchTile from './SwitchTile';
import { SchoolClass } from '@/interfaces/ClassModel';
import { Stream } from '@/interfaces/StreamModel';
import { postStudentData } from '@/utils/data_fetch';

const AddStudent = ({ addModalShow, streams, loadingClasses = false, classes, setAddModalShow, handleSave }: { streams: Stream[]; loadingClasses: boolean; classes: SchoolClass[]; addModalShow: boolean; setAddModalShow: React.Dispatch<React.SetStateAction<boolean>>, handleSave: (student: StudentResult) => void }) => {
    const options = [] as Option[];
    const [studentData, setStudentData] = React.useState({} as any);
    const [imageFile, setImageFile] = React.useState<File | null>(null);
    const [message, setMessage] = React.useState<string>('');
    const [posting, setPosting] = React.useState(false);
    // function to fetch available classes
    if (loadingClasses == false) {
        classes.map((cls) => options.push({ name: cls.class_name, value: cls.class_name }));
    }
    // gender options
    const gender: Option[] = [
        {
            name: "Male",
            value: 'Male'
        }, {
            name: "Female",
            value: 'Female'
        }
    ]
    // streams
    const streamOptions: Option[] = [];
    streams.map((stream) => streamOptions.push({ name: stream.stream_name, value: stream.stream_name }));
    // pickup subtitle
    // function to handle submission
    const handleSubmitData = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('')
        setPosting(true);
        // if (!imageFile) {
        //     setPosting(false)
        //     setMessage('Please select an image file');
        //     return;
        // }
        const formData = new FormData();
        // capturing school
        formData.append('school', JSON.parse(localStorage.getItem('skooltym_user') as string).school);
        // capturing school name
        formData.append('name', JSON.parse(localStorage.getItem('skooltym_user') as string).schoolName);
        // capturing student guardian
        formData.append('guardians', '');

        Object.entries(studentData).forEach(([key, value]) => {
            formData.append(key, value as string);
        });
        if (imageFile) {
            formData.append('image', imageFile);
        }
        // student username
        formData.append('username', `${studentData.student_fname.toLowerCase()}${studentData.student_lname.toLowerCase()}${Math.floor(Math.random() * 1000)}`);
        // student key
        formData.append('student_key[key]', ``);
        // posting data
        postStudentData(formData).then((res) => {
            setMessage('Student added successfully');
            handleSave(res);
            setPosting(false)
        }).catch((err) => {
            console.warn(err);
            setMessage(err.toString());
            setPosting(false)
        })
    }
    return (
        <>
            <Modal show={addModalShow} onHide={() => setAddModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Student</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmitData}>
                    <Modal.Body>


                        <FormElement
                            value={studentData.student_fname}
                            label='FirstName'
                            onChange={(e) => setStudentData({
                                ...studentData,
                                student_fname: e.target.value
                            })} />
                        <br />
                        <FormElement label='LastName'
                            value={studentData.student_lname}
                            onChange={(e) => setStudentData({
                                ...studentData,
                                student_lname: e.target.value
                            })} />
                        <br />
                        <FormElement label='Other Name'
                            value={studentData.other_name}
                            onChange={(e) => setStudentData({
                                ...studentData,
                                other_name: e.target.value
                            })} />
                        <br />
                        {/* student profile pic */}
                        <Row className='my-0'>
                            <Col className='text-center my-auto'>
                                <span>Student Profile</span>
                            </Col>
                            <Col className='mx-20'>
                                <img className='rounded-full w-20 h-20' src={imageFile == null ? "https://via.placeholder.com/500" : URL.createObjectURL(imageFile as Blob)} alt="student profile" />
                            </Col>
                            <Col className='my-auto'>
                                <input type="file" accept='image/*' id="photo" className='hidden' onChange={(e) => {
                                    e.preventDefault();
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        if (e.target.files && e.target.files[0]) {
                                            setImageFile(e.target.files[0]);
                                        }
                                    }
                                }} />
                                <Button onClick={() => {
                                    document.getElementById('photo')?.click();
                                }} variant='primary'>Upload</Button>

                            </Col>
                        </Row>
                        <br />
                        <SelectComponent options={gender} label='Gender' onSelect={(selected) => {
                            setStudentData({
                                ...studentData,
                                student_gender: selected,
                            })
                        }} />
                        <SelectComponent options={options} label='Class' onSelect={(selected) => {
                            setStudentData({
                                ...studentData,
                                _class: selected
                            })
                        }} />
                        <SelectComponent options={streamOptions} label='Stream' onSelect={(selected) => {
                            setStudentData({
                                ...studentData,
                                stream: selected
                            });
                        }} />
                        <SwitchTile label='Pick Up Session' subtitle={studentData.isHalfDay ? 'Half day student' : 'Full day student'} onChange={(value) => {
                            setStudentData({
                                ...studentData,
                                isHalfDay: value
                            })

                        }} /> <SwitchTile label='Van Student' subtitle={studentData.isVanStudent ? 'Van student' : 'Not a van student'} onChange={(value) => {
                            setStudentData({
                                ...studentData,
                                isVanStudent: value
                            })

                        }} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" disabled={posting} onClick={() => setAddModalShow(false)}>
                            Close
                        </Button>
                        <Button disabled={posting} type='submit' variant="primary">
                            {posting == false ? `Save Changes` : `Saving...`}
                        </Button>
                    </Modal.Footer>
                    {message && <p className="mt-4 bg-[#ee2020cb] p-2 text-white font-semibold text-center">{message}</p>}
                </Form>
            </Modal>
        </>
    );
};

export default AddStudent;