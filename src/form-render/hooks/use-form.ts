import { Form } from 'antd';

const useForm = () => {
  const [form] = Form.useForm();
  return [form];
};

export default useForm;
