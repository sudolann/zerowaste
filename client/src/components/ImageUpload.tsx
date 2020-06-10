import * as React from 'react';
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';


interface ImageUploadProps {
    image: string | undefined
    setImage(value: string): void
    form?(image: string): void
}

function getBase64(img: Blob, callback: { (imageUrl: any): void; (arg0: string | ArrayBuffer | null): any; }) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
}

export const ImageUpload: React.FunctionComponent<ImageUploadProps> = ({ image, setImage, form }): React.ReactElement => {
    const [loading, setLoading] = React.useState<boolean>(false);
    // const [image, setImage] = React.useState<string | undefined>(undefined);

    const handleChange = info => {
        if (info.file.status === 'uploading') {
            setLoading(true);
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl => {
                setImage(imageUrl)
                if (form) {
                    form(imageUrl)
                }
            });
            setLoading(false);
        }
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div className='ant-upload-text'>Upload</div>
        </div>
    );

    return (
        <Upload
            name='avatar'
            listType='picture-card'
            className='avatar-uploader'
            showUploadList={false}
            action='https://spoonacular.com/recipeImages/48191-312x231.jpg'
            beforeUpload={beforeUpload}
            onChange={handleChange}
        >
            {image ? (
                <img src={image} alt='avatar' style={{ width: '100%' }} />
            ) : (
                    uploadButton
                )}
        </Upload>
    )
};