import React, { useEffect, useState } from 'react';
import { Upload } from 'antd';
import { tips } from '@/utils/utils';
import request from '@/utils/request';
const { publicPath } = window;

/**
 * 下载excel的功能
 *  @param {String}  url 导出的路径
 *  @param {String}  fileName 文件的名称
 *  */

export const DownLoadExcel = async (url, fileName = '文件') => {
    if (!url) return;
    // 下载excel
    return request(`${publicPath}/${url}`, { method: 'GET' }, 'blob').then(res => {
        let a = document.createElement('a');
        let url = window.URL.createObjectURL(res);
        a.href = url;
        a.download = fileName + '.xls';
        a.click();
        window.URL.revokeObjectURL(url);
    });
};

const defaultConfig = {
    // action: `${publicPath}/commonFile/uploadFile`,
    action: `${publicPath}/statement/upload`,
    listType: 'card',
    downloadUrl: 'commonFile/downloadFile', // 参数 fileId
};
/***
 * 文件上传功能(非图片)
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const UploadFile = props => {
    const [fileList, setFileList] = useState([]);
    // const [valueList, setValueList] = useState([]);
    const fileReg = new RegExp(props?.fileType); // 文件类型 fileReg 值为 false, fileReg 会通过所以的文件类型

    const { value, max = 1, action, config = {} } = props;
    if (action) {
        defaultConfig.action = action;
    }

    // 上级传入的 文件链接  可以添加 某种回显的icon
    useEffect(() => {
        if (value) {
            setFileList(value?.split(',')?.map?.(str => ({ uid: str, name: str, status: 'done', url: str })) || []);
        }
    }, [value]);

    // 预览
    function onPreview(file) {
        if (!file?.url) return false;
        DownLoadExcel(`${defaultConfig.downloadUrl}?fileId=${file.url}`, file?.name);
    }

    // 上传
    function onChange({ file, fileList }) {
        let newList = fileList.slice(-max);

        const status = file?.status;
        if (status === 'uploading') {
            if (!fileReg?.test(file?.type)) {
                tips({ description: '文件格式错误!', type: 'error', message: '文件格式错误' });
            }
        } else if (status === 'done') {
            const code = file?.response?.code;
            if (!code) {
                tips({ description: file?.response?.msg || '文件格式错误!', type: 'error', message: '文件格式错误' });
                return false;
            }
            // setFileList(() => fileList);
            props?.onChange?.(getFileCode());
        }
        setFileList(newList); //upload 设置 fileList 之后 onchange 默认只会执行一次， 需要 强制更新
    }

    // 删除
    function onRemove(file) {
        const index = fileList.findIndex(f => f?.uid === file?.uid);
        if (index > -1) {
            setFileList(old => old.splice(index, 0));
            props?.onChange?.(getFileCode());
        }
    }

    function getFileCode() {
        if (!fileList?.length) return '';
        return fileList
            .map(f => f?.response?.data)
            .filter(str => str)
            .toString();
    }

    return (
        <>
            <Upload
                {...defaultConfig}
                onChange={onChange}
                onRemove={onRemove}
                onPreview={onPreview}
                fileList={fileList}
                {...(config || {})}
            >
                上传文件
            </Upload>
        </>
    );
};

export default UploadFile;
