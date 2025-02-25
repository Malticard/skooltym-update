import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { Stream } from '@/interfaces/StreamModel';
import { ClassStream, SchoolClass } from '@/interfaces/ClassModel';
import SelectComponent, { Option } from '../../Staff/models/SelectComponent';
import { updateClassData } from '@/utils/data_fetch';
import FormElement from '../../Staff/models/FormElement';

const EditClass = ({
    editModalShow,
    streams,
    currentClass,
    setCurrentClass,
    setEditModalShow,
    handleSaveEdit
}: {
    streams: Stream[];
    loadingClasses: boolean;
    editModalShow: boolean;
    currentClass: SchoolClass | any;
    setEditModalShow: React.Dispatch<React.SetStateAction<boolean>>,
    setCurrentClass: React.Dispatch<React.SetStateAction<SchoolClass>>;
    handleSaveEdit: () => void
}) => {
    const [updating, setUpdating] = React.useState(false);
    const [message, setMessage] = React.useState<string>('');

    // Safely create streams options
    const streamsOptions: Option[] = [];
    if (streams) {
        streams.map((r) => streamsOptions.push({ name: r.stream_name, value: r._id }));
    }

    // Safely create default data with null checks
    const defaultData: Option[] = [];
    if (currentClass && currentClass.class_streams) {
        currentClass.class_streams.map((c: ClassStream) => defaultData.push({ name: c.stream_name, value: c._id }));
    }

    // Function to handle submission
    const handleEditData = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setUpdating(true);

        const formData = new FormData();

        if (currentClass) {
            Object.entries(currentClass as any).forEach(([key, value]) => {
                formData.append(key, value as string);
            });
        }

        formData.append('class_key[key]', '');
        // Posting data
        updateClassData(formData, currentClass?._id)
            .then((res) => {
                setMessage('Class updated successfully');
                handleSaveEdit();
                setUpdating(false);
            })
            .catch((err) => {
                setMessage(err.toString());
                setUpdating(false);
            });
    }

    return (
        <>
            <Modal show={editModalShow} onHide={() => setEditModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Class</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form onSubmit={handleEditData}>
                        <FormElement
                            label='Class Name'
                            value={currentClass.class_name || ''}
                            onChange={(e: any) => setCurrentClass({
                                ...currentClass,
                                class_name: e.target.value
                            })}
                        />
                        <br />
                        <SelectComponent
                            multiSelect
                            defaultData={defaultData}
                            options={streamsOptions}
                            label='Streams'
                            onSelect={(selected) => {
                                setCurrentClass({
                                    ...currentClass,
                                    class_streams: selected,
                                })
                            }}
                        />
                        <Modal.Footer>
                            <Button variant="secondary" disabled={updating} onClick={() => setEditModalShow(false)}>
                                Close
                            </Button>
                            <Button variant="primary" type='submit' disabled={updating}>
                                {updating ? 'Updating...' : 'Update'}
                            </Button>
                        </Modal.Footer>
                    </Form>

                </Modal.Body>
            </Modal>
        </>
    );
};

export default EditClass;