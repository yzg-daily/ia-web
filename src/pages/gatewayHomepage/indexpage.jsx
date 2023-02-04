import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Row, Col, Carousel } from 'antd';
import styles from './djIndex.less';
const model = 'smartPartyBuilding';
import dj1 from '../../assets/djimg1.png';
import dj2 from '../../assets/zzimg2.png';
import dj3 from '../../assets/dyimg3.png';
import dj4 from '../../assets/ldimg4.png';
import dj5 from '../../assets/xcimg5.png';
import threeZi from '../../assets/threeZi.png';
const { publicPath } = window;
document.title = '智慧党建平台';
function findRotationChart(param, page, size) {
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
        type: `${model}/findRotationChartFetch`,
        payload,
    });
}
@connect(({ smartPartyBuilding, loading }) => ({
    editData: smartPartyBuilding,
    loading: loading.models.smartPartyBuilding,
}))
export default class smartPartyBuilding extends Component {
    state = {};
    // 查询已有系统及状态
    componentDidMount() {
        const { param } = this.state;
        findRotationChart.call(this, param);
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
    render() {
        const { loading } = this.props;
        const { total, page, size, findRotationChartList } = this.props.editData;
        let lunbimg = [];
        findRotationChartList.map(el => {
            lunbimg.push(
                <div className={styles.Carousel}>
                    <img src={el.aliurl} style={{ width: '100%', height: '100%' }} />
                </div>
            );
        });
        return (
            <div className={styles.container}>
                <div className={styles.banner}></div>
                <span className={styles.setlogohome} />
                {/* <span className={styles.setFamily} /> */}
                <div className={styles.content} style={{ marginTop: '24vh' }}>
                    <div className={styles.lunb}>
                        <div className={styles.threeClass} onClick={this.pushhas.bind(this, 'threeClass')}>
                            {/* <img src={threeZi} style={{ height: 'auto', maxWidth: '100%',marginLeft:'70px',marginTop:'90px'}} /> */}
                        </div>
                        <div className={styles.Carousel}>
                            <Carousel autoplay>{lunbimg}</Carousel>
                        </div>
                    </div>
                    <div className={styles.infom}>
                        <div className={styles.imgfo} onClick={this.pushhas.bind(this, 'partyBuilding')}>
                            <img src={dj1} style={{ display: 'inline-block', height: 'auto', maxWidth: '100%' }} />
                            <p>党建要闻</p>
                        </div>
                        <div className={styles.imgfo} onClick={this.pushhas.bind(this, 'dynamic')}>
                            <img src={dj2} style={{ display: 'inline-block', height: 'auto', maxWidth: '100%' }} />
                            <p>组织动态</p>
                        </div>
                        <div className={styles.imgfo} onClick={this.pushhas.bind(this, 'partyMember')}>
                            <img src={dj3} style={{ display: 'inline-block', height: 'auto', maxWidth: '100%' }} />
                            <p>党员风采</p>
                        </div>
                        <div className={styles.imgfo} onClick={this.pushhas.bind(this, 'leader')}>
                            <img src={dj4} style={{ display: 'inline-block', height: 'auto', maxWidth: '100%' }} />
                            <p>领导关怀</p>
                        </div>
                        <div className={styles.imgfo} onClick={this.pushhas.bind(this, 'propaganda')}>
                            <img src={dj5} style={{ display: 'inline-block', height: 'auto', maxWidth: '100%' }} />
                            <p>宣传阵地</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
