import _ from 'lodash';
import React from 'react';
import { Button, List, Row, Col, Progress, message } from 'antd';
import { DeleteOutlined, UploadOutlined, PaperClipOutlined, LoadingOutlined } from '@ant-design/icons';
import style from './index.less';

const plUploadJs = require('plupload/js/plupload.full.min');

const EVENTS = [
    'PostInit',
    'Browse',
    'Refresh',
    'StateChanged',
    'QueueChanged',
    'OptionChanged',
    'BeforeUpload',
    'UploadProgress',
    'FileFiltered',
    'FilesAdded',
    'FilesRemoved',
    'FileUploaded',
    'ChunkUploaded',
    'UploadComplete',
    'Destroy',
    'Error',
];

class PlUpload extends React.Component {
    constructor() {
        super();
        this.id = new Date().valueOf();
        this.state = { files: [], uploadState: false, progress: {} };
        this.container = null;
    }

    checkUploader() {
        return plUploadJs !== undefined;
    }

    runUploader = () => {
        this.initUploader();
        this.uploader.init();

        EVENTS.forEach(event => {
            const handler = this.props['on' + event];
            if (typeof handler === 'function') {
                this.uploader.bind(event, handler);
            }
        });
        // 当文件添加到上传队列后触发监听函数
        this.uploader.bind('FilesAdded', (up, files) => {
            if (_.get(this.props, 'multi_selection') === false) {
                this.clearAllFiles();
            } else {
                this.clearFailedFiles();
            }
            const f = this.state.files;
            _.map(files, file => {
                if (up.files.length > this.props.maxLength || f.length == this.props.maxLength) {
                    message.error(`最多上传${this.props.maxLength}个文件`);
                    this.uploader.stop();
                    this.removeFile(file.id);
                } else {
                    f.push(file);
                }
            });
            this.setState({ files: f }, () => {
                if (this.props.autoUpload === true) {
                    this.uploader.start();
                }
            });
        });
        // 当文件从上传队列移除后
        this.uploader.bind('FilesRemoved', (up, rmFiles) => {
            const stateFiles = this.state.files;
            const files = _.filter(stateFiles, file => {
                return -1 !== _.find(rmFiles, { id: file.id });
            });
            this.setState({ files: files });
        });
        //当上传队列的状态发生改变时
        this.uploader.bind('StateChanged', up => {
            if (up.state === plUploadJs.STARTED && this.state.uploadState === false) {
                this.setState({ uploadState: true });
            }
            if (up.state !== plUploadJs.STARTED && this.state.uploadState === true) {
                this.setState({ uploadState: false });
            }
        });
        //队列中的某一个文件上传完成后
        this.uploader.bind('FileUploaded', (up, file, responseObject) => {
            const stateFiles = JSON.parse(JSON.stringify(this.state.files));
            const response = JSON.parse(responseObject.response);
            _.map(stateFiles, (val, key) => {
                if (val.id === file.id) {
                    val.uploaded = true;
                    val.response = response;
                    val.url = response.realUrl;
                    stateFiles[key] = val;
                }
            });
            this.setState({ files: stateFiles });
        });
        // 当发生错误时触发监听函数
        this.uploader.bind('Error', (up, err) => {
            switch (err.code) {
                case -600:
                    return message.error(`上传文件最大为${this.props.maxSize}`);
                case -601:
                    return message.error(`上传文件类型为${this.props.accept}`);
            }
            if (_.isUndefined(err.file) !== true) {
                const stateFiles = this.state.files;
                _.map(stateFiles, (val, key) => {
                    if (val.id === err.file.id) {
                        val.error = err;
                        stateFiles[key] = val;
                    }
                });
                this.setState({ files: stateFiles });
            }
        });
        // 会在文件上传过程中不断触发，可以用此事件来显示上传进度监听函数
        this.uploader.bind('UploadProgress', (up, file) => {
            const stateProgress = this.state.progress;
            stateProgress[file.id] = file.percent;
            this.setState({ progress: stateProgress });
        });
    };

