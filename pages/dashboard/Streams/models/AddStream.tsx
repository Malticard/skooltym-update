
import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { postStreamData } from '@/utils/data_fetch';
import { Stream } from '@/interfaces/StreamModel';
import FormElement from '../../Staff/models/FormElement';
import { toast } from 'react-toastify';

const AddClass = ({ addModalShow, loadingClasses = false, setAddModalShow, handleSave }: { loadingClasses: boolean; addModalShow: boolean; setAddModalShow: React.Dispatch<React.SetStateAction<boolean>>, handleSave: (streamData: Stream) => void }) => {
    const [streamData, setStreamData] = React.useState({} as Stream);
    const [message, setMessage] = React.useState<string>('');
    const [posting, setPosting] = React.useState(false);
    // pickup subtitle
    // function to handle submission
    const handleSubmitData = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('')
        setPosting(true);
        const formData = new FormData();
        const school = JSON.parse(localStorage.getItem('skooltym_user') as string).school;
        // capturing school
        formData.append('school', school);

        Object.entries(streamData).forEach(([key, value]) => {
            formData.append(key, value as string);
            console.log(key, value)
        });
        console.log(formData.get('school'));
        // posting data
        postStreamData(formData).then((res) => {
            setMessage('Stream added successfully');
            handleSave(res);
            setPosting(false)
        }).catch((err) => {
            console.warn(err);
            setMessage(err.toString());
            toast.error(err.toString);
            setPosting(false)
        })
    }
    return (
        <>
            <Modal show={addModalShow} onHide={() => setAddModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Stream</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmitData}>
                    <Modal.Body>
                        <FormElement
                            value={streamData.stream_name}
                            label='Stream Name'
                            onChange={(e) => setStreamData({
                                ...streamData,
                                stream_name: e.target.value
                            })} />
                        <br />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" disabled={posting} onClick={() => setAddModalShow(false)}>
                            Close
                        </Button>
                        <Button disabled={posting} type='submit' variant="primary">
                            {posting == false ? `Add Stream` : `Saving...`}
                        </Button>
                    </Modal.Footer>
                    {message && <p className="mt-4 bg-[#ee2020cb] p-2 text-white font-semibold text-center">{message}</p>}
                </Form>
            </Modal>
        </>
    );
};

export default AddClass;