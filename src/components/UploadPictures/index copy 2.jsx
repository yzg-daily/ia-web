import React from 'react';
import { Upload, Icon, Modal } from 'antd';
import { tips } from '@/utils/utils';
const { publicPath } = window;

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

class Index extends React.PureComponent {
    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [],
        data: [],
    };

    componentWillReceiveProps() {
        const { value, clearnImg } = this.props;
        // if(clearnImg){
        //     this.setState({
        //         fileList:[]
        //     })
        // }
        const { data, fileList } = this.state;
        if (value && value !== 'null' && !data.length && !fileList.length) {
            const data = value.split(',').map(file => ({ uid: file, name: file, status: 'done', url: file }));
            this.setState({
                data,
            });
        }
    }

    componentDidMount() {
        const { value } = this.props;
        const { data, fileList } = this.state;
        console.log(fileList, 'fileList');
        if (value && value !== 'null' && !data.length && !fileList.length) {
            const data = value.split(',').map(file => ({ uid: file, name: file, status: 'done', url: file }));
            this.setState({
                data,
            });
        }
    }
    componentWillUnmount() {
        this.handleRemove([]);
        this.setState({
            fileList: [],
            data: [],
        });
    }
    handleCancel = () => {
        this.setState({ previewVisible: false });
    };

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    handleChange = ({ file, fileList }) => {
        const { onChange } = this.props;
        if (file?.status === 'uploading') {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                tips({ description: '只能上传JPG/PNG的图片!', type: 'error', message: '图片错误' });
                return false;
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                tips({ description: '图片不能大于 2MB!', type: 'error', message: '图片错误' });
                return false;
            }
        } else if (file?.status === 'done') {
            const oldData = this.state?.data.map(file => file.uid);
            const newData = this.state?.fileList.map(item => item.response.data);
            const dataStr = [...oldData, ...newData].join();
            onChange && onChange(dataStr);
        }
        let upFile = fileList.filter(file => file.uid.indexOf('rc-upload') !== -1);
        this.setState({ fileList: upFile });
    };

    handleRemove = file => {
        const { uid } = file;
        const { onChange } = this.props;
        let { data, fileList } = this.state;
        const data2 = data.filter(item => item.uid !== uid);
        if (data.length === data2.length) fileList = fileList.filter(item => item.uid !== uid);
        const oldData = data2.map(file => file.uid);
        const newData = fileList.map(item => item.response.data);
        const dataStr = [...oldData, ...newData].join();
        onChange && onChange(dataStr);
        this.setState({
            data: data2,
            fileList,
        });
    };

    render() {
        let { previewVisible, previewImage, fileList } = this.state;
        let { data } = this.state;
        let { disabled, value, num = 10, clearnImg } = this.props;
        data = data.map(d => ({ ...d, url: `${publicPath}/files/${d.uid}` }));
        clearnImg ? (fileList = []) : fileList;
        let newFileList = [...data, ...fileList];
        console.log(value, newFileList, clearnImg, '88888');
        const uploadProps = {
            style: { display: 'inline' },
            action: `${publicPath}/commonFile/uploadFile`,
            listType: 'picture-card',
            fileList: clearnImg ? [] : newFileList,
            disabled,
            showUploadList: value ? true : false,
            onPreview: this.handlePreview,
            onChange: this.handleChange,
            onRemove: this.handleRemove,
        };

        const uploadButton = (
            <div>
                <Icon type='plus' />
                <div className='ant-upload-text'>点击上传图片</div>
            </div>
        );

        return (
            <>
                <Upload {...uploadProps}>{newFileList.length >= num ? null : uploadButton}</Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt='picture' style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </>
        );
    }
}

export default Index;
