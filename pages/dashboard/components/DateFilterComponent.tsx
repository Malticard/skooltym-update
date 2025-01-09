import React from 'react';
import { Button, Form } from 'react-bootstrap';
interface DateFilterIF {
    startDate: string;
    endDate: string;
}
interface DateFilterComponentProps {
    handleFilter: (data: DateFilterIF) => void;
}
const DateFilterComponent: React.FC<DateFilterComponentProps> = ({ handleFilter }) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        // console.log(e.currentTarget.value);
        const data: DateFilterIF = {
            startDate: formData.get('startDate') as string,
            endDate: formData.get('endDate') as string,
        }
        handleFilter(data);
    }
    return (
        <div className="sm:w-4/5 w-1/3 flex justify-between items-end">
            <div></div>
            <Form onSubmit={handleSubmit} className="flex sm:w-36 w-26 h-20 items-center justify-between">
                <input type="month" className='form-control mx-2' name="startDate" />
                <input type="month" className='form-control mx-2' name="endDate" />
                <Button type="submit" className='btn btn-primary'>Filter</Button>
            </Form>
        </div>
    );
};

export default DateFilterComponent;