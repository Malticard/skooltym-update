
import React from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import FormElement from './FormElement';
import SelectComponent, { Option } from './SelectComponent';
import { postStaffData } from '@/utils/data_fetch';
import { Staff } from '@/interfaces/StaffModel';
import { Role } from '@/interfaces/RolesModel';
import LiveImageComponent from '../../components/LiveImageComponent';
import { toast } from 'react-toastify';

const AddStaff = ({ addModalShow, roles, loadingClasses = false, setAddModalShow, handleSave }: { roles: Role[]; loadingClasses: boolean; addModalShow: boolean; setAddModalShow: React.Dispatch<React.SetStateAction<boolean>>, handleSave: (student: Staff) => void }) => {
    const options = [] as Option[];
    const [staffData, setStaffData] = React.useState({} as any);
    const [imageFile, setImageFile] = React.useState<File | null>(null);
    const [message, setMessage] = React.useState<string>('');
    const [posting, setPosting] = React.useState(false);
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
    const rolesOptions: Option[] = [];
    if (roles) {
        roles.map((stream) => rolesOptions.push({ name: stream.role_type, value: stream._id }));
    }
    // pickup subtitle
    // function to handle submission
    const handleSubmitData = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('')
        setPosting(true);

        const formData = new FormData();
        // capturing school
        formData.append('staff_school', JSON.parse(localStorage.getItem('skooltym_user') as string).school);
        // capturing school name
        formData.append('name', JSON.parse(localStorage.getItem('skooltym_user') as string).schoolName);

        Object.entries(staffData).forEach(([key, value]) => {
            formData.append(key, value as string);
        });
        if (imageFile) {
            formData.append('image', imageFile);
        }
        // posting data
        postStaffData(formData).then((res) => {
            toast.success('Staff added successfully');
            handleSave(res);
            setPosting(false)
            // window.location.reload();
        }).catch((err) => {
            console.log(err);
            toast.error(err.toString());
            setPosting(false)
        })
    }
    return (
        <>
            <Modal show={addModalShow} onHide={() => setAddModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Staff</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmitData}>
                    <Modal.Body>
                        <FormElement
                            value={staffData.staff_fname}
                            label='First Name'
                            onChange={(e) => setStaffData({
                                ...staffData,
                                staff_fname: e.target.value
                            })} />
                        <br />
                        <FormElement label='Last Name'
                            value={staffData.staff_lname}
                            onChange={(e) => setStaffData({
                                ...staffData,
                                staff_lname: e.target.value
                            })} />
                        <br />
                        {/* <FormElement label='Email'
                            value={staffData.staff_email}
                            onChange={(e) => setStaffData({
                                ...staffData,
                                staff_email: e.target.value
                            })} /> */}
                        {/* <br /> */}
                        <FormElement label='Phone Number'
                            value={staffData?.staff_contact}
                            onChange={(e) => setStaffData({
                                ...staffData,
                                staff_contact: parseInt(e.target.value)
                            })} />
                        <br />
                        {/* student profile pic */}
                        <Row className='my-0'>
                            <Col className='text-center my-auto'>
                                <span>Staff Profile</span>
                            </Col>
                            <Col className='mx-20'>
                                <LiveImageComponent url={imageFile == null ? "https://placehold.co/500x500" : URL.createObjectURL(imageFile as Blob)} />
                            </Col>
                            <Col className='my-auto'>
                                <input type="file" accept='image/*' id="photo" className='hidden' onChange={(e) => {
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
                            setStaffData({
                                ...staffData,
                                staff_gender: selected,
                            })
                        }} />  <br /> <SelectComponent options={rolesOptions} label='Assign role' onSelect={(selected) => {
                            setStaffData({
                                ...staffData,
                                staff_role: selected,
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

export default AddStaff;