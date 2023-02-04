import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Row, Col, Card, Tabs } from 'antd';
import styles from './djIndex.less';
const model = 'smartPartyBuilding';
const { TabPane } = Tabs;
document.title = '智慧党建平台';
import dj4 from '../../assets/ldimg4.png';
function findNews(param, page, size) {
    const { dispatch } = this.props;
    let payload = {
        ...(param || ''),
        page: page || 1,
        size: size || 20,
    };
    this.setState({
        param,
    });
    dispatch({
        type: `${model}/findNewsFetch`,
        payload,
    });
}
@connect(({ smartPartyBuilding, loading }) => ({
    editData: smartPartyBuilding,
    loading: loading.models.smartPartyBuilding,
}))
export default class smartPartyBuilding extends Component {
    state = {
        contdiv: [],
    };
    // 查询已有系统及状态
    componentDidMount() {
        let { pathname } = this.props.location;
        let valid = {};
        var harf = pathname.substring(pathname.lastIndexOf('/') + 1);
        this.setState({
            harf,
        });
        if (harf) {
            valid.id = harf;
            findNews.call(this, valid);
        }
        // this.props.dispatch({
        //     type: `${model}/findShykFetch`,
        // });
    }
    componentWillReceiveProps(nextProps) {}
    pushhas(info) {
        if (info) {
            let url = '';
            if (window.location.hostname === 'localhost') {
                url = window.location.origin + '/#/gateway/information' + `/${info}`;
            } else {
                url = window.location.origin + '/api/basel/html/index.html#/gateway/information' + `/${info}`;
            }
            window.open(url);
        }
    }
    onChange(sts) {
        let url = '';
        if (window.location.hostname === 'localhost') {
            url = window.location.origin + '/#/gateway';
        } else {
            url = window.location.origin + '/api/basel/html/index.html#/gateway';
        }
        window.open(url);
    }
    render() {
        const { findNewsList } = this.props.editData;
        let divpush = [];
        let sts = '7';
        if (sts === '1') {
            let url = '';
            if (window.location.hostname === 'localhost') {
                url = window.location.origin + '/#/gateway';
            } else {
                url = window.location.origin + '/api/basel/html/index.html#/gateway';
            }
            window.open(url);
        } else if (sts === '7') {
            divpush.push(
                <div style={{ background: '#fff', width: '100%', textAlign: 'center' }}>
                    <h1>{findNewsList && findNewsList.length ? findNewsList[0].title : ''}</h1>
                    <p>
                        <span style={{ marginRight: '50px' }}>
                            发布人：{findNewsList && findNewsList.length ? findNewsList[0].uname : ''}
                        </span>{' '}
                        发布时间：{findNewsList && findNewsList.length ? findNewsList[0].fbsj : ''}
                    </p>
                    {findNewsList && findNewsList.length ? (
                        findNewsList[0].spuuid ? (
                            <div style={{ width: '100%', margin: '0 auto', height: 700 }}>
                                <video
                                    src={findNewsList[0].spurl}
                                    style={{ width: '100%', height: '100%' }}
                                    controls
                                    autoplay
                                    poster={findNewsList[0].aliurl}
                                ></video>
                            </div>
                        ) : findNewsList && findNewsList.length ? (
                            findNewsList[0].aliurl ? (
                                <div style={{ width: '60%', margin: '0 auto', marginTop: '20px' }}>
                                    <img src={findNewsList[0].aliurl} style={{ width: '100%', height: '100%' }} />
                                </div>
                            ) : (
                                ''
                            )
                        ) : (
                            ''
                        )
                    ) : (
                        ''
                    )}

                    <div className={styles.contzi}>
                        <p
                            dangerouslySetInnerHTML={{
                                __html: findNewsList && findNewsList.length ? findNewsList[0].context : '',
                            }}
                        />
                    </div>
                </div>
            );
        }
        const { loading } = this.props;
        const { contdiv } = this.state;
        const { total, page, size, SaveapprovalList } = this.props.editData;
        return (
            <div className={styles.container} style={{ background: '#F1F1F1' }}>
                <span className={styles.logo1} />
                <span className={styles.setFamily} />
                <div className={styles.nav}>
                    <ul value='2'>
                        <li onClick={this.onChange.bind(this, '1')}>
                            <a>首页</a>
                        </li>
                        <li onClick={this.pushhas.bind(this, 'partyBuilding')}>
                            <a>党建要闻</a>
                        </li>
                        <li onClick={this.pushhas.bind(this, 'dynamic')}>
                            <a>组织动态</a>
                        </li>
                        <li onClick={this.pushhas.bind(this, 'partyMember')}>
                            <a>党员风采</a>
                        </li>
                        <li onClick={this.pushhas.bind(this, 'leader')}>
                            <a>领导关怀</a>
                        </li>
                        <li onClick={this.pushhas.bind(this, 'propaganda')}>
                            <a>宣传阵地</a>
                        </li>
                        <li onClick={this.pushhas.bind(this, 'threeClass')}>
                            <a>三会一课</a>
                        </li>
                    </ul>
                </div>
                <div className={styles.content} style={{ marginTop: '50px' }}>
                    {divpush}
                </div>
            </div>
        );
    }
}
