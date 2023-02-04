import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Row, Col, Card, Tabs, Pagination, Skeleton } from 'antd';
import styles from './djIndex.less';
const model = 'smartPartyBuilding';
import UploadImage from '@/components/UploadImage';
const { TabPane } = Tabs;
import dj4 from '../../assets/ldimg4.png';
document.title = '智慧党建平台';
const { publicPath } = window;
function findNews(param, page, size, type) {
    const { dispatch } = this.props;
    let payload = {
        ...(param || ''),
        type: type || 1,
        page: page || 1,
        size: size || 10,
        callback: data => {
            const { page, size, total } = data.data;
            this.setState({
                param,
                page,
                size,
                total,
            });
        },
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
        harf: '',
        closenav: '',
        height: 0,
    };
    // 查询已有系统及状态
    componentDidMount() {
        let { pathname } = this.props.location;
        const { offsetHeight } = document.querySelector('.antd-pro-pages-gateway-homepage-dj-index-content') || {};
        let height = 0;
        if (offsetHeight) {
            const { clientHeight } = document.documentElement;
            height = clientHeight - offsetHeight + 100;
        }
        var harf = pathname.substring(pathname.lastIndexOf('/') + 1);
        this.setState({
            harf,
            height,
        });
        let valid = {};
        if (harf) {
            if (harf === 'partyBuilding') {
                valid.columnid = 1;
                findNews.call(this, valid);
            } else if (harf === 'dynamic') {
                valid.columnid = 2;
                findNews.call(this, valid);
            } else if (harf === 'partyMember') {
                valid.columnid = 3;
                findNews.call(this, valid);
            } else if (harf === 'leader') {
                valid.columnid = 4;
                findNews.call(this, valid);
            } else if (harf === 'propaganda') {
                valid.columnid = 5;
                findNews.call(this, valid);
            } else if (harf === 'threeClass') {
                this.props.dispatch({
                    type: `${model}/findShykFetch`,
                });
            }
            this.onChange(harf);
        } else {
            this.onChange('2');
        }
    }
    componentWillReceiveProps(nextProps) {}
    pushhas(info) {
        // if (info === 'threemore') {
        //     let url = window.location.origin + '/#/gateway/threeclass';
        //     window.open(url);
        // }
    }
    onChange(sts) {
        this.setState({
            closenav: sts,
        });
        let valid = {};
        if (sts) {
            if (sts === '1') {
                let url = '';
                if (window.location.hostname === 'localhost') {
                    url = window.location.origin + '/#/gateway';
                } else {
                    url = window.location.origin + '/api/basel/html/index.html#/gateway';
                }
                window.open(url);
            } else if (sts === 'partyBuilding') {
                valid.columnid = 1;
                findNews.call(this, valid);
            } else if (sts === 'dynamic') {
                valid.columnid = 2;
                findNews.call(this, valid);
            } else if (sts === 'partyMember') {
                valid.columnid = 3;
                findNews.call(this, valid);
            } else if (sts === 'leader') {
                valid.columnid = 4;
                findNews.call(this, valid);
            } else if (sts === 'propaganda') {
                valid.columnid = 5;
                findNews.call(this, valid);
            } else if (sts === 'threeClass') {
                this.props.dispatch({
                    type: `${model}/findShykFetch`,
                });
            }
        }
    }
    contexmx(sts, id) {
        let url = '';
        if (window.location.hostname === 'localhost') {
            url = window.location.origin + `/#/gateway/threeclass/${id}`;
        } else {
            url = window.location.origin + '/api/basel/html/index.html#/gateway/threeclass' + `/${id}`;
        }
        window.open(url);
    }
    more(id, sts) {
        let valid = {};
        valid.columnid = id;
        findNews.call(this, valid, 1, 5, 2);
        this.setState({
            closenav: sts,
        });
    }
    totalmag(page, size) {
        this.setState({
            page: page,
            size: size,
        });
        findNews.call(this, this.state.param, page, size);
    }
    render() {
        const { loading } = this.props;
        const { contdiv, harf, closenav, height } = this.state;
        const { findShykhomeList, findNewsList, page, size, total } = this.props.editData;
        let divpush = [];

        let contextall = [];
        if (
            closenav === 'partyBuilding' ||
            closenav === 'dynamic' ||
            closenav === 'partyMember' ||
            closenav === 'leader' ||
            closenav === 'propaganda' ||
            closenav === 'more'
        ) {
            //如果带图片cont

            if (findNewsList && findNewsList.length) {
                findNewsList.map(tt => {
                    contextall.push(
                        <div className={styles.cont} onClick={this.contexmx.bind(this, closenav, tt.id)}>
                            {tt.aliurl ? (
                                <div className={styles.imgtu}>
                                    <img src={tt.aliurl} style={{ width: '100%', height: '100%' }} />
                                </div>
                            ) : (
                                ''
                            )}{' '}
                            <div className={styles.fontzi} style={{ width: '80%' }}>
                                <h2 className={styles.zioverhidden} style={{ width: '380px' }}>
                                    {tt.title}
                                </h2>
                                <p style={{ color: '#999999' }}>
                                    {tt.uname} {tt.fbsj}
                                </p>{' '}
                                <div style={{ fontSize: '16px', lineHeight: '20px', color: '#666666' }}>
                                    {' '}
                                    <p>{tt.brief}</p>
                                    {/* <p dangerouslySetInnerHTML={{ __html: tt.context.replace(/<img[^>]*>/, ' ') }} /> */}
                                </div>{' '}
                            </div>
                        </div>
                    );
                });
            }

            divpush.push(<div style={{ background: '#fff' }}>{contextall}</div>);
        } else if (closenav === 'threeClass') {
            let threedk = [];
            let threezbdydh = [];
            let threedxzh = [];
            let threezwh = [];
            const { dk, dxzh, zbdydh, zwh } = findShykhomeList;
            let threemian = [
                { name: '支部党员大会', id: 6 },
                { name: '支委会', id: 7 },
                { name: '党小组会', id: 8 },
                { name: '党课', id: 9 },
            ];
            if (zbdydh && zbdydh.length) {
                zbdydh.map(el => {
                    threezbdydh.push(
                        <div
                            className={styles.threecont}
                            style={{ width: '97%', borderBottom: '#DEDEDE solid 1px' }}
                            onClick={this.contexmx.bind(this, closenav, el.id)}
                        >
                            {el.aliurl ? (
                                <div className={styles.threeing}>
                                    <img src={el.aliurl} style={{ width: '100%', height: '100%' }} />
                                </div>
                            ) : (
                                <div
                                    style={{
                                        width: 110,
                                        height: 110,
                                        border: '1px solid #ccc',
                                        lineHeight: 110,
                                        textAlign: 'center',
                                        color: '#000',
                                    }}
                                ></div>
                            )}
                            <div className={styles.threezi} style={{ width: '90%' }}>
                                <h3 className={styles.zioverhidden} style={{ width: '380px' }}>
                                    {el.title}
                                </h3>
                                <p style={{ color: '#999999', marginTop: 30 }}>
                                    {el.uname} {el.fbsj}{' '}
                                </p>
                            </div>
                        </div>
                    );
                });
            }
            if (zwh && zwh.length) {
                zwh.map(el => {
                    threezwh.push(
                        <div
                            className={styles.threecont}
                            style={{ width: '97%', borderBottom: '#DEDEDE solid 1px' }}
                            onClick={this.contexmx.bind(this, closenav, el.id)}
                        >
                            {el.aliurl ? (
                                <div className={styles.threeing}>
                                    <img src={el.aliurl} style={{ width: '100%', height: '100%' }} />
                                </div>
                            ) : (
                                <></>
                            )}
                            <div className={styles.threezi} style={{ width: '90%' }}>
                                <h3 className={styles.zioverhidden} style={{ width: '380px' }}>
                                    {el.title}
                                </h3>
                                <p style={{ color: '#999999' }}>
                                    {el.uname} {el.fbsj}{' '}
                                </p>
                            </div>
                        </div>
                    );
                });
            }
            if (dxzh && dxzh.length) {
                dxzh.map(el => {
                    threedxzh.push(
                        <div
                            className={styles.threecont}
                            style={{ width: '97%', borderBottom: '#DEDEDE solid 1px' }}
                            onClick={this.contexmx.bind(this, closenav, el.id)}
                        >
                            {el.aliurl ? (
                                <div className={styles.threeing}>
                                    <img src={el.aliurl} style={{ width: '100%', height: '100%' }} />
                                </div>
                            ) : (
                                <></>
                            )}
                            <div className={styles.threezi} style={{ width: '90%' }}>
                                <h3 className={styles.zioverhidden} style={{ width: '380px' }}>
                                    {el.title}
                                </h3>
                                <p style={{ color: '#999999' }}>
                                    {el.uname} {el.fbsj}{' '}
                                </p>
                            </div>
                        </div>
                    );
                });
            }
            if (dk && dk.length) {
                dk.map(el => {
                    threedk.push(
                        <div
                            className={styles.threecont}
                            style={{ width: '97%', borderBottom: '#DEDEDE solid 1px' }}
                            onClick={this.contexmx.bind(this, closenav, el.id)}
                        >
                            {el.aliurl ? (
                                <div className={styles.threeing}>
                                    <img src={el.aliurl} style={{ width: '100%', height: '100%' }} />
                                </div>
                            ) : (
                                <div
                                    style={{
                                        width: 110,
                                        height: 110,
                                        border: '1px solid #ccc',
                                        lineHeight: 110,
                                        textAlign: 'center',
                                        color: '#000',
                                    }}
                                ></div>
                            )}
                            <div className={styles.threezi} style={{ width: '90%' }}>
                                <h3 className={styles.zioverhidden} style={{ width: '380px' }}>
                                    {el.title}
                                </h3>
                                <p style={{ color: '#999999' }}>
                                    {el.uname} {el.fbsj}{' '}
                                </p>
                            </div>
                        </div>
                    );
                });
            }
            threemian.map(kk => {
                divpush.push(
                    // onClick={this.contexmx.bind(this, 'threemore', kk.id)}
                    <div className={styles.span2}>
                        <div className={styles.sbetween}>
                            <div
                                className={styles.leftdiv}
                                style={{ color: '#333333', fontSize: '20px', fontWeight: 'bold' }}
                            >
                                {kk.name}
                            </div>
                            <div className={styles.rightdiv} onClick={this.more.bind(this, kk.id, 'more')}>
                                更多>>
                            </div>
                        </div>
                        <div style={{ marginTop: 45 }}>
                            {kk.id === 6 ? threezbdydh : []}
                            {kk.id === 7 ? threezwh : []}
                            {kk.id === 8 ? threedxzh : []}
                            {kk.id === 9 ? threedk : []}
                        </div>
                    </div>
                );
            });
        }

        return (
            <div className={styles.container} style={{ background: '#F1F1F1' }}>
                <span className={styles.logo1} />
                <span className={styles.setFamily} />
                <div className={styles.nav}>
                    <ul>
                        <li onClick={this.onChange.bind(this, '1')}>
                            <a>首页</a>
                        </li>
                        <li onClick={this.onChange.bind(this, 'partyBuilding')}>
                            <a className={closenav === 'partyBuilding' ? styles.Selectnav : styles.Selectno}>
                                党建要闻
                            </a>
                        </li>
                        <li onClick={this.onChange.bind(this, 'dynamic')}>
                            <a className={closenav === 'dynamic' ? styles.Selectnav : styles.Selectno}>组织动态</a>
                        </li>
                        <li onClick={this.onChange.bind(this, 'partyMember')}>
                            <a className={closenav === 'partyMember' ? styles.Selectnav : styles.Selectno}>党员风采</a>
                        </li>
                        <li onClick={this.onChange.bind(this, 'leader')}>
                            <a className={closenav === 'leader' ? styles.Selectnav : styles.Selectno}>领导关怀</a>
                        </li>
                        <li onClick={this.onChange.bind(this, 'propaganda')}>
                            <a className={closenav === 'propaganda' ? styles.Selectnav : styles.Selectno}>宣传阵地</a>
                        </li>
                        <li onClick={this.onChange.bind(this, 'threeClass')}>
                            <a className={closenav === 'threeClass' ? styles.Selectnav : styles.Selectno}>三会一课</a>
                        </li>
                    </ul>
                </div>
                <div
                    className={styles.content}
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        marginTop: '50px',
                        minHeight: `${height}px`,
                        alignItems: 'flex-start',
                    }}
                >
                    {divpush ? (
                        divpush
                    ) : (
                        <div style={{ background: '#fff', width: '1200px' }}>
                            <Skeleton avatar paragraph={{ rows: 4 }} />
                        </div>
                    )}
                    {console.log(closenav, total, 'closenav')}
                    {total ? (
                        closenav === 'threeClass' ? (
                            ''
                        ) : (
                            <div
                                style={{ width: '100%', textAlign: 'center', marginBottom: '30px', marginTop: '10px' }}
                            >
                                <Pagination defaultCurrent={page} total={total} onChange={this.totalmag.bind(this)} />
                            </div>
                        )
                    ) : (
                        ''
                    )}
                </div>
            </div>
        );
    }
}