    componentDidMount() {
        if (this.checkUploader()) {
            this.runUploader();
        } else {
            setTimeout(() => {
                if (this.checkUploader()) {
                    this.runUploader();
                } else {
                    console.warn('Plupload has not initialized');
                }
            }, 500);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props != nextProps) {
            return false;
        }
        return true;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.checkUploader()) {
            this.uploader.refresh();
        }
        if (this.state.files != prevState.files) {
            if (
                (this.state?.files?.length && this.state.files.every(item => item.uploaded)) ||
                this.state?.files?.length == 0
            ) {
                this.props.getFileList(this.state.files);
            }
        }
    }

    getComponentId = () => {
        return this.props.id || 'react_plupload_' + this.id;
    };

    initUploader = () => {
        if (this.props.defaultFileList) {
            this.setState({ files: this.props.defaultFileList });
        }
        this.uploader = new plUploadJs.Uploader(
            _.extend(
                {
                    container: `plupload_${this.props.id}`,
                    runtimes: 'html5',
                    multipart: true,
                    chunk_size: '1mb',
                    browse_button: this.getComponentId(),
                    url: '/upload',
                    filters: {
                        mime_types: this.props.accept
                            ? [{ title: 'files filters', extensions: this.props.accept }]
                            : [],
                        max_file_size: this.props.maxSize,
                    },
                },
                this.props
            )
        );
    };

    // 选择文件列-
    list = () => {
        return _.map(this.state.files, val => {
            const removeFile = e => {
                e.preventDefault();
                this.removeFile(val.id);
            };
            return (
                <React.Fragment key={val.id}>
                    <Row gutter={10} wrap={false} className='listItem' style={{ color: '#8c8c8c' }}>
                        <Col flex='15px'>
                            {this.state.uploadState && val.uploaded !== true ? (
                                <LoadingOutlined />
                            ) : (
                                <PaperClipOutlined />
                            )}
                        </Col>
                        <Col flex='auto' className='fileLink'>
                            <a target='_blank' title={val.url} href={val.url}>
                                {val.name}
                            </a>
                        </Col>
                        <Col flex='15px' onClick={removeFile}>
                            <DeleteOutlined className='deleteBtn' />
                        </Col>
                    </Row>
                    {(() => {
                        if (this.state.uploadState === true && val.uploaded !== true && _.isUndefined(val.error)) {
                            const percent = this.state.progress[val.id] || 0;
                            return (
                                <Row style={{ width: '100%' }}>
                                    <Progress size='small' percent={percent} showInfo={false} />
                                </Row>
                            );
                        }
                    })()}
                    {(() => {
                        if (!_.isUndefined(val.error)) {
                            return (
                                <div className={'alert alert-danger'}>
                                    {'Error: ' + val.error.code + ', Message: ' + val.error.message}
                                </div>
                            );
                        }
                    })()}
                </React.Fragment>
            );
        });
    };

    clearAllFiles = () => {
        const state = _.filter(this.state.files, file => {
            this.uploader.removeFile(file.id);
        });
        this.setState({ files: state });
    };

    clearFailedFiles = () => {
        const state = _.filter(this.state.files, file => {
            if (file.error) {
                this.uploader.removeFile(file.id);
            }
            return !file.error;
        });
        this.setState({ files: state });
    };

    removeFile = id => {
        this.uploader.removeFile(id);
        const state = _.filter(this.state.files, file => {
            return file.id !== id;
        });
        this.setState({ files: state });
    };

    doUpload = e => {
        e.preventDefault();
        this.uploader.start();
    };

    render() {
        const list = this.list();

        return (
            <div id={`plupload_${this.props.id}`} className={'my-list'} ref={ref => (this.container = ref)}>
                <Row>
                    <Col span={3}></Col>
                    <Col span={2}>
                        {/*选择文件*/}
                        <Button id={this.getComponentId()} icon={<UploadOutlined />}>
                            {this.props.buttonSelect || 'select'}
                        </Button>
                    </Col>
                    <Col span={2}>
                        {/*上传文件*/}
                        {!this.props.autoUpload && (
                            <Button
                                type='primary'
                                onClick={this.doUpload}
                                disabled={this.state.files.length === 0 ? 'disabled' : false}
                            >
                                {this.props.buttonUpload || 'upload'}
                            </Button>
                        )}
                    </Col>
                    <Col span={17}>
                        {list.length > 0 && <List size={'small'} dataSource={list} renderItem={item => item} />}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default PlUpload;
