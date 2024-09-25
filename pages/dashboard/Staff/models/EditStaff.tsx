
import React from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import FormElement from './FormElement';
import SelectComponent, { Option } from './SelectComponent';
import SwitchTile from './SwitchTile';
import { updateStaffData } from '@/utils/data_fetch';
import { Role } from '@/interfaces/RolesModel';
import { Staff } from '@/interfaces/StaffModel';

const EditStaff = ({ editModalShow, roles, loadingClasses = false, currentStaff, setCurrentStaff, setEditModalShow, handleSaveEdit }: { roles: Role[]; loadingClasses: boolean; editModalShow: boolean; currentStaff: Staff; setEditModalShow: React.Dispatch<React.SetStateAction<boolean>>, setCurrentStaff: React.Dispatch<React.SetStateAction<any>>; handleSaveEdit: () => void }) => {
    const options = [] as Option[];
    const [updating, setUpdating] = React.useState(false);
    const [message, setMessage] = React.useState<string>('');
    const [imageFile, setImageFile] = React.useState<File | null>(null);
    const [studentData, setStudentData] = React.useState(currentStaff as Staff);
    // function to fetch available classes

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
    let defaultRole: Option[] = [];
    // streams
    const rolesOptions: Option[] = [];
    if (roles) {
        roles.map((r) => rolesOptions.push({ name: r.role_type, value: r._id }));
        if (Object.entries(currentStaff).length > 0) {

            defaultRole = rolesOptions.filter((pred) => pred.name === currentStaff.staff_role.role_type);
            console.log(defaultRole);
            if (defaultRole.length > 0) {
                setCurrentStaff({
                    ...currentStaff,
                    staff_role: defaultRole[0].value
                })
            }
        }
    }

    // function to handle submission
    const handleEditData = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setUpdating(true);

        const formData = new FormData();
        Object.entries(currentStaff as any).forEach(([key, value]) => {
            formData.append(key, value as string);
        });
        if (imageFile) {
            formData.append('image', imageFile);
        }
        // capturing school name
        if (imageFile) {
            formData.append('name', JSON.parse(localStorage.getItem('skooltym_user') as string).schoolName);
        }
        formData.append('staff_key[key]', '');

        // posting data
        updateStaffData(formData, currentStaff._id).then((res) => {
            setMessage('Student added successfully');
            // console.log(res);
            handleSaveEdit();
            setUpdating(false)
        }).catch((err) => {
            // console.warn(err);
            setMessage(err.toString());
            setUpdating(false)
        })
        // console.log(currentStudent);
    }

    return (
        <>
            {currentStaff && (<Modal show={editModalShow} onHide={() => setEditModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Staff</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentStaff && (
                        <Form onSubmit={handleEditData}>
                            {/* {currentStudent._id} */}
                            <FormElement
                                value={currentStaff.staff_fname}
                                label='First name'
                                onChange={(e) => setCurrentStaff({
                                    ...currentStaff,
                                    staff_fname: e.target.value
                                })} />
                            <br />
                            <FormElement label='Last Name'
                                value={currentStaff.staff_lname}
                                onChange={(e) => setCurrentStaff({
                                    ...currentStaff,
                                    staff_lname: e.target.value
                                })} />
                            <br />
                            <FormElement label='Email'
                                value={currentStaff.staff_email}
                                onChange={(e) => setCurrentStaff({
                                    ...currentStaff,
                                    staff_email: e.target.value
                                })} />
                            <br /> <FormElement label='Contact'
                                value={currentStaff.staff_contact || ''}
                                onChange={(e) => setCurrentStaff({
                                    ...currentStaff,
                                    staff_contact: parseInt(e.target.value)
                                })} />
                            <br />
                            {/* student profile pic */}
                            <Row className='my-0'>
                                <Col className='text-center my-auto'>
                                    <span>Student Profile</span>
                                </Col>
                                <Col className='mx-10'>
                                    <img className='rounded-full w-20 h-20' src={selectedImage == null ? currentStaff.staff_profilePic : selectedImage} alt="student profile" />
                                </Col>
                                <Col className='my-auto'>
                                    <input type="file" accept='image/*' id="photo" className='hidden' onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setImageFile(file);
                                            selectedImage = URL.createObjectURL(file);
                                            setCurrentStaff({
                                                ...currentStaff,
                                                staff_profilePic: selectedImage
                                            });
                                        }
                                    }} />
                                    <Button onClick={() => {
                                        document.getElementById('photo')?.click();
                                    }} variant='primary'>Upload</Button>

                                </Col>
                            </Row>
                            <br />
                            <SelectComponent options={gender} defaultData={[{ name: currentStaff.staff_gender, value: currentStaff.staff_gender }]} label='Gender' onSelect={(selected) => {
                                setCurrentStaff({
                                    ...currentStaff,
                                    staff_gender: selected as string,
                                })
                            }} /> <br />
                            <SelectComponent options={rolesOptions} defaultData={defaultRole} label='Assign Role' onSelect={(selected) => {
                                setCurrentStaff({
                                    ...currentStaff,
                                    staff_role: selected as string,
                                });
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

            </Modal>)}
        </>
    );
};

export default EditStaff;