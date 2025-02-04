import { IconDownload, IconEdit, IconTrash, IconUpload } from '@/public/assets/icon-fonts/tabler-icons/icons-react';
import { handleFileUploads } from '@/utils/handleFileUploads';
import React from 'react';
import { Button, Form } from 'react-bootstrap';
export interface DateFilterIF {
    startDate: string;
    endDate: string;

}
interface DateFilterComponentProps {
    enableActions?: boolean;
    typeOfUpload?: string;
    handleFilter: (data: DateFilterIF) => void;
    exportData?: () => void;
}
const DateFilterComponent: React.FC<DateFilterComponentProps> = ({ handleFilter, exportData, enableActions, typeOfUpload = "staff" }) => {

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data: DateFilterIF = {
            startDate: formData.get('startDate') as string,
            endDate: formData.get('endDate') as string,
        }
        handleFilter(data);
    }


    return (
        <div className="sm:w-4/5 w-1/3 flex sm:flex-row flex-col justify-between items-end">

            <div className=""></div>
            {enableActions && (<div className="flex h-20 items-center justify-end">

                <div></div>
                <button className='btn btn-primary btn-icon-text mx-5 p-2 d-inline-flex align-items-center'
                    onClick={() => exportData && exportData()} >
                    <IconDownload className="sm:visible w-5 h-5" /><span className='mx-2 text-md'>Download</span>
                </button>
            </div>)}
            <Form onSubmit={handleSubmit} className="flex sm:w-36 w-26 h-20 items-center justify-between">
                <input type="date" className='form-control mx-2' name="startDate" />
                <input type="date" className='form-control mx-2' name="endDate" />
                <Button type="submit" className='btn btn-primary'>Filter</Button>
            </Form>
        </div>
    );
};

export default DateFilterComponent;