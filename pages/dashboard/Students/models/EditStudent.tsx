
import { StudentResult } from '@/interfaces/StudentsModel';
import React from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import FormElement from './FormElement';
import SwitchTile from './SwitchTile';
import { SchoolClass } from '@/interfaces/ClassModel';
import { Stream } from '@/interfaces/StreamModel';
import { updateStudentData } from '@/utils/data_fetch';
import SelectComponent, { Option } from '../../Staff/models/SelectComponent';

const EditStudent = ({ editModalShow, streams, loadingClasses = false, classes, studentData, setStudentData, setEditModalShow, handleSaveEdit }: { streams: Stream[]; loadingClasses: boolean; classes: SchoolClass[]; editModalShow: boolean; studentData: any; setEditModalShow: React.Dispatch<React.SetStateAction<boolean>>, setStudentData: React.Dispatch<React.SetStateAction<StudentResult | null>>; handleSaveEdit: () => void }) => {
    const options = [] as Option[];
    const [updating, setUpdating] = React.useState(false);
    const [message, setMessage] = React.useState<string>('');
    const [imageFile, setImageFile] = React.useState<File | null>(null);
    // const [studentData, setStudentData] = React.useState({} as any);
    // function to fetch available classes
    if (loadingClasses == false) {
        classes.map((cls) => options.push({ name: cls.class_name, value: cls.class_name }));
    }
    let selectedImage = null;
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
    const enabled = studentData?.isHalfDay;
    const picked = studentData?.isVanStudent;
    // function to handle submission
    const handleEditData = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setUpdating(true);

        const formData = new FormData();

        Object.entries(studentData as any).forEach(([key, value]) => {
            formData.append(key, value as string);
        });
        if (imageFile) {
            formData.append('image', imageFile);
        }
        // capturing school name
        if (imageFile) {
            formData.append('name', JSON.parse(localStorage.getItem('skooltym_user') as string).schoolName);
        }
        // console.log(JSON.parse(localStorage.getItem('skooltym_user') as string).schoolName);

        formData.append('username', `${studentData?.student_fname.toLowerCase()}${studentData?.student_lname.toLowerCase()}${Math.floor(Math.random() * 1000)}`);
        // student key
        formData.append('student_key[key]', '');
        // posting data
        // console.log(currentStudent);
        updateStudentData(formData, studentData._id).then((res) => {
            // setMessage('Student added successfully');
            handleSaveEdit();
            setUpdating(false)
        }).catch((err) => {
            setMessage(err.toString());
            setUpdating(false)
        });
    }
    // console.log(currentStudent);

    return (
        <>
            <Modal show={editModalShow} onHide={() => setEditModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Student</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {studentData && (
                        <Form onSubmit={handleEditData}>
                            {/* {currentStudent._id} */}
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
                                    <img className='rounded-full w-20 h-20' src={selectedImage == null ? studentData.student_profile_pic : selectedImage} alt="student profile" />
                                </Col>
                                <Col className='my-auto'>
                                    <input type="file" accept='image/*' id="photo" className='hidden' onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setImageFile(file);
                                            selectedImage = URL.createObjectURL(file);
                                            setStudentData({
                                                ...studentData,
                                                student_profile_pic: selectedImage
                                            });
                                        }
                                    }} />
                                    <Button onClick={() => {
                                        document.getElementById('photo')?.click();
                                    }} variant='primary'>Upload</Button>

                                </Col>
                            </Row>
                            <br />
                            <SelectComponent options={gender} defaultData={[{ name: studentData.student_gender, value: studentData.student_gender }]} label='Gender' onSelect={(selected) => {
                                setStudentData({
                                    ...studentData,
                                    student_gender: selected,
                                })
                            }} />
                            <SelectComponent options={options} defaultData={[{ name: studentData._class, value: studentData._class }]} label='Class' onSelect={(selected) => {
                                setStudentData({
                                    ...studentData,
                                    _class: selected
                                })
                            }} />
                            <SelectComponent options={streamOptions} defaultData={[{ name: studentData.stream, value: studentData.stream }]} label='Stream' onSelect={(selected) => {
                                setStudentData({
                                    ...studentData,
                                    stream: selected
                                });
                            }} />
                            <SwitchTile defaultValue={studentData.isHalfDay} label='Pick Up Session' subtitle={enabled ? 'Half day student' : 'Full day student'} onChange={(value) => {
                                setStudentData({
                                    ...studentData,
                                    isHalfDay: value
                                })

                            }} />
                            <SwitchTile label='Van Student' defaultValue={studentData.isVanStudent} subtitle={picked ? 'Van student' : 'Not a van student'} onChange={(value) => {
                                setStudentData({
                                    ...studentData,
                                    isVanStudent: value
                                })

                            }} />
                            <Modal.Footer>
                                <Button variant="secondary" disabled={updating} onClick={() => setEditModalShow(false)}>
                                    Close
                                </Button>
                                <Button variant="primary" type='submit' disabled={updating}>
                                    {updating ? 'Updating...' : 'Update'}
                                </Button>
                            </Modal.Footer>
                            {message && <p className="mt-4 bg-[#ee2020cb] p-2 text-white font-semibold text-center">{message}</p>}

                        </Form>
                    )}
                </Modal.Body>

            </Modal>
        </>
    );
};

export default EditStudent;