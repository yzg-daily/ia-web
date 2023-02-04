import React, { Component } from 'react';
import { Upload, Icon, Modal, Spin } from 'antd';
import PropTypes from 'prop-types';
import { tips } from '@/utils/utils';
const { publicPath } = window;

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        const img = new Image();
        reader.readAsDataURL(file);
        reader.onload = () => {
            img.addEventListener('load', () => {
                resolve({
                    width: img.width,
                    height: img.height,
                    url: convertBase64(reader.result),
                });
            });
            // @ts-ignore
            img.src = reader.result;
        };
        reader.onerror = error => reject(error);
    });
}

/**
 * convertBase64 图片转换Base64
 * @param {string|ArrayBuffer} url 图片src地址
 * @param {function} [callback] 回调函数
 * @param {boolean} [isImageZip] 是否开启图片压缩。默认开启
 * */
function convertBase64(url, callback, isImageZip = false) {
    const img = new Image();
    img.addEventListener('load', () => {
        // 创建画布
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        //  获取原图比例,为了等比压缩
        const ratio = img.naturalWidth / img.naturalHeight;
        // 设置宽度高度.isImageZip为true时，按等比例压缩图片宽高。否则设置为图片原始宽高。
        canvas.width = isImageZip ? img.width / ratio : img.width;
        canvas.height = isImageZip ? img.height / ratio : img.height;
        // 将img绘制到画布上
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        if (callback && typeof callback === 'function') {
            let paramUrl;
            if (isImageZip) {
                paramUrl = canvas.toDataURL('image/jpeg', 0.6);
            } else {
                paramUrl = canvas.toDataURL('image/jpeg');
            }
            callback(img, paramUrl);
        }
    });
    img.addEventListener('error', () => {
        tips({ description: '图片加载失败！', type: 'error', title: '图片错误' });
        callback(img, url);
    });
    // @ts-ignore
    img.src = url;
}

function fileReader(file, callback) {
    const files = new File([file], file.url, {
        type: 'image/jpeg',
    });
    // 声明一个FileReader实例
    const reader = new FileReader();
    // 调用readAsDataURL方法来读取选中的图像文件
    reader.readAsDataURL(files);
    reader.addEventListener('load', () => {
        if (callback && typeof callback === 'function') {
            callback(reader);
        }
    });
}

/**
 * 上传按钮图标
 * @param {object} param
 * @param {object|string} [param.buttonIcon] 上传按钮图标Image对象或是src路径
 * @param {string} [param.name] 按钮名称
 * @return {JSX.Element}
 * */
function uploadButton({ buttonIcon, name = '' }) {
    if (buttonIcon) {
        // let icon;
        // if (typeof buttonIcon === 'string') {
        //     icon = <img src={buttonIcon} alt='上传' />;
        // } else if (typeof buttonIcon === 'object') {
        //     icon = buttonIcon;
        // }

        return <>{icon}</>;
    }
    return (
        <>
            {/* @ts-ignore */}
            {/* <Icon type='plus' />
            <div className='ant-upload-text'>上传{name}</div> */}
        </>
    );
}

/**
 * UploadImage 图片上传及预览
 * @param {Object} props
 * @param {String} props.name 图片名称。默认：''
 * @param {String} props.unique 图片类别唯一值。默认：''
 * @param {String} props.action 图片上传接口地址。默认：'/enmscg/comua/uploadFile'
 * @param {Number} props.max 本组图片最多上传数量。默认：2
 * @param {Array} props.fileList 已上传图片。默认：[]
 * @param {object | string} props.butIcon 上传按钮图标
 * @returns {Object} this
 * */
