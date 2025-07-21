
import { StudentResult } from '@/interfaces/StudentsModel';
import React from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import FormElement from './FormElement';
import SelectComponent, { Option } from './SelectComponent';
import SwitchTile from './SwitchTile';
import { SchoolClass } from '@/interfaces/ClassModel';
import { Stream } from '@/interfaces/StreamModel';
import { classStreams, postStudentData } from '@/utils/data_fetch';
import LiveImageComponent from '../../components/LiveImageComponent';
import { toast } from 'react-toastify';

const AddStudent = ({ addModalShow, classes, setAddModalShow, handleSave }: { classes: SchoolClass[]; addModalShow: boolean; setAddModalShow: React.Dispatch<React.SetStateAction<boolean>>, handleSave: (student: StudentResult) => void }) => {
    const options = [] as Option[];
    const [studentData, setStudentData] = React.useState({} as any);
    const [imageFile, setImageFile] = React.useState<File | null>(null);
    const [studentClassStreams, setStudentClassStreams] = React.useState<any[]>([]);
    const [message, setMessage] = React.useState<string>('');

    const [posting, setPosting] = React.useState(false);
    // function to fetch available classes
    if (classes) {
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


    // function to handle submission
    const handleSubmitData = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('')
        setPosting(true);

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
            toast.success('Student added successfully');
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
                            label='First Name'
                            onChange={(e) => setStudentData({
                                ...studentData,
                                student_fname: e.target.value
                            })} />
                        <br />
                        <FormElement label='Last Name'
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
                                <LiveImageComponent url={imageFile == null ? "https://backend.skooltym.com/uploads/default.png" : URL.createObjectURL(imageFile as Blob)} />
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
                            // setSelectedClass(selected);
                            classStreams(selected).then((studentStreams) => {
                                setStudentClassStreams(studentStreams)
                            })
                            setStudentData({
                                ...studentData,
                                _class: selected
                            })
                        }} />

                        {studentClassStreams.length > 0 && <SelectComponent options={studentClassStreams} label='Stream' onSelect={(selected) => {
                            setStudentData({
                                ...studentData,
                                stream: selected
                            });
                        }} />}
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
                    {message && <p className="mt-4 bg-[#5eee20cb] p-2 text-white font-semibold text-center">{message}</p>}
                </Form>
            </Modal>
        </>
    );
};

export default AddStudent;