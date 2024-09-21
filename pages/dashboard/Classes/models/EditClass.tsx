
import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { Stream } from '@/interfaces/StreamModel';
import { SchoolClass } from '@/interfaces/ClassModel';
import SelectComponent, { Option } from '../../Staff/models/SelectComponent';
import { updateClassData } from '@/utils/data_fetch';
import FormElement from '../../Staff/models/FormElement';
const EditClass = ({ editModalShow, streams, currentClass, setCurrentClass, setEditModalShow, handleSaveEdit }: { streams: Stream[]; loadingClasses: boolean; editModalShow: boolean; currentClass: any | null; setEditModalShow: React.Dispatch<React.SetStateAction<boolean>>, setCurrentClass: React.Dispatch<React.SetStateAction<SchoolClass | null>>; handleSaveEdit: () => void }) => {
    const [updating, setUpdating] = React.useState(false);
    const [message, setMessage] = React.useState<string>('');
    // streams
    const streamsOptions: Option[] = [];
    streams.map((r) => streamsOptions.push({ name: r.stream_name, value: r._id }));
    // function to handle submission
    const handleEditData = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setUpdating(true);

        const formData = new FormData();

        Object.entries(currentClass as any).forEach(([key, value]) => {
            formData.append(key, value as string);
        });

        formData.append('class_key[key]', '');
        // posting data
        updateClassData(formData, currentClass?._id).then((res) => {
            setMessage('Class added successfully');
            console.log(res);
            handleSaveEdit();
            setUpdating(false)
        }).catch((err) => {
            console.warn(err);
            setMessage(err.toString());
            setUpdating(false)
        });
    }

    return (
        <>
            <Modal show={editModalShow} onHide={() => setEditModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Class</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentClass && (
                        <Form onSubmit={handleEditData}>
                            <FormElement label='Class Name'
                                value={currentClass.class_name}
                                onChange={(e) => setCurrentClass({
                                    ...currentClass,
                                    class_name: e.target.value
                                })} />
                            {/* {currentClass.class_streams} */}
                            <br />
                            <SelectComponent multiSelect defaultData={currentClass.class_streams} options={streamsOptions} label='Streams' onSelect={(selected) => {
                                setCurrentClass({
                                    ...currentClass,
                                    class_streams: selected,
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

export default EditClass;