class UploadImage extends Component {
    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [],
        max: 2,
        size: 2,
        IMGID: [],
        loading: false,
    };

    componentDidMount() {
        const { max, size, fileList } = this.props;
        if (max) {
            this.setState({ max });
        }
        if (size) {
            this.setState({ size });
        }
        if (fileList.length) {
            this.setState({ fileList });
        }
    }

    componentWillReceiveProps(nextProps) {
        const { fileList, isUpdate } = nextProps;
        const config = {
            fileList: [],
            // IMGID: [],
        };
        if (fileList.length) {
            config.loading = true;
            fileList.forEach(f => {
                const src = f.url || f.thumbUrl;
                convertBase64(src, (image, url) => {
                    config.fileList.push({ ...f, url, width: image.width });
                    config.loading = false;
                    config.width = image.width;
                    this.setState(() => ({ ...config }));
                });
            });
        }
        if (isUpdate) {
            this.setState(() => ({ ...config }));
        }
    }

    /**
     * 获取当前图片ID
     * @returns {Array} 返回图片ID数字
     */
    getIMG_ID = () =>
        this.state.fileList.map(item => {
            if (item.response && item.response.code === 1) return item.response.data;
            return item.uid;
        });

    /**
     * 获取已有文件列表
     * @returns {Array} 返回图片ID数字
     */
    getFileList = () => this.state.fileList;

    // 清空数据
    empty = () => {
        const { ...state } = this.state;
        this.setState({
            ...state,
            fileList: [],
            IMGID: [],
        });
    };

    // 上传证件
    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        const { ...fileInfo } = file;
        let { ...temp } = fileInfo;
        if (!file.url && !file.preview) {
            // 上次预览
            temp = { ...temp, ...(await getBase64(file.originFileObj)) };
        }
        this.setState({
            previewImage: temp.url || temp.thumbUrl,
            width: temp.width,
            previewVisible: true,
        });
    };

    handleChange = info => {
        const { IMGID } = this.state;
        const config = {
            fileList: [],
            IMGID,
        };
        if (info.file.status === 'error') {
            return tips({
                description: `上传文件${info.file.name}错误.错误代码：${info.file.error.status}`,
                type: 'error',
            });
        }
        if (info.file.status === 'done') {
            if (info.file.response.code !== 1) {
                config.IMGID.length = 0;
                config.fileList.length = 0;
                this.setState(config);
                tips({ description: info.file.response.msg.replace(/\w|\.|\:|\s/gi, ''), type: 'error' });
            } else if (info.file.response.code === 1) {
                config.IMGID.push(info.file.response.data);
            }
        }
        config.fileList.push(...info.fileList);
        this.setState(config);
    };

    beforeUpload = file => {
        if (!/image\/\w+/.test(file.type)) {
            tips({ description: '文件必须为图片！', type: 'error' });
            // 删除错误类型文件
            setTimeout(() => {
                this.setState(state => ({
                    fileList: state.fileList.filter(f => f.uid !== file.uid),
                }));
            });
            return false;
        }
        return new Promise((resolve, reject) => {
            fileReader(file, src => {
                convertBase64(src.result, (image, url) => {
                    const img = new Image();
                    img.addEventListener('load', () => {
                        convertBase64(url, el => {
                            fileReader(el, files => resolve(files));
                        });
                    });
                    img.addEventListener('error', () => {
                        reject(reject);
                    });
                    img.src = url;
                });
            });
        });
    };

    onRemove = file => {
        const { onRemove } = this.props;
        const { uid } = file;
        const { fileList } = this.state;
        const result = fileList.filter(f => f.uid !== uid);
        this.setState({ fileList: result });
        if (onRemove && typeof onRemove === 'function') {
            onRemove(uid);
        }
    };

    render() {
        const { name, unique, action, butIcon } = this.props;
        const { loading, previewVisible, previewImage, fileList = [], max, width, flag = false } = this.state;
        let w = 0;
        if (this.state.width > 1200) {
            w = this.state.width * 0.5;
        } else {
            w = this.state.width / 2;
        }
        const showUploadList = {
            showRemoveIcon: flag ? true : false,
        };
        return (
            <>
                <Spin tip='图片加载中...' spinning={loading}>
                    {name ? <h3>{name}</h3> : null}
                    <Upload
                        withCredentials
                        // headers={{ Authorization: `Bearer ${getCookie('token')}` }}
                        key={unique}
                        action={action}
                        beforeUpload={!flag && this.beforeUpload}
                        listType='picture-card'
                        fileList={fileList}
                        onPreview={this.handlePreview}
                        onChange={!flag && this.handleChange}
                        onRemove={!flag && this.onRemove}
                        showUploadList={showUploadList}
                    >
                        {/* {fileList.length >= max ? null : uploadButton({ buttonIcon: butIcon, name })} */}
                        {fileList.length >= max ? null : null}
                    </Upload>
                </Spin>
                <Modal
                    destroyOnClose
                    width={width + 48}
                    visible={previewVisible}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img title={name} style={{ width }} alt={name} src={previewImage} />
                </Modal>
            </>
        );
    }
}

UploadImage.propTypes = {
    name: PropTypes.string,
    unique: PropTypes.string,
    action: PropTypes.string,
    max: PropTypes.number,
    size: PropTypes.number,
    fileList: PropTypes.array,
    onRemove: PropTypes.func,
    butIcon: PropTypes.object,
};
UploadImage.defaultProps = {
    name: '',
    unique: '',
    action: `${publicPath}/commonFile/uploadFile`,
    max: 2,
    size: 2,
    fileList: [],
    onRemove: null,
    butIcon: null,
};
export default UploadImage;